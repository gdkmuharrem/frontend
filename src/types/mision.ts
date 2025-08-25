export interface ContentItem {
  content_tr: string;
  content_en: string;
}

export interface MisionImage {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface Mision {
  id: string;
  title_tr: string;
  title_en: string;
  contents: ContentItem[];
  images?: MisionImage[];
  createdAt: string;
  updatedAt: string;
}
