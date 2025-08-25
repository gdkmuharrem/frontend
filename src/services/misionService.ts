import api from '@/libs/api';
import { Mision, MisionImage } from '@/types/mision';

const Mision_URL = '/misions/public';
const IMAGE_URL = '/mision-images/public';

export class MisionService {
  // Tüm Mision içerikleri
  async getAllMisions(): Promise<Mision[]> {
    const res = await api.get<Mision[]>(`${Mision_URL}`);
    return res.data;
  }

  // Tek bir Mision içeriği
  async getMisionById(id: string): Promise<Mision> {
    const res = await api.get<Mision>(`${Mision_URL}/${id}`);
    return res.data;
  }

  // Bir Mision'a bağlı tüm resimler
  async getImagesByMision(misionId: string): Promise<MisionImage[]> {
    const res = await api.get<MisionImage[]>(`${IMAGE_URL}/mision/${misionId}`);
    return res.data;
  }

  // Tek bir resim
  async getImageById(id: string): Promise<MisionImage> {
    const res = await api.get<MisionImage>(`${IMAGE_URL}/${id}`);
    return res.data;
  }
}
