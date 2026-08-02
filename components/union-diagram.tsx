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
  { x: 344, y: 44, startX: 482, startY: 334, lineX: 360, lineY: 105, head: "342,135 344,44 392,118 366,104" },
  { x: 656, y: 44, startX: 518, startY: 334, lineX: 640, lineY: 105, head: "658,135 656,44 608,118 634,104" },
  { x: 344, y: 706, startX: 482, startY: 418, lineX: 360, lineY: 645, head: "342,615 344,706 392,632 366,646" },
  { x: 656, y: 706, startX: 518, startY: 418, lineX: 640, lineY: 645, head: "658,615 656,706 608,632 634,646" },
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
          const figureTransform = `translate(${index === 0 ? 220 : index === 1 ? 600 : index === 2 ? 220 : 600} ${index < 2 ? 150 : 386}) scale(${1 + (active ? amplitude * 0.08 : 0)})`;
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
