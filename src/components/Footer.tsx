'use client';
import productConfig from '@/config/product';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { footer } = productConfig;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h2>{footer.brand}</h2>
            <p>{footer.description}</p>
          </div>
          <div className={styles.contact}>
            <h3>تواصل معنا</h3>
            {footer.email && <p>📧 البريد: <a href={`mailto:${footer.email}`}>{footer.email}</a></p>}
            <p>📱 واتساب: <span dir="ltr">{productConfig.whatsappNumber}</span></p>
            <div className={styles.socials}>
              {footer.socialLinks.instagram && footer.socialLinks.instagram !== '#' && (
                <a href={footer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
              )}
              {footer.socialLinks.twitter && footer.socialLinks.twitter !== '#' && (
                <a href={footer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
              )}
              {footer.socialLinks.tiktok && footer.socialLinks.tiktok !== '#' && (
                <a href={footer.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">🎵</a>
              )}
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>© {currentYear} {footer.brand}. جميع الحقوق محفوظة. صنع بـ ❤️</p>
        </div>
      </div>
    </footer>
  );
}
