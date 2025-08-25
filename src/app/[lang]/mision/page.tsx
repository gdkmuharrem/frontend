"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/components/Mision.module.css";
import { MisionService } from "@/services/misionService";
import { Mision, MisionImage } from "@/types/mision";
import Image from "next/image";

const misionService = new MisionService();

export default function MisionPage() {
  const { lang } = useParams(); // tr veya en
  const bgRef = useRef<HTMLDivElement>(null);
  const [misionData, setMisionData] = useState<Mision | null>(null);
  const [images, setImages] = useState<MisionImage[]>([]);

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

  // Backend'den Mision ve resimleri çek
  useEffect(() => {
    async function loadMision() {
      try {
        const misions = await misionService.getAllMisions();
        if (misions.length === 0) return;

        const mision = misions[0];
        setMisionData(mision);

        // Resimleri çek
        const misionImages = await misionService.getImagesByMision(mision.id);
        setImages(misionImages);
      } catch (err) {
        console.error("Hakkımızda verileri alınamadı", err);
      }
    }
    loadMision();
  }, []);

  if (!misionData) return <p>Yükleniyor...</p>;

  const totalImages = images.length;
  const totalContents = misionData.contents.length;
  const contentsPerImage =
    totalImages > 0 ? Math.ceil(totalContents / totalImages) : totalContents;

  const sections = [];
  for (let i = 0; i < totalImages; i++) {
    const image = images[i] || null;
    const contentsForThisImage = misionData.contents.slice(
      i * contentsPerImage,
      (i + 1) * contentsPerImage
    );
    sections.push({ image, contents: contentsForThisImage });
  }

  if (totalImages === 0) {
    sections.push({ image: null, contents: misionData.contents });
  }

  return (
    <section className={styles.misionSection}>
      <div className={styles.background} ref={bgRef}>
        <div className={styles.animatedBg}></div>
        <div className={styles.bgImage}></div>
      </div>

      <div className={styles.misionContainer}>
        <header className={styles.misionHeader}>
          <h1 className={styles.misionTitle}>
            {lang === "tr" ? "Misyon" : "Mision"}
          </h1>
          <p className={styles.misionSubtitle}>
            {lang === "tr" ? misionData.title_tr : misionData.title_en}
          </p>
        </header>

        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`${styles.misionContent} ${
                !isEven ? styles.rowReverse : ""
              }`}
            >
              {section.image && (
                <div className={styles.misionImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${section.image.filePath}`}
                    alt={section.image.originalName}
                    width={300} // uygun genişlik
                    height={300} // uygun yükseklik
                    className={styles.misionImage}
                    style={{ width: '100%', height: 'auto', objectFit: "cover" }}
                  />
                </div>
              )}

              <div className={styles.misionText}>
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
