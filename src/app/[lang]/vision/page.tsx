"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/components/Vision.module.css";
import { VisionService } from "@/services/visionService";
import { Vision, VisionImage } from "@/types/vision";
import Image from "next/image";

const visionService = new VisionService();

export default function VisionPage() {
  const { lang } = useParams(); // tr veya en
  const bgRef = useRef<HTMLDivElement>(null);
  const [visionData, setVisionData] = useState<Vision | null>(null);
  const [images, setImages] = useState<VisionImage[]>([]);

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

  // Backend'den Vision ve resimleri çek
  useEffect(() => {
    async function loadVision() {
      try {
        const visions = await visionService.getAllVisions();
        if (visions.length === 0) return;

        const vision = visions[0];
        setVisionData(vision);

        // Resimleri çek
        const visionImages = await visionService.getImagesByVision(vision.id);
        setImages(visionImages);
      } catch (err) {
        console.error("Vizyon verileri alınamadı", err);
      }
    }
    loadVision();
  }, []);

  if (!visionData) return <p>Yükleniyor...</p>;

  const totalImages = images.length;
  const totalContents = visionData.contents.length;
  const contentsPerImage =
    totalImages > 0 ? Math.ceil(totalContents / totalImages) : totalContents;

  const sections = [];
  for (let i = 0; i < totalImages; i++) {
    const image = images[i] || null;
    const contentsForThisImage = visionData.contents.slice(
      i * contentsPerImage,
      (i + 1) * contentsPerImage
    );
    sections.push({ image, contents: contentsForThisImage });
  }

  if (totalImages === 0) {
    sections.push({ image: null, contents: visionData.contents });
  }

  return (
    <section className={styles.visionSection}>
      <div className={styles.background} ref={bgRef}>
        <div className={styles.animatedBg}></div>
        <div className={styles.bgImage}></div>
      </div>

      <div className={styles.visionContainer}>
        <header className={styles.visionHeader}>
          <h1 className={styles.visionTitle}>
            {lang === "tr" ? "Vizyon" : "Vision"}
          </h1>
          <p className={styles.visionSubtitle}>
            {lang === "tr" ? visionData.title_tr : visionData.title_en}
          </p>
        </header>

        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`${styles.visionContent} ${
                !isEven ? styles.rowReverse : ""
              }`}
            >
              {section.image && (
                <div className={styles.visionImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${section.image.filePath}`}
                    alt={section.image.originalName}
                    width={400} // uygun genişlik
                    height={300} // uygun yükseklik
                    className={styles.visionImage}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <div className={styles.visionText}>
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
