'use client';
import { useState, useEffect } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './FloatingWhatsApp.module.css';

export default function FloatingWhatsApp() {
  const productConfig = useProductConfig();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${productConfig.whatsappNumber}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن ' + productConfig.name)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className={`${styles.floatingBtn} ${visible ? styles.visible : ''}`} 
      onClick={handleClick}
      title="تواصل معنا"
    >
      <div className={styles.tooltip}>تواصل معنا</div>
      <svg viewBox="0 0 32 32" className={styles.icon}>
        <path d="M16 2.5a13.5 13.5 0 0 0-11.4 20.7l-1.8 5.4 5.6-1.8A13.5 13.5 0 1 0 16 2.5zm7.8 19.3c-.3.9-1.8 1.7-2.6 1.8-.7.1-1.6.3-4.6-1-3.6-1.5-6-5.3-6.1-5.5-.2-.2-1.5-1.9-1.5-3.7s.9-2.6 1.3-3c.3-.3.7-.4 1-.4.2 0 .5 0 .7.1.3 0 .6-.1.9.7.3.8 1 2.5 1 2.7.1.2.2.4.1.6-.1.3-.2.4-.4.6l-.5.6c-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.5 1.4 1.3 2.6 1.7 2.9 1.8.3.2.5.1.7-.1.2-.2.8-1 1-1.3.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.2.3.2 1-.1 1.9z"/>
      </svg>
    </div>
  );
}
