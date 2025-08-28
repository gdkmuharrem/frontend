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
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [images, setImages] = useState<AboutImage[]>([]);

  // Mouse hareketi efekti
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll animasyonları için Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    const currentRefs = contentRefs.current; // Kopyaladık
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [aboutData, images]);

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
      {/* Floating Shapes Background */}
      <div className={styles.floatingShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
        <div className={styles.shape4}></div>
        <div className={styles.shape5}></div>
        <div className={styles.shape6}></div>
      </div>

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
              ref={(el) => {
                if (el) contentRefs.current[index] = el;
              }}
              className={`${styles.aboutContent} ${
                !isEven ? styles.rowReverse : ""
              }`}
            >
              {section.image && (
                <div className={styles.aboutImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${section.image.filePath}`}
                    alt={section.image.originalName}
                    width={500}
                    height={400}
                    className={styles.aboutImage}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div className={styles.aboutText}>
                {section.contents.map((c, i) => (
                  <p key={i}>{lang === "tr" ? c.content_tr : c.content_en}</p>
                ))}

                {/* Skills section for the first content block */}
                {index === 0 && (
                  <div className={styles.skills}>
                    <span className={styles.skillTag}>UI/UX Design</span>
                    <span className={styles.skillTag}>Web Development</span>
                    <span className={styles.skillTag}>Brand Identity</span>
                    <span className={styles.skillTag}>Motion Graphics</span>
                    <span className={styles.skillTag}>Prototyping</span>
                    <span className={styles.skillTag}>Design Systems</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
