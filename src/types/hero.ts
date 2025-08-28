export interface HeroImage {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface HeroModel {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface Hero {
  id: string;
  isActive: boolean;
  images?: HeroImage[];
  models?: HeroModel[];
  createdAt: string;
  updatedAt: string;
}