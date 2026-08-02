"use client";

import { useCallback, useRef } from "react";

/** Owns the one native audio element shared by a release player. */
export function useAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const create = useCallback(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;
    return audio;
  }, []);

  const dispose = useCallback((audio: HTMLAudioElement) => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    if (audioRef.current === audio) audioRef.current = null;
  }, []);

  return { audioRef, create, dispose };
}
