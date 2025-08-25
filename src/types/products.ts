// types/products.ts

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  slug_tr: string;
  slug_en: string;
  isActive: boolean;
  order: number;
  parentId?: string | null;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  originalName: string;
  filePath: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name_tr: string;
  name_en: string;
  description_tr?: string | null;
  description_en?: string | null;
  price: number;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  isActive: boolean;
  createdAt: string;
}
