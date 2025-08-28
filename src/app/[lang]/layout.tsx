// app/[lang]/layout.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/app/[lang]/Navbar";
import Footer from "@/app/[lang]/Footer";
import '../globals.css';
import styles from '@/components/Layout.module.css';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export default function LangLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Her sayfa değişiminde en üste kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}