"use client";

import { useEffect, useRef } from "react";
import type { Release } from "@/types/release";
import type { VisualConfig } from "@/types/release";
import type { ScrollMotionController } from "@/hooks/useScrollVelocity";

type Props = {
  release: Release;
  activeTrack: string | null;
  progress: number;
  amplitude: number;
  onStop: () => void;
  scrollMotion: ScrollMotionController;
  visualConfig: VisualConfig;
  reducedMotion: boolean;
};

const axes = [
  { x: 359, y: 58, startX: 486, startY: 342, lineX: 379, lineY: 115, head: "357,144 359,58 404,128 379,115" },
  { x: 641, y: 58, startX: 514, startY: 342, lineX: 621, lineY: 115, head: "643,144 641,58 596,128 621,115" },
  { x: 359, y: 692, startX: 486, startY: 410, lineX: 379, lineY: 635, head: "357,606 359,692 404,622 379,635" },
  { x: 641, y: 692, startX: 514, startY: 410, lineX: 621, lineY: 635, head: "643,606 641,692 596,622 621,635" },
];

export function UnionDiagram({ release, activeTrack, progress, amplitude, onStop, scrollMotion, visualConfig, reducedMotion }: Props) {
  const arrowLayerRef = useRef<SVGGElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  useEffect(() => scrollMotion.subscribe((motion) => {
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const maximum = mobile ? Math.min(16, visualConfig.arrowMaxDisplacement) : visualConfig.arrowMaxDisplacement;
    const strength = reducedMotion ? 0 : motion.velocity * maximum;
    const blur = reducedMotion ? 0 : motion.velocity * visualConfig.arrowBlur;
    displacementRef.current?.setAttribute("scale", strength.toFixed(2));
    blurRef.current?.setAttribute("stdDeviation", blur.toFixed(2));
    arrowLayerRef.current?.setAttribute("transform", `translate(0 ${(motion.direction * motion.velocity * (mobile ? 4 : 8)).toFixed(2)})`);
  }), [reducedMotion, scrollMotion, visualConfig.arrowBlur, visualConfig.arrowMaxDisplacement]);

  return (
    <div className="diagram-shell" aria-label="EU union diagram">
      <svg className="union-diagram" viewBox="0 0 1000 750" role="img" aria-labelledby="diagram-title">
        <title id="diagram-title">Four figures meet at a central intersection. Each direction represents one track.</title>
        <defs>
          <filter id="scroll-melt" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" result="displaced" />
            <feGaussianBlur ref={blurRef} in="displaced" stdDeviation="0" />
          </filter>
        </defs>
        <g ref={arrowLayerRef} className="meltable-arrow-layer" filter={reducedMotion ? undefined : "url(#scroll-melt)"}>
          {release.tracks.map((track, index) => {
            const axis = axes[index];
            const active = activeTrack === track.number;
            return <g key={track.number} className={`diagram-track ${active ? "is-active" : ""}`}>
              <line className="axis-line" x1={axis.startX} y1={axis.startY} x2={axis.lineX} y2={axis.lineY} />
              <polygon className="axis-arrowhead" points={axis.head} />
            </g>;
          })}
        </g>
        {release.tracks.map((track, index) => {
          const axis = axes[index];
          const active = activeTrack === track.number;
          const markerX = 500 + (axis.x - 500) * progress;
          const markerY = 376 + (axis.y - 376) * progress;
          const figureTransform = `translate(${index === 0 ? 250 : index === 1 ? 590 : index === 2 ? 252 : 590} ${index < 2 ? 152 : 386}) scale(${1 + (active ? amplitude * 0.08 : 0)})`;
          return (
            <g key={track.number} className={`diagram-figure-track ${active ? "is-active" : ""}`}>
              <g className="figure" transform={figureTransform} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <path d={track.blobPath} />
                {(index === 1 || index === 3) && <path className="figure-dot" d={index === 1 ? "M133 61c13-7 24 2 24 15 0 10-6 16-14 16-11-1-18-18-10-31Z" : "M70 109c12-10 27-4 27 9 0 10-9 19-21 18-12-1-16-17-6-27Z"} />}
                <text x="101" y="112" className="figure-number">{track.number}</text>
              </g>
              {active && <circle className="progress-marker" cx={markerX} cy={markerY} r="7" />}
            </g>
          );
        })}
        <g className="intersection-mark" aria-hidden="true">
          <line x1="482" y1="358" x2="518" y2="394" />
          <line x1="518" y1="358" x2="482" y2="394" />
        </g>
      </svg>
      <button className="central-stop" type="button" onClick={onStop} aria-label="Stop all playback" title="Stop all playback" />
    </div>
  );
}
