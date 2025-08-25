export interface ContentItem {
  content_tr: string;
  content_en: string;
}

export interface VisionImage {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface Vision {
  id: string;
  title_tr: string;
  title_en: string;
  contents: ContentItem[];
  images?: VisionImage[];
  createdAt: string;
  updatedAt: string;
}
