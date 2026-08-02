"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";

export type ScrollMotion = { velocity: number; direction: -1 | 0 | 1 };
export type ScrollMotionController = {
  motionRef: MutableRefObject<ScrollMotion>;
  subscribe: (listener: (motion: ScrollMotion) => void) => () => void;
};

export function useScrollVelocity(enabled = true): ScrollMotionController {
  const motionRef = useRef<ScrollMotion>({ velocity: 0, direction: 0 });
  const listenersRef = useRef(new Set<(motion: ScrollMotion) => void>());
  const lastPositionRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetRef = useRef(0);
  const directionRef = useRef<-1 | 0 | 1>(0);
  const frameRef = useRef<number | null>(null);

  const subscribe = useCallback((listener: (motion: ScrollMotion) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  useEffect(() => {
    if (!enabled) {
      motionRef.current = { velocity: 0, direction: 0 };
      return;
    }

    lastPositionRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    const publish = () => {
      const current = motionRef.current.velocity;
      const next = current + (targetRef.current - current) * 0.12;
      targetRef.current *= 0.86;
      const settled = next < 0.002 && targetRef.current < 0.002;
      const motion: ScrollMotion = {
        velocity: settled ? 0 : Math.min(1, next),
        direction: settled ? 0 : directionRef.current,
      };
      motionRef.current = motion;
      listenersRef.current.forEach((listener) => listener(motion));
      frameRef.current = settled ? null : requestAnimationFrame(publish);
    };

    const onScroll = () => {
      const now = performance.now();
      const position = window.scrollY;
      const delta = position - lastPositionRef.current;
      const elapsed = Math.min(64, Math.max(16, now - lastTimeRef.current));
      targetRef.current = Math.min(1, Math.abs(delta / elapsed) / 1.4);
      directionRef.current = delta === 0 ? directionRef.current : delta > 0 ? 1 : -1;
      lastPositionRef.current = position;
      lastTimeRef.current = now;
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(publish);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, motionRef]);

  return useMemo(() => ({ motionRef, subscribe }), [subscribe]);
}
