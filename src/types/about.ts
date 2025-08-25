export interface ContentItem {
  content_tr: string;
  content_en: string;
}

export interface AboutImage {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface About {
  id: string;
  title_tr: string;
  title_en: string;
  contents: ContentItem[];
  images?: AboutImage[];
  createdAt: string;
  updatedAt: string;
}
