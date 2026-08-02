export type TrackState = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

export type Direction = "northwest" | "northeast" | "southwest" | "southeast";

export type VisualConfig = {
  backgroundOpacity: number;
  saturation: number;
  contrast: number;
  brightness: number;
  idleDisplacement: number;
  maxDisplacement: number;
  idleBlur: number;
  maxBlur: number;
  noiseScale: number;
  scrollInfluence: number;
  audioInfluence: number;
  desktopFocalPoint: [number, number];
  mobileFocalPoint: [number, number];
  arrowMaxDisplacement: number;
  arrowBlur: number;
  settleSpeed: number;
};

export type Track = {
  number: string;
  artist: string;
  title: string;
  audioSource: string;
  direction: Direction;
  blobPath: string;
};

export type Release = {
  slug: string;
  title: string;
  catalogueNumber: string;
  coverImage: string;
  year: string;
  location: string;
  label: string;
  credits: string[];
  bandcampUrl: string;
  featured: boolean;
  tracks: Track[];
  additionalText?: string[];
  visualConfig?: Partial<VisualConfig>;
};
