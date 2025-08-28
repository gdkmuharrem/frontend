import api from '@/libs/api';
import { Hero, HeroImage, HeroModel } from '@/types/hero';

const HERO_URL = '/heros/public';
const HERO_IMAGE_URL = '/hero-images/public';
const HERO_MODEL_URL = '/hero-models/public';

export class HeroService {
  // Aktif hero'yu getir
  async getActiveHero(): Promise<Hero> {
    const res = await api.get<Hero>(`${HERO_URL}/active`);
    return this.cleanHeroData(res.data);
  }

  // Tüm hero'ları getir
  async getAllHeroes(): Promise<Hero[]> {
    const res = await api.get<Hero[]>(HERO_URL);
    return res.data.map(hero => this.cleanHeroData(hero));
  }

  // ID ile hero getir
  async getHeroById(id: string): Promise<Hero> {
    const res = await api.get<Hero>(`${HERO_URL}/${id}`);
    return this.cleanHeroData(res.data);
  }

  // Hero'ya ait resimleri getir
  async getImagesByHero(heroId: string): Promise<HeroImage[]> {
    const res = await api.get<HeroImage[]>(`${HERO_IMAGE_URL}/${heroId}`);
    return res.data.map(image => this.cleanImageData(image));
  }

  // Hero'ya ait modelleri getir
  async getModelsByHero(heroId: string): Promise<HeroModel[]> {
    const res = await api.get<HeroModel[]>(`${HERO_MODEL_URL}/${heroId}`);
    return res.data.map(model => this.cleanModelData(model));
  }

  // Tek bir resim getir
  async getImageById(id: string): Promise<HeroImage> {
    const res = await api.get<HeroImage>(`${HERO_IMAGE_URL}/image/${id}`);
    return this.cleanImageData(res.data);
  }

  // Tek bir model getir
  async getModelById(id: string): Promise<HeroModel> {
    const res = await api.get<HeroModel>(`${HERO_MODEL_URL}/model/${id}`);
    return this.cleanModelData(res.data);
  }

  // Helper methods for cleaning file paths
  private cleanHeroData(hero: Hero): Hero {
    return {
      ...hero,
      images: hero.images?.map(image => this.cleanImageData(image)),
      models: hero.models?.map(model => this.cleanModelData(model))
    };
  }

  private cleanImageData(image: HeroImage): HeroImage {
    return {
      ...image,
      filePath: this.cleanFilePath(image.filePath)
    };
  }

  private cleanModelData(model: HeroModel): HeroModel {
    return {
      ...model,
      filePath: this.cleanFilePath(model.filePath)
    };
  }

  private cleanFilePath(filePath: string): string {
    // Backslash'leri forward slash'a çevir ve baştaki slash'ları temizle
    return filePath
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');
  }
}