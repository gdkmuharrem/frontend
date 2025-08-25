import api from '@/libs/api';
import { About, AboutImage } from '@/types/about';

const ABOUT_URL = '/abouts/public';
const IMAGE_URL = '/about-images/public';

export class AboutService {
  // Tüm About içerikleri
  async getAllAbouts(): Promise<About[]> {
    const res = await api.get<About[]>(`${ABOUT_URL}`);
    return res.data;
  }

  // Tek bir About içeriği
  async getAboutById(id: string): Promise<About> {
    const res = await api.get<About>(`${ABOUT_URL}/${id}`);
    return res.data;
  }

  // Bir About'a bağlı tüm resimler
  async getImagesByAbout(aboutId: string): Promise<AboutImage[]> {
    const res = await api.get<AboutImage[]>(`${IMAGE_URL}/about/${aboutId}`);
    return res.data;
  }

  // Tek bir resim
  async getImageById(id: string): Promise<AboutImage> {
    const res = await api.get<AboutImage>(`${IMAGE_URL}/${id}`);
    return res.data;
  }
}
