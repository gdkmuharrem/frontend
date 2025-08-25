// services/productsService.ts
import api from '@/libs/api';
import { Category, Product, ProductImage } from '@/types/products';

const CATEGORY_URL = '/categories/public';
const PRODUCT_URL = '/products/public';
const IMAGE_URL = '/product-images/public';

export class ProductsService {
  // Kategoriler
  async getCategories(): Promise<Category[]> {
    const res = await api.get<Category[]>(`${CATEGORY_URL}`);
    return res.data;
  }

  // Ürünler
  async getProducts(): Promise<Product[]> {
    const res = await api.get<Product[]>(`${PRODUCT_URL}`);
    return res.data;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const res = await api.get<Product[]>(`${PRODUCT_URL}/category/${categoryId}`);
    return res.data;
  }

  // Resimler
  async getImagesByProduct(productId: string): Promise<ProductImage[]> {
    const res = await api.get<ProductImage[]>(`${IMAGE_URL}/product/${productId}`);
    return res.data;
  }
}
