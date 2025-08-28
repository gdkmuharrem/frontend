"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import { HeroService } from "@/services/heroService";
import { AboutService } from "@/services/aboutService";
import { MisionService } from "@/services/misionService";
import { VisionService } from "@/services/visionService";
import { Hero } from "@/types/hero";
import { About, AboutImage } from "@/types/about";
import { Mision, MisionImage } from "@/types/mision";
import { Vision, VisionImage } from "@/types/vision";
import Image from "next/image";
import styles from "@/components/Home.module.css";

const heroService = new HeroService();
const aboutService = new AboutService();
const misionService = new MisionService();
const visionService = new VisionService();

export default function Home() {
  const { lang } = useParams(); // "tr" veya "en"
  const router = useRouter();

  const [heroData, setHeroData] = useState<Hero | null>(null);
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [misionData, setMisionData] = useState<Mision | null>(null);
  const [visionData, setVisionData] = useState<Vision | null>(null);
  const [aboutImage, setAboutImage] = useState<AboutImage | null>(null);
  const [misionImage, setMisionImage] = useState<MisionImage | null>(null);
  const [visionImage, setVisionImage] = useState<VisionImage | null>(null);

  const aboutRef = useRef<HTMLDivElement>(null);
  const misionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const misionTitleRef = useRef<HTMLHeadingElement>(null);
  const visionTitleRef = useRef<HTMLHeadingElement>(null);
  const contactTitleRef = useRef<HTMLHeadingElement>(null);

  // Sayfalara yönlendirme fonksiyonları
  const handleDetailsClickAbout = () => router.push(`/${lang}/about`);
  const handleDetailsClickMision = () => router.push(`/${lang}/mision`);
  const handleDetailsClickVision = () => router.push(`/${lang}/vision`);
  const handleContactClick = () => router.push(`/${lang}/contact`);

  // Hero verisini yükle
  useEffect(() => {
    async function loadHero() {
      try {
        const hero = await heroService.getActiveHero();
        if (hero) setHeroData(hero);
      } catch (err) {
        console.error("Hero verileri yüklenirken hata:", err);
      }
    }
    loadHero();
  }, []);

  // About, Mision, Vision verilerini yükle
  useEffect(() => {
    async function loadAbout() {
      try {
        const abouts = await aboutService.getAllAbouts();
        if (!abouts || abouts.length === 0) return;

        const about = abouts[0];
        setAboutData(about);

        let firstImage: AboutImage | null = null;
        if (about.images && about.images.length > 0) {
          firstImage = about.images[0];
        } else {
          const images = await aboutService.getImagesByAbout(about.id);
          firstImage = images && images.length > 0 ? images[0] : null;
        }
        setAboutImage(firstImage);
      } catch (err) {
        console.error("About verileri yüklenirken hata:", err);
      }
    }

    async function loadMision() {
      try {
        const misions = await misionService.getAllMisions();
        if (!misions || misions.length === 0) return;

        const mision = misions[0];
        setMisionData(mision);

        let firstImage: MisionImage | null = null;
        if (mision.images && mision.images.length > 0) {
          firstImage = mision.images[0];
        } else {
          const images = await misionService.getImagesByMision(mision.id);
          firstImage = images && images.length > 0 ? images[0] : null;
        }
        setMisionImage(firstImage);
      } catch (err) {
        console.error("Mision verileri yüklenirken hata:", err);
      }
    }

    async function loadVision() {
      try {
        const visions = await visionService.getAllVisions();
        if (!visions || visions.length === 0) return;

        const vision = visions[0];
        setVisionData(vision);

        let firstImage: VisionImage | null = null;
        if (vision.images && vision.images.length > 0) {
          firstImage = vision.images[0];
        } else {
          const images = await visionService.getImagesByVision(vision.id);
          firstImage = images && images.length > 0 ? images[0] : null;
        }
        setVisionImage(firstImage);
      } catch (err) {
        console.error("Vision verileri yüklenirken hata:", err);
      }
    }

    loadAbout();
    loadMision();
    loadVision();
  }, []);

  // useObserver hook'u - başlıklar için de kullanılacak
  const useObserver = (
    ref: React.RefObject<HTMLElement | null>
  ) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const observerOptions = { threshold: 0.1 };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(styles.animateItem);
            }, 150);
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
      );
      observer.observe(el);

      return () => {
        observer.unobserve(el);
      };
    }, [ref]); // ref’i de ekledik
  };

  // Observerleri uygula
  useObserver(aboutRef);
  useObserver(misionRef);
  useObserver(visionRef);
  useObserver(contactRef);
  useObserver(aboutTitleRef);
  useObserver(misionTitleRef);
  useObserver(visionTitleRef);
  useObserver(contactTitleRef);

  return (
    <>
      <HeroSection heroData={heroData || undefined} />

      {/* About, Mision ve Vision için ortak container */}
      <div className={styles.previewContainer}>
        {/* About Preview */}
        {aboutData && aboutImage && (
          <section className={styles.previewSection}>
            <div className={styles.container}>
              <h2
                ref={aboutTitleRef}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Hakkımızda" : "About Us"}
              </h2>
              <div ref={aboutRef} className={styles.previewItem}>
                <div className={styles.previewImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${aboutImage.filePath}`}
                    alt={aboutImage.originalName || "about image"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.previewContent}>
                  {aboutData.contents && aboutData.contents.length > 0 && (
                    <>
                      <p>
                        {lang === "tr"
                          ? aboutData.contents[0]?.content_tr
                          : aboutData.contents[0]?.content_en}
                      </p>
                      <button
                        className={styles.detailsButton}
                        onClick={handleDetailsClickAbout}
                      >
                        {lang === "tr" ? "Detaylar" : "Details"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mision Preview */}
        {misionData && misionImage && (
          <section className={styles.previewSection}>
            <div className={styles.container}>
              <h2
                ref={misionTitleRef}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Misyonumuz" : "Our Mission"}
              </h2>
              <div ref={misionRef} className={styles.previewItem}>
                <div className={styles.previewImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${misionImage.filePath}`}
                    alt={misionImage.originalName || "mision image"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.previewContent}>
                  {misionData.contents && misionData.contents.length > 0 && (
                    <>
                      <p>
                        {lang === "tr"
                          ? misionData.contents[0]?.content_tr
                          : misionData.contents[0]?.content_en}
                      </p>
                      <button
                        className={styles.detailsButton}
                        onClick={handleDetailsClickMision}
                      >
                        {lang === "tr" ? "Detaylar" : "Details"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Vision Preview */}
        {visionData && visionImage && (
          <section className={styles.previewSection}>
            <div className={styles.container}>
              <h2
                ref={visionTitleRef}
                className={`${styles.sectionTitle} ${styles.animateTitle}`}
              >
                {lang === "tr" ? "Vizyonumuz" : "Our Vision"}
              </h2>
              <div ref={visionRef} className={styles.previewItem}>
                <div className={styles.previewImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${visionImage.filePath}`}
                    alt={visionImage.originalName || "vision image"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.previewContent}>
                  {visionData.contents && visionData.contents.length > 0 && (
                    <>
                      <p>
                        {lang === "tr"
                          ? visionData.contents[0]?.content_tr
                          : visionData.contents[0]?.content_en}
                      </p>
                      <button
                        className={styles.detailsButton}
                        onClick={handleDetailsClickVision}
                      >
                        {lang === "tr" ? "Detaylar" : "Details"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Card - Yeni eklenen bölüm */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <h2
              ref={contactTitleRef}
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
      </div>

      <div className="mt-10 w-[90%] mx-auto">
        <p className="text-gray-700">
          Buraya diğer sayfa içeriklerini ekleyebilirsin.
        </p>
      </div>
    </>
  );
}
