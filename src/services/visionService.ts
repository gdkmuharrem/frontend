import api from '@/libs/api';
import { Vision, VisionImage } from '@/types/vision';

const Vision_URL = '/visions/public';
const IMAGE_URL = '/vision-images/public';

export class VisionService {
  // Tüm Vision içerikleri
  async getAllVisions(): Promise<Vision[]> {
    const res = await api.get<Vision[]>(`${Vision_URL}`);
    return res.data;
  }

  // Tek bir Vision içeriği
  async getVisionById(id: string): Promise<Vision> {
    const res = await api.get<Vision>(`${Vision_URL}/${id}`);
    return res.data;
  }

  // Bir Vision'a bağlı tüm resimler
  async getImagesByVision(visionId: string): Promise<VisionImage[]> {
    const res = await api.get<VisionImage[]>(`${IMAGE_URL}/vision/${visionId}`);
    return res.data;
  }

  // Tek bir resim
  async getImageById(id: string): Promise<VisionImage> {
    const res = await api.get<VisionImage>(`${IMAGE_URL}/${id}`);
    return res.data;
  }
}
