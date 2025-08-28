// components/HeroSection.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimate,
  AnimationPlaybackControls,
} from "framer-motion";
import HeroModel from "./HeroModel";
import { HeroService } from "@/services/heroService";
import { Hero } from "@/types/hero";
import styles from "@/components/HeroSection.module.css";

interface HeroSectionProps {
  heroData?: Hero;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
  const [hero, setHero] = useState<Hero | null>(heroData || null);
  const [scale, setScale] = useState(0.15);
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(false);
  const [heroHeight, setHeroHeight] = useState("100vh");
  const [imageScale, setImageScale] = useState(1);

  const [scope, animate] = useAnimate();
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const motionX = useMotionValue(0.5);
  const motionY = useMotionValue(0.5);
  const translateX = useTransform(motionX, [0, 1], ["-5%", "5%"]);
  const translateY = useTransform(motionY, [0, 1], ["-5%", "5%"]);

  const loadHeroData = useCallback(async () => {
    const heroService = new HeroService();
    try {
      const activeHero = await heroService.getActiveHero();
      setHero(activeHero);
    } catch (error) {
      console.error("Hero verileri yüklenirken hata:", error);
    }
  }, []);

  useEffect(() => {
    if (!heroData) {
      loadHeroData();
    }

    const handleResize = () => {
      const width = window.innerWidth;

      setIsMobile(width < 768);
      setIsLargeScreen(width >= 1200 && width < 1920);
      setIsExtraLargeScreen(width >= 1920);

      if (width < 640) {
        setScale(0.18);
        setHeroHeight("100vh");
        setImageScale(1);
      } else if (width < 1024) {
        setScale(0.22);
        setHeroHeight("100vh");
        setImageScale(1);
      } else if (width < 1440) {
        setScale(0.2);
        setHeroHeight("100vh");
        setImageScale(1);
      } else if (width < 1920) {
        setScale(0.18);
        setHeroHeight("100vh");
        setImageScale(0.9);
      } else {
        setScale(0.16);
        setHeroHeight("100vh");
        setImageScale(0.8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [heroData, loadHeroData]);

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    stopAnimation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    motionX.set(x);
    motionY.set(y);
  };

  const handleHeroMouseLeave = () => {
    stopAnimation();

    animationRef.current = animate(motionX, 0.5, {
      duration: 1.5,
      ease: "easeOut",
    });

    animate(motionY, 0.5, {
      duration: 1.5,
      ease: "easeOut",
    });
  };

  if (!hero) {
    return (
      <div className={styles.heroContainer} style={{ height: heroHeight }}>
        <div className={styles.loadingText}>Yükleniyor...</div>
      </div>
    );
  }

  const backgroundImage = hero.images?.[0]?.filePath || "hero.png";
  const modelPath = hero.models?.[0]?.filePath || "model.obj";

  return (
    <section className={styles.heroSection} id="home">
      {/* Floating Shapes */}
      <div className={styles.floatingShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
        <div className={`${styles.shape} ${styles.shape4}`}></div>
        <div className={`${styles.shape} ${styles.shape5}`}></div>
        <div className={`${styles.shape} ${styles.shape6}`}></div>
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroSubtitle}>Mum Markası</div>
        <h1 className={styles.heroTitle}>Geçmişten Gelen Işık</h1>
        <p className={styles.heroDescription}>
          Geleneksel el yapımı mumlarımızla mekanlarınıza sıcaklık ve huzur
          getirin. Özenle seçilmiş malzemelerle üretilen mumlarımız, özel
          anlarınıza eşsiz bir atmosfer katıyor.
        </p>
        <a href="#products" className={styles.ctaButton}>
          Ürünleri Keşfet
        </a>
      </div>

      {/* Background Image */}
      <div
        ref={scope}
        className={styles.heroBackground}
        style={{ height: heroHeight }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        onMouseEnter={stopAnimation}
      >
        <motion.div
          className={styles.backgroundImage}
          style={{
            translateX,
            translateY,
            scale: imageScale,
          }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${backgroundImage}`}
            alt="Hero background"
            fill
            className={styles.backgroundImage}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </motion.div>

        {/* Animated Shadow Layer */}
        <motion.div
          className={styles.shadowLayer}
          animate={{
            backgroundPosition: ["30% 30%, 70% 70%", "40% 40%, 60% 60%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* 3D Model */}
        {modelPath && (
          <HeroModel
            modelPath={modelPath}
            scale={scale}
            isMobile={isMobile}
            isLargeScreen={isLargeScreen}
            isExtraLargeScreen={isExtraLargeScreen}
          />
        )}
      </div>

      {/* Scroll Indicator */}
      <div
        className={styles.scrollIndicator}
        onClick={() =>
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      ></div>
    </section>
  );
}
