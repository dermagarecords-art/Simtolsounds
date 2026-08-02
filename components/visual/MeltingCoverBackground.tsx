"use client";

import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import Image from "next/image";
import * as THREE from "three";
import { createMeltingCoverFragmentShader, meltingCoverVertexShader } from "@/components/visual/shaders/meltingCover";
import type { ScrollMotionController } from "@/hooks/useScrollVelocity";
import type { VisualConfig } from "@/types/release";

type Props = {
  coverImage: string;
  config: VisualConfig;
  scrollMotion: ScrollMotionController;
  audioEnergyRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

export default function MeltingCoverBackground({ coverImage, config, scrollMotion, audioEnergyRef, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef(config);
  const reducedMotionRef = useRef(reducedMotion);
  const [ready, setReady] = useState(false);

  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const forceFallback = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("noWebGL") === "1";
    if (forceFallback) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let texture: THREE.Texture | null = null;
    let frame = 0;
    let resizeFrame = 0;
    let disposed = false;
    let visible = document.visibilityState === "visible";
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const initialConfig = configRef.current;
    const initialReducedMotion = reducedMotionRef.current;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTexture: { value: new THREE.Texture() },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTextureResolution: { value: new THREE.Vector2(1, 1) },
      uOpacity: { value: initialConfig.backgroundOpacity },
      uDisplacementStrength: { value: initialConfig.idleDisplacement },
      uBlurStrength: { value: initialConfig.idleBlur },
      uNoiseScale: { value: initialConfig.noiseScale },
      uScrollVelocity: { value: 0 },
      uScrollDirection: { value: 0 },
      uAudioEnergy: { value: 0 },
      uFocalPoint: { value: new THREE.Vector2(...(mobile ? initialConfig.mobileFocalPoint : initialConfig.desktopFocalPoint)) },
      uReducedMotion: { value: initialReducedMotion ? 1 : 0 },
      uSaturation: { value: initialConfig.saturation },
      uContrast: { value: initialConfig.contrast },
      uBrightness: { value: initialConfig.brightness },
    };
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: meltingCoverVertexShader,
      fragmentShader: createMeltingCoverFragmentShader(mobile),
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      if (!renderer) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uResolution.value.set(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);
    };
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    };
    resize();
    window.addEventListener("resize", onResize, { passive: true });

    let currentDisplacement = initialConfig.idleDisplacement;
    let currentBlur = initialConfig.idleBlur;
    const started = performance.now();
    const render = (now: number) => {
      if (disposed || !renderer || !material || !visible) return;
      const settings = configRef.current;
      const motion = scrollMotion.motionRef.current;
      const energy = audioEnergyRef.current;
      const mobileScale = mobile ? 0.58 : 1;
      const influence = Math.min(1, motion.velocity * settings.scrollInfluence + energy * settings.audioInfluence);
      const targetDisplacement = reducedMotionRef.current ? 0 : (settings.idleDisplacement + (settings.maxDisplacement - settings.idleDisplacement) * influence) * mobileScale;
      const targetBlur = reducedMotionRef.current ? 0 : settings.idleBlur + (settings.maxBlur - settings.idleBlur) * influence * mobileScale;
      const settle = Math.max(0.02, Math.min(0.22, settings.settleSpeed));
      currentDisplacement += (targetDisplacement - currentDisplacement) * settle;
      currentBlur += (targetBlur - currentBlur) * settle;
      uniforms.uTime.value = (now - started) / 1000;
      uniforms.uOpacity.value = settings.backgroundOpacity;
      uniforms.uDisplacementStrength.value = currentDisplacement;
      uniforms.uBlurStrength.value = currentBlur;
      uniforms.uNoiseScale.value = settings.noiseScale;
      uniforms.uScrollVelocity.value = motion.velocity;
      uniforms.uScrollDirection.value = motion.direction;
      uniforms.uAudioEnergy.value = energy;
      uniforms.uReducedMotion.value = reducedMotionRef.current ? 1 : 0;
      uniforms.uSaturation.value = settings.saturation;
      uniforms.uContrast.value = settings.contrast;
      uniforms.uBrightness.value = settings.brightness;
      uniforms.uFocalPoint.value.fromArray(mobile ? settings.mobileFocalPoint : settings.desktopFocalPoint);
      renderer.render(scene, camera);
      if (!reducedMotionRef.current) frame = requestAnimationFrame(render);
    };

    const startRendering = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) startRendering();
      else cancelAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    new THREE.TextureLoader().load(
      coverImage,
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }
        texture = loadedTexture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        uniforms.uTexture.value = texture;
        const image = texture.image as { width: number; height: number };
        uniforms.uTextureResolution.value.set(image.width, image.height);
        setReady(true);
        startRendering();
      },
      undefined,
      () => setReady(false),
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      texture?.dispose();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [audioEnergyRef, coverImage, scrollMotion]);

  return (
    <div className="melting-background" aria-hidden="true">
      <Image src={coverImage} alt="" fill sizes="100vw" priority className={`cover-fallback ${ready ? "is-hidden" : ""}`} />
      <canvas ref={canvasRef} className="melting-cover-canvas" aria-hidden="true" />
      <div className="cover-veil" />
    </div>
  );
}
