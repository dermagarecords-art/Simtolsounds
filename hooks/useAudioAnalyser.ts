"use client";

import { useCallback, useRef } from "react";

export function useAudioAnalyser() {
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const connect = useCallback(async (audio: HTMLAudioElement) => {
    if (!contextRef.current) {
      const context = new AudioContext();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyser.connect(context.destination);
      contextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
    await contextRef.current.resume();
    return analyserRef.current;
  }, []);

  const close = useCallback(() => {
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    contextRef.current?.close();
    sourceRef.current = null;
    analyserRef.current = null;
    contextRef.current = null;
  }, []);

  return { analyserRef, connect, close };
}
