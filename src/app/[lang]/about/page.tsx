"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/components/About.module.css";
import { AboutService } from "@/services/aboutService";
import { About, AboutImage } from "@/types/about";
import Image from "next/image";

const aboutService = new AboutService();

export default function AboutPage() {
  const { lang } = useParams(); // tr veya en
  const bgRef = useRef<HTMLDivElement>(null);
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [images, setImages] = useState<AboutImage[]>([]);

  // Mouse hareketi efekti
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Backend'den About ve resimleri çek
  useEffect(() => {
    async function loadAbout() {
      try {
        const abouts = await aboutService.getAllAbouts();
        if (abouts.length === 0) return;

        const about = abouts[0];
        setAboutData(about);

        // Resimleri çek
        const aboutImages = await aboutService.getImagesByAbout(about.id);
        setImages(aboutImages);
      } catch (err) {
        console.error("Hakkımızda verileri alınamadı", err);
      }
    }
    loadAbout();
  }, []);

  if (!aboutData) return <p>Yükleniyor...</p>;

  const totalImages = images.length;
  const totalContents = aboutData.contents.length;
  const contentsPerImage =
    totalImages > 0 ? Math.ceil(totalContents / totalImages) : totalContents;

  const sections = [];
  for (let i = 0; i < totalImages; i++) {
    const image = images[i] || null;
    const contentsForThisImage = aboutData.contents.slice(
      i * contentsPerImage,
      (i + 1) * contentsPerImage
    );
    sections.push({ image, contents: contentsForThisImage });
  }

  if (totalImages === 0) {
    sections.push({ image: null, contents: aboutData.contents });
  }

  return (
    <section className={styles.aboutSection}>
      <div className={styles.background} ref={bgRef}>
        <div className={styles.animatedBg}></div>
        <div className={styles.bgImage}></div>
      </div>

      <div className={styles.aboutContainer}>
        <header className={styles.aboutHeader}>
          <h1 className={styles.aboutTitle}>
            {lang === "tr" ? "Hakkımızda" : "About Us"}
          </h1>
          <p className={styles.aboutSubtitle}>
            {lang === "tr" ? aboutData.title_tr : aboutData.title_en}
          </p>
        </header>

        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`${styles.aboutContent} ${
                !isEven ? styles.rowReverse : ""
              }`}
            >
              {section.image && (
                <div className={styles.aboutImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${section.image.filePath}`}
                    alt={section.image.originalName}
                    width={300} // uygun genişlik
                    height={300} // uygun yükseklik
                    className={styles.aboutImage}
                    style={{ width: '100%', height: 'auto', objectFit: "cover" }}
                  />
                </div>
              )}

              <div className={styles.aboutText}>
                {section.contents.map((c, i) => (
                  <p key={i}>{lang === "tr" ? c.content_tr : c.content_en}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
