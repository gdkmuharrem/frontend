'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiGlobe, FiHome } from 'react-icons/fi';
import styles from '@/components/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1] || 'tr';

  const switchLang = currentLang === 'tr' ? 'en' : 'tr';
  const switchHref = pathname.replace(`/${currentLang}`, `/${switchLang}`);

  // Menü isimleri
  const menuLabels: Record<string, Record<string, string>> = {
    tr: { 
      home: 'Ana Sayfa',
      about: 'Hakkımızda', 
      mision: 'Misyon', 
      vision: 'Vizyon', 
      products: 'Ürünlerimiz', 
      contact: 'İletişim' 
    },
    en: { 
      home: 'Home',
      about: 'About', 
      mision: 'Mission', 
      vision: 'Vision', 
      products: 'Products', 
      contact: 'Contact' 
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href={`/${currentLang}`}>Mum Markası</Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.menuDesktop}>
          <Link href={`/${currentLang}/about`} className={styles.link}>
            {menuLabels[currentLang].about}
          </Link>
          <Link href={`/${currentLang}/mision`} className={styles.link}>
            {menuLabels[currentLang].mision}
          </Link>
          <Link href={`/${currentLang}/vision`} className={styles.link}>
            {menuLabels[currentLang].vision}
          </Link>
          <Link href={`/${currentLang}/products`} className={styles.link}>
            {menuLabels[currentLang].products}
          </Link>
          <Link href={`/${currentLang}/contact`} className={styles.link}>
            {menuLabels[currentLang].contact}
          </Link>

          {/* Dil değiştirici */}
          <button
            className={styles.langButton}
            onClick={() => (window.location.href = switchHref)}
            title="Switch Language"
          >
            <FiGlobe size={20} />
            <span className={styles.langText}>{switchLang.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles.mobileButton}>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.menuMobile} ${isOpen ? styles.active : ''}`}>
        {/* Ana Sayfa butonu - sadece mobilde görünecek */}
        <Link href={`/${currentLang}`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          <FiHome size={20} style={{ marginRight: '10px' }} />
          {menuLabels[currentLang].home}
        </Link>
        
        <Link href={`/${currentLang}/about`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          {menuLabels[currentLang].about}
        </Link>
        <Link href={`/${currentLang}/mision`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          {menuLabels[currentLang].mision}
        </Link>
        <Link href={`/${currentLang}/vision`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          {menuLabels[currentLang].vision}
        </Link>
        <Link href={`/${currentLang}/products`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          {menuLabels[currentLang].products}
        </Link>
        <Link href={`/${currentLang}/contact`} className={styles.linkMobile} onClick={() => setIsOpen(false)}>
          {menuLabels[currentLang].contact}
        </Link>

        <button
          className={styles.langButtonMobile}
          onClick={() => {
            setIsOpen(false);
            window.location.href = switchHref;
          }}
          title="Switch Language"
        >
          <FiGlobe size={20} />
          <span>{currentLang === 'tr' ? 'EN' : 'TR'}</span>
        </button>
      </div>
    </nav>
  );
}