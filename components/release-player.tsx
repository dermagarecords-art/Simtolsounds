"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MeltingCoverBackground from "@/components/visual/MeltingCoverBackground";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { UnionDiagram } from "@/components/union-diagram";
import { TrackControls } from "@/components/release/TrackControls";
import { PlaybackProgress } from "@/components/release/PlaybackProgress";
import { ReleaseCredits } from "@/components/release/ReleaseCredits";
import { TrackPosition } from "@/components/release/TrackPosition";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { useAudioController } from "@/hooks/useAudioController";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { euVisualConfig } from "@/config/visuals";
import type { Release, TrackState } from "@/types/release";

type Props = { release: Release; releasePage?: boolean };

const VisualDebugPanel = dynamic(() => import("@/components/visual/VisualDebugPanel").then((module) => module.VisualDebugPanel), { ssr: false });

export function ReleasePlayer({ release, releasePage = false }: Props) {
  const { audioRef, create: createAudio, dispose: disposeAudio } = useAudioController();
  const animationRef = useRef<number | null>(null);
  const animateRef = useRef<() => void>(() => {});
  const amplitudeUpdateRef = useRef(0);
  const audioEnergyRef = useRef(0);
  const currentTrackRef = useRef<string | null>(null);
  const stoppingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [status, setStatus] = useState<TrackState>("idle");
  const [progress, setProgress] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
  const [errorTrack, setErrorTrack] = useState<string | null>(null);
  const [visualConfig, setVisualConfig] = useState(() => ({ ...euVisualConfig, ...release.visualConfig }));
  const reducedMotion = useReducedMotion();
  const scrollMotion = useScrollVelocity(!reducedMotion);
  const { analyserRef, connect: connectAnalyser, close: closeAnalyser } = useAudioAnalyser();

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }, []);

  const animate = useCallback(() => {
    const analyzer = analyserRef.current;
    const audio = audioRef.current;
    if (!analyzer || !audio || audio.paused || reducedMotionRef.current) return;
    const values = new Uint8Array(analyzer.fftSize);
    analyzer.getByteTimeDomainData(values);
    const energy = values.reduce((sum, value) => sum + Math.abs(value - 128), 0) / values.length / 128;
    const calmEnergy = Math.min(0.55, energy * 1.6);
    audioEnergyRef.current = calmEnergy;
    const now = performance.now();
    if (now - amplitudeUpdateRef.current > 80) {
      setAmplitude(calmEnergy);
      amplitudeUpdateRef.current = now;
    }
    animationRef.current = requestAnimationFrame(animateRef.current);
  }, [analyserRef, audioRef]);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    stoppingRef.current = true;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    stopAnimation();
    setActiveTrack(null);
    setStatus("idle");
    setProgress(0);
    setAmplitude(0);
    audioEnergyRef.current = 0;
    setErrorTrack(null);
    stoppingRef.current = false;
  }, [audioRef, stopAnimation]);

  const pause = useCallback(() => {
    if (!audioRef.current || !activeTrack) return;
    audioRef.current.pause();
    stopAnimation();
    setAmplitude(0);
    audioEnergyRef.current = 0;
    setStatus("paused");
  }, [activeTrack, audioRef, stopAnimation]);

  const play = useCallback(async (trackNumber: string) => {
    const audio = audioRef.current;
    const track = release.tracks.find((item) => item.number === trackNumber);
    if (!audio || !track) return;
    setErrorTrack(null);
    setStatus("loading");
    setActiveTrack(trackNumber);
    try {
      if (!reducedMotionRef.current) await connectAnalyser(audio);
      if (currentTrackRef.current !== trackNumber) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = track.audioSource;
        audio.load();
        currentTrackRef.current = trackNumber;
        setProgress(0);
      }
      await audio.play();
      setStatus("playing");
      stopAnimation();
      if (!reducedMotionRef.current) animationRef.current = requestAnimationFrame(animate);
    } catch {
      stopAnimation();
      setStatus("error");
      setErrorTrack(trackNumber);
      setAmplitude(0);
      audioEnergyRef.current = 0;
    }
  }, [animate, audioRef, connectAnalyser, release.tracks, stopAnimation]);

  useEffect(() => {
    const audio = createAudio();
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onPlay = () => setStatus("playing");
    const onPause = () => {
      if (!stoppingRef.current && !audio.ended) setStatus("paused");
    };
    const onEnded = () => {
      stopAnimation();
      setStatus("idle");
      setActiveTrack(null);
      setProgress(0);
      setAmplitude(0);
      audioEnergyRef.current = 0;
    };
    const onError = () => {
      stopAnimation();
      setStatus("error");
      setErrorTrack(currentTrackRef.current);
      setAmplitude(0);
      audioEnergyRef.current = 0;
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      stopAnimation();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      closeAnalyser();
      disposeAudio(audio);
    };
  }, [closeAnalyser, createAudio, disposeAudio, stopAnimation]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  return (
    <main className={`release-player ${releasePage ? "release-page" : "home-page"}`}>
      <MeltingCoverBackground coverImage={release.coverImage} config={visualConfig} scrollMotion={scrollMotion} audioEnergyRef={audioEnergyRef} reducedMotion={reducedMotion} />
      <Header catalogueNumber={release.catalogueNumber} title={release.title} />
      <section className="listening-field" aria-label={`${release.title} interactive player`}>
        <div className="track-stage">
          <UnionDiagram release={release} activeTrack={activeTrack} progress={progress} amplitude={amplitude} onStop={stop} scrollMotion={scrollMotion} visualConfig={visualConfig} reducedMotion={reducedMotion} />
          {release.tracks.map((track) => {
            const isActive = activeTrack === track.number;
            return (
              <TrackPosition className={`track-track track-${track.number} ${isActive ? "is-active" : ""}`} key={track.number}>
                <p className="track-number">{track.number}</p>
                <h2>{track.title}</h2>
                <p className="track-artist">{track.artist}</p>
                <TrackControls artist={track.artist} title={track.title} active={isActive} status={status} onPlay={() => play(track.number)} onPause={pause} onStop={stop} />
                <PlaybackProgress status={status} active={isActive} error={errorTrack === track.number} />
              </TrackPosition>
            );
          })}
        </div>
      </section>
      {releasePage ? <ReleaseCredits release={release} /> : null}
      <Footer />
      <VisualDebugPanel config={visualConfig} setConfig={setVisualConfig} />
    </main>
  );
}
