'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import styles from '@/components/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // /tr/about gibi
  const currentLang = pathname.split('/')[1] || 'tr';

  const switchLang = currentLang === 'tr' ? 'en' : 'tr';
  const switchHref = pathname.replace(`/${currentLang}`, `/${switchLang}`);

  // Menü isimleri
  const menuLabels: Record<string, Record<string, string>> = {
    tr: { about: 'Hakkımızda', mision: 'Misyon', vision: 'Vizyon' , products: 'Ürünlerimiz', contact: 'İletişim'},
    en: { about: 'About', mision: 'Mission', vision: 'Vision' , products: 'Products', contact: 'Contact'}
  };

  return (
    <nav className={styles.navbar}>
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
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles.mobileButton}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.menuMobile}>
          <Link href={`/${currentLang}/about`} className={styles.linkMobile}>
            {menuLabels[currentLang].about}
          </Link>
          <Link href={`/${currentLang}/mision`} className={styles.linkMobile}>
            {menuLabels[currentLang].mision}
          </Link>
          <Link href={`/${currentLang}/vision`} className={styles.linkMobile}>
            {menuLabels[currentLang].vision}
          </Link>
          <Link href={`/${currentLang}/products`} className={styles.linkMobile}>
            {menuLabels[currentLang].products}
          </Link>
          <Link href={`/${currentLang}/contact`} className={styles.linkMobile}>
            {menuLabels[currentLang].contact}
          </Link>

          <button
            className={styles.langButtonMobile}
            onClick={() => (window.location.href = switchHref)}
            title="Switch Language"
          >
            <FiGlobe size={20} />
          </button>
        </div>
      )}
    </nav>
  );
}
