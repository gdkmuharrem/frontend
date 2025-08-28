import styles from '@/components/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <p>&copy; 2025 Mum Markası. Tüm hakları saklıdır.</p>
          </div>
          <div className={styles.footerRight}>
            <a href="#privacy">Gizlilik Politikası</a>
            <a href="#terms">Kullanım Şartları</a>
            <a href="#sitemap">Site Haritası</a>
          </div>
        </div>
      </div>
    </footer>
  );
}