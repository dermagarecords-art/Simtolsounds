"use client";

import type { Dispatch, SetStateAction } from "react";
import type { VisualConfig } from "@/types/release";

type NumericKey = Exclude<keyof VisualConfig, "desktopFocalPoint" | "mobileFocalPoint">;
const controls: Array<{ key: NumericKey; label: string; min: number; max: number; step: number }> = [
  { key: "backgroundOpacity", label: "Opacity", min: 0, max: 1, step: 0.01 },
  { key: "saturation", label: "Saturation", min: 0, max: 1.5, step: 0.01 },
  { key: "contrast", label: "Contrast", min: 0.5, max: 1.5, step: 0.01 },
  { key: "brightness", label: "Brightness", min: 0.5, max: 1.5, step: 0.01 },
  { key: "idleDisplacement", label: "Idle melt", min: 0, max: 0.06, step: 0.001 },
  { key: "maxDisplacement", label: "Max melt", min: 0, max: 0.1, step: 0.001 },
  { key: "idleBlur", label: "Idle blur", min: 0, max: 8, step: 0.1 },
  { key: "maxBlur", label: "Max blur", min: 0, max: 14, step: 0.1 },
  { key: "noiseScale", label: "Noise scale", min: 0.3, max: 4, step: 0.05 },
  { key: "scrollInfluence", label: "Scroll", min: 0, max: 1.5, step: 0.01 },
  { key: "audioInfluence", label: "Audio", min: 0, max: 0.3, step: 0.01 },
  { key: "arrowMaxDisplacement", label: "Arrow melt", min: 0, max: 40, step: 1 },
  { key: "arrowBlur", label: "Arrow blur", min: 0, max: 3, step: 0.1 },
  { key: "settleSpeed", label: "Settle speed", min: 0.02, max: 0.22, step: 0.01 },
];

type Props = { config: VisualConfig; setConfig: Dispatch<SetStateAction<VisualConfig>> };

export function VisualDebugPanel({ config, setConfig }: Props) {
  const enabled = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("debugVisuals") === "1";
  if (!enabled) return null;

  const setNumeric = (key: NumericKey, value: number) => setConfig((current) => ({ ...current, [key]: value }));
  const setFocal = (axis: 0 | 1, value: number) => setConfig((current) => ({
    ...current,
    desktopFocalPoint: axis === 0 ? [value, current.desktopFocalPoint[1]] : [current.desktopFocalPoint[0], value],
    mobileFocalPoint: axis === 0 ? [value, current.mobileFocalPoint[1]] : [current.mobileFocalPoint[0], value],
  }));

  return <aside className="visual-debug" aria-label="Visual tuning panel">
    <strong>VISUAL TUNING</strong>
    {controls.map((control) => <label key={control.key}>
      <span>{control.label}</span>
      <input type="range" min={control.min} max={control.max} step={control.step} value={config[control.key]} onChange={(event) => setNumeric(control.key, Number(event.target.value))} />
    </label>)}
    <label><span>Focal X</span><input type="range" min="0.2" max="0.8" step="0.01" value={config.desktopFocalPoint[0]} onChange={(event) => setFocal(0, Number(event.target.value))} /></label>
    <label><span>Focal Y</span><input type="range" min="0.2" max="0.8" step="0.01" value={config.desktopFocalPoint[1]} onChange={(event) => setFocal(1, Number(event.target.value))} /></label>
  </aside>;
}
