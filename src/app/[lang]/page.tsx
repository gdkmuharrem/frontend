"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/components/Home.module.css";

import HeroSection from "@/components/HeroSection";
import { HeroService } from "@/services/heroService";
import { AboutService } from "@/services/aboutService";
import { MisionService } from "@/services/misionService";
import { VisionService } from "@/services/visionService";
import { ProductsService } from "@/services/productsService";

import { Hero } from "@/types/hero";
import { About, AboutImage } from "@/types/about";
import { Mision, MisionImage } from "@/types/mision";
import { Vision, VisionImage } from "@/types/vision";
import { Product } from "@/types/products";

// Servisleri oluştur
const heroService = new HeroService();
const aboutService = new AboutService();
const misionService = new MisionService();
const visionService = new VisionService();
const productsService = new ProductsService();

export default function Home() {
  const { lang } = useParams();
  const router = useRouter();

  // State
  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [aboutImages, setAboutImages] = useState<AboutImage[]>([]);
  const [misionData, setMisionData] = useState<Mision | null>(null);
  const [misionImages, setMisionImages] = useState<MisionImage[]>([]);
  const [visionData, setVisionData] = useState<Vision | null>(null);
  const [visionImages, setVisionImages] = useState<VisionImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    hero: true,
    about: true,
    mision: true,
    vision: true,
    products: true,
  });

  // Refs for IntersectionObserver
  const aboutRef = useRef<HTMLDivElement>(null);
  const misionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const titleRefs = {
    about: useRef<HTMLHeadingElement>(null),
    mision: useRef<HTMLHeadingElement>(null),
    vision: useRef<HTMLHeadingElement>(null),
    contact: useRef<HTMLHeadingElement>(null),
    products: useRef<HTMLHeadingElement>(null),
  };

  // Navigation handlers
  const handleDetailsClick = useCallback(
    (page: string) => router.push(`/${lang}/${page}`),
    [lang, router]
  );

  const handleContactClick = () => router.push(`/${lang}/contact`);
  const handleProductsClick = () => router.push(`/${lang}/products`);

  // Hero yükleme
  useEffect(() => {
    async function loadHero() {
      try {
        console.log("Loading hero data...");
        const hero = await heroService.getActiveHero();
        console.log("Hero data:", hero);
        if (hero) setHeroData(hero);
      } catch (err) {
        console.error("Hero yüklenirken hata:", err);
        setHeroData(null);
      } finally {
        setLoading((prev) => ({ ...prev, hero: false }));
      }
    }
    loadHero();
  }, []);

  // About, Mision, Vision yükleme
  useEffect(() => {
    async function loadAbout() {
      try {
        console.log("Loading about data...");
        const abouts = await aboutService.getAllAbouts();
        console.log("About API response:", abouts);

        if (!abouts || abouts.length === 0) {
          console.log("No about data found");
          setAboutData(null);
          setAboutImages([]);
          return;
        }

        const about = abouts[0];
        console.log("Selected about:", about);
        setAboutData(about);

        let images: AboutImage[] = [];
        if (about.images && about.images.length > 0) {
          images = about.images;
          console.log("Using embedded images:", images);
        } else {
          console.log("Fetching images separately...");
          images = await aboutService.getImagesByAbout(about.id);
          console.log("Fetched images:", images);
        }
        setAboutImages(images || []);
      } catch (err) {
        console.error("About yüklenirken hata:", err);
        setAboutData(null);
        setAboutImages([]);
      } finally {
        setLoading((prev) => ({ ...prev, about: false }));
      }
    }

    async function loadMision() {
      try {
        console.log("Loading mision data...");
        const misions = await misionService.getAllMisions();
        console.log("Mision API response:", misions);

        if (!misions || misions.length === 0) {
          console.log("No mision data found");
          setMisionData(null);
          setMisionImages([]);
          return;
        }

        const mision = misions[0];
        console.log("Selected mision:", mision);
        setMisionData(mision);

        let images: MisionImage[] = [];
        if (mision.images && mision.images.length > 0) {
          images = mision.images;
          console.log("Using embedded images:", images);
        } else {
          console.log("Fetching images separately...");
          images = await misionService.getImagesByMision(mision.id);
          console.log("Fetched images:", images);
        }
        setMisionImages(images || []);
      } catch (err) {
        console.error("Mision yüklenirken hata:", err);
        setMisionData(null);
        setMisionImages([]);
      } finally {
        setLoading((prev) => ({ ...prev, mision: false }));
      }
    }

    async function loadVision() {
      try {
        console.log("Loading vision data...");
        const visions = await visionService.getAllVisions();
        console.log("Vision API response:", visions);

        if (!visions || visions.length === 0) {
          console.log("No vision data found");
          setVisionData(null);
          setVisionImages([]);
          return;
        }

        const vision = visions[0];
        console.log("Selected vision:", vision);
        setVisionData(vision);

        let images: VisionImage[] = [];
        if (vision.images && vision.images.length > 0) {
          images = vision.images;
          console.log("Using embedded images:", images);
        } else {
          console.log("Fetching images separately...");
          images = await visionService.getImagesByVision(vision.id);
          console.log("Fetched images:", images);
        }
        setVisionImages(images || []);
      } catch (err) {
        console.error("Vision yüklenirken hata:", err);
        setVisionData(null);
        setVisionImages([]);
      } finally {
        setLoading((prev) => ({ ...prev, vision: false }));
      }
    }

    loadAbout();
    loadMision();
    loadVision();
  }, [lang]);

  // Products yükleme
  useEffect(() => {
    async function loadProducts() {
      try {
        console.log("Loading products data...");
        const [, prods] = await Promise.all([
          productsService.getCategories(),
          productsService.getProducts(),
        ]);

        // Her kategoriden sadece bir ürün al
        const uniqueProducts: Product[] = [];
        const categoryMap = new Map();

        prods
          .filter((p) => p.isActive)
          .forEach((product) => {
            if (!categoryMap.has(product.categoryId)) {
              categoryMap.set(product.categoryId, product);
              uniqueProducts.push(product);
            }
          });

        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Products yüklenirken hata:", err);
        setProducts([]);
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    }
    loadProducts();
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateItem);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Tüm ref'leri gözleml
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (misionRef.current) observer.observe(misionRef.current);
    if (visionRef.current) observer.observe(visionRef.current);
    if (contactRef.current) observer.observe(contactRef.current);
    if (productsRef.current) observer.observe(productsRef.current);

    Object.values(titleRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutData, misionData, visionData, products]);

  // Helper to render single section with only first image and first content
  const renderSingleSection = useCallback(
    (
      data: About | Mision | Vision | null,
      images: AboutImage[] | MisionImage[] | VisionImage[],
      ref: React.RefObject<HTMLDivElement | null>,
      type: string
    ) => {
      if (!data || !data.contents || data.contents.length === 0) {
        console.log(`No data or contents for ${type}:`, data);
        return null;
      }

      console.log(`Rendering ${type} section:`, { data, images });

      // Sadece ilk resmi al
      const firstImage = images.length > 0 ? images[0] : null;

      // Sadece ilk içeriği al
      const firstContent = data.contents[0];

      return (
        <div ref={ref} className={styles.previewItem}>
          {firstImage && (
            <div className={styles.previewImage}>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${firstImage.filePath}`}
                alt={firstImage.originalName || ""}
                width={500}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          )}
          <div className={styles.previewContent}>
            <p>
              {lang === "tr"
                ? firstContent.content_tr
                : firstContent.content_en}
            </p>
            <button
              className={styles.detailsButton}
              onClick={() => handleDetailsClick(type)}
            >
              {lang === "tr" ? "Detaylar" : "Details"}
            </button>
          </div>
        </div>
      );
    },
    [lang, handleDetailsClick]
  );

  // ProductCard component - Sadece ilk resmi göster
  const ProductCard = useCallback(
    ({ product }: { product: Product }) => {
      return (
        <div
          className={styles.productCard}
          onClick={() => router.push(`/${lang}/products`)}
        >
          <div className={styles.productImage}>
            {product.images && product.images.length > 0 ? (
              <div className={styles.productImageContainer}>
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.images[0].filePath}`}
                  alt={lang === "tr" ? product.name_tr : product.name_en}
                  width={300}
                  height={300}
                  style={{ width: "100%", height: "auto" }}
                  className={styles.productImageMain}
                />
              </div>
            ) : null}
          </div>
          <div className={styles.productContent}>
            <div className={styles.productName}>
              {lang === "tr" ? product.name_tr : product.name_en}
            </div>
            <div className={styles.productPrice}>
              {product.price.toFixed(2)}₺
            </div>
          </div>
        </div>
      );
    },
    [lang, router]
  );

  // Yükleniyor durumunu kontrol et
  if (loading.about || loading.mision || loading.vision || loading.products) {
    return (
      <>
        <HeroSection heroData={heroData || undefined} />
        <div className={styles.loading}>
          <p>{lang === "tr" ? "Yükleniyor..." : "Loading..."}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection heroData={heroData || undefined} />

      <div className={styles.previewContainer}>
        {/* About */}
        {aboutData ? (
          <>
            <section className={styles.previewSection}>
              <h2
                ref={titleRefs.about}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Hakkımızda" : "About Us"}
              </h2>
              {renderSingleSection(aboutData, aboutImages, aboutRef, "about")}
            </section>
          </>
        ) : (
          <div className={styles.error}>
            <p>
              {lang === "tr"
                ? "Hakkımızda verisi bulunamadı"
                : "About data not found"}
            </p>
          </div>
        )}

        {/* Mision */}
        {misionData ? (
          <>
            <section className={styles.previewSection}>
              <h2
                ref={titleRefs.mision}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Misyonumuz" : "Our Mission"}
              </h2>
              {renderSingleSection(
                misionData,
                misionImages,
                misionRef,
                "mision"
              )}
            </section>
          </>
        ) : (
          <div className={styles.error}>
            <p>
              {lang === "tr"
                ? "Misyon verisi bulunamadı"
                : "Mission data not found"}
            </p>
          </div>
        )}

        {/* Vision */}
        {visionData ? (
          <>
            <section className={styles.previewSection}>
              <h2
                ref={titleRefs.vision}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Vizyonumuz" : "Our Vision"}
              </h2>
              {renderSingleSection(
                visionData,
                visionImages,
                visionRef,
                "vision"
              )}
            </section>
          </>
        ) : (
          <div className={styles.error}>
            <p>
              {lang === "tr"
                ? "Vizyon verisi bulunamadı"
                : "Vision data not found"}
            </p>
          </div>
        )}

        {/* Contact */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <h2
              ref={titleRefs.contact}
              className={`${styles.sectionTitle} ${styles.animateTitle}`}
            >
              {lang === "tr" ? "İletişim" : "Contact"}
            </h2>
            <div ref={contactRef} className={styles.contactCard}>
              <div className={styles.contactContent}>
                <h3>{lang === "tr" ? "Bize Ulaşın" : "Get In Touch"}</h3>
                <p>
                  {lang === "tr"
                    ? "Sorularınız, görüşleriniz veya projeleriniz için bizimle iletişime geçmekten çekinmeyin. Size en kısa sürede dönüş yapacağız."
                    : "Don't hesitate to get in touch with us for your questions, opinions or projects. We will get back to you as soon as possible."}
                </p>
                <button
                  className={styles.contactButton}
                  onClick={handleContactClick}
                >
                  {lang === "tr" ? "Bize Ulaşın" : "Contact Us"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className={styles.productsPreviewSection}>
          <div className={styles.container}>
            <h2
              ref={titleRefs.products}
              className={`${styles.sectionTitle} ${styles.animateTitle}`}
            >
              {lang === "tr" ? "Ürünlerimiz" : "Our Products"}
            </h2>

            {/* BURAYI DEĞİŞTİR */}
            <div ref={productsRef} className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Tümünü Gör Butonu */}
            <div className={styles.viewAllContainer}>
              <button
                className={styles.viewAllButton}
                onClick={handleProductsClick}
              >
                {lang === "tr" ? "Tüm Ürünleri Gör" : "View All Products"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
