export interface ImageAsset {
  id: string;
  url: string;
  type: 'uploaded' | 'generated' | 'edited';
  createdAt: number;
  prompt?: string;
}

export enum AppSection {
  HOME = 'HOME',
  GALLERY = 'GALLERY',
  EDITOR = 'EDITOR',
  GENERATOR = 'GENERATOR'
}

export interface GenerationConfig {
  aspectRatio?: string;
}