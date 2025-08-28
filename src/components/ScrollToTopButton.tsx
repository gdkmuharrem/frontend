// components/ScrollToTopButton.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Sayfa kaydırma pozisyonunu izle
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Sayfanın en üstüne yumuşak kaydırma
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label="Sayfanın başına dön"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;