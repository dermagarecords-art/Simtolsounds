export const meltingCoverVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const noiseSource = `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
`;

export function createMeltingCoverFragmentShader(mobile: boolean) {
  const extraSamples = mobile
    ? ""
    : `
      colour += texture2D(uTexture, clamp(displacedUv + vec2(-blurUv.x, blurUv.y) * 0.72, 0.001, 0.999));
      colour += texture2D(uTexture, clamp(displacedUv + vec2(blurUv.x, -blurUv.y) * 0.72, 0.001, 0.999));
    `;
  const divisor = mobile ? "5.0" : "7.0";

  return `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uTextureResolution;
    uniform float uOpacity;
    uniform float uDisplacementStrength;
    uniform float uBlurStrength;
    uniform float uNoiseScale;
    uniform float uScrollVelocity;
    uniform float uScrollDirection;
    uniform float uAudioEnergy;
    uniform vec2 uFocalPoint;
    uniform float uReducedMotion;
    uniform float uSaturation;
    uniform float uContrast;
    uniform float uBrightness;
    ${noiseSource}

    vec2 coverUv(vec2 uv) {
      float viewportAspect = uResolution.x / max(uResolution.y, 1.0);
      float textureAspect = uTextureResolution.x / max(uTextureResolution.y, 1.0);
      vec2 crop = viewportAspect > textureAspect
        ? vec2(1.0, textureAspect / viewportAspect)
        : vec2(viewportAspect / textureAspect, 1.0);
      return (uv - 0.5) * crop + uFocalPoint;
    }

    void main() {
      vec2 baseUv = coverUv(vUv);
      float t = uTime * 0.018;
      float broad = valueNoise(baseUv * (uNoiseScale * 1.1) + vec2(t * 0.37, -t * 0.19));
      float fold = valueNoise(baseUv.yx * (uNoiseScale * 1.85) + vec2(-t * 0.13, t * 0.31));
      float local = valueNoise(baseUv * (uNoiseScale * 2.7) + vec2(t * 0.09, t * 0.14));
      float motionGate = 1.0 - uReducedMotion;
      vec2 displacement = vec2(
        (broad - 0.5) * 1.15 + (local - 0.5) * 0.22,
        (fold - 0.5) * 0.92 + (broad - 0.5) * 0.18
      );
      displacement.y += uScrollDirection * uScrollVelocity * 0.55;
      displacement.x += sin(baseUv.y * 4.7 + broad * 2.0) * uScrollVelocity * 0.12;
      displacement *= uDisplacementStrength * motionGate;
      displacement *= 1.0 + uAudioEnergy * 0.1;
      vec2 displacedUv = clamp(baseUv + displacement, 0.001, 0.999);
      vec2 blurUv = vec2(uBlurStrength / max(uResolution.x, 1.0), uBlurStrength / max(uResolution.y, 1.0));
      vec4 colour = texture2D(uTexture, displacedUv);
      colour += texture2D(uTexture, clamp(displacedUv + vec2(blurUv.x, 0.0), 0.001, 0.999));
      colour += texture2D(uTexture, clamp(displacedUv - vec2(blurUv.x, 0.0), 0.001, 0.999));
      colour += texture2D(uTexture, clamp(displacedUv + vec2(0.0, blurUv.y), 0.001, 0.999));
      colour += texture2D(uTexture, clamp(displacedUv - vec2(0.0, blurUv.y), 0.001, 0.999));
      ${extraSamples}
      colour /= ${divisor};
      float luminance = dot(colour.rgb, vec3(0.299, 0.587, 0.114));
      colour.rgb = mix(vec3(luminance), colour.rgb, uSaturation);
      colour.rgb = (colour.rgb - 0.5) * uContrast + 0.5;
      colour.rgb *= uBrightness;
      gl_FragColor = vec4(colour.rgb, uOpacity);
    }
  `;
}
