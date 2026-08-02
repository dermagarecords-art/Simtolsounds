"use client";

import type { TrackState } from "@/types/release";

type Props = {
  artist: string;
  title: string;
  active: boolean;
  status: TrackState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};

export function TrackControls({ artist, title, active, status, onPlay, onPause, onStop }: Props) {
  const label = `${artist}, ${title}`;
  return <div className="track-controls" aria-label={`${label} controls`}>
    <button type="button" onClick={onPlay} aria-label={`Play ${label}`} title={`Play ${title}`} aria-pressed={active && status === "playing"}><span className="control-icon icon-play" aria-hidden="true" /></button>
    <button type="button" onClick={onPause} disabled={!active || status !== "playing"} aria-label={`Pause ${label}`} title={`Pause ${title}`} aria-pressed={active && status === "paused"}><span className="control-icon icon-pause" aria-hidden="true" /></button>
    <button type="button" onClick={onStop} disabled={!active} aria-label={`Stop ${label}`} title={`Stop ${title}`}><span className="control-icon icon-stop" aria-hidden="true" /></button>
  </div>;
}
