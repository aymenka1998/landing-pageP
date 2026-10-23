'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import { useProductConfig } from '@/config/ProductConfigProvider';

export default function Hero() {
  const productConfig = useProductConfig();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.active);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll(`.${styles.reveal}`).forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const scrollToOrder = () => {
    const form = document.getElementById('order-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const discount = Math.round((1 - productConfig.price / productConfig.oldPrice) * 100);
  const images = productConfig.images || [
    { src: '/images/product-hero.jpg', title: 'الساعة الذكية', desc: 'تصميم أنيق وبطارية تدوم طويلاً' }
  ];
  const currentImage = images[selectedImageIndex] || images[0];

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
      </div>
      
      <div className={styles.container}>
        <div className={`${styles.textContent} ${styles.reveal}`}>
          <div className={styles.badge}>{productConfig.badge} - خصم {discount}%</div>
          <h1 className={styles.title}>{productConfig.name}</h1>
          <p className={styles.tagline}>{productConfig.tagline}</p>
          
          <div className={styles.priceContainer}>
            <span className={styles.oldPrice}>{productConfig.oldPrice} {productConfig.currency}</span>
            <span className={styles.newPrice}>{productConfig.price} {productConfig.currency}</span>
            <span className={styles.discountBadge}>خصم {discount}%</span>
          </div>
          
          <div className={styles.ctaGroup}>
            <button onClick={scrollToOrder} className={styles.ctaButton}>
              اطلب الآن (حتى {productConfig.maxQty} قطعة)
            </button>
            <div className={styles.guaranteeTag}>
              {productConfig.guaranteeText}
            </div>
          </div>
        </div>

        <div className={`${styles.imageContent} ${styles.reveal}`}>
          <div className={styles.galleryContainer}>
            <div className={styles.mainImageWrapper}>
              <span className={styles.angleTag}>{currentImage.title}</span>
              <Image
                key={currentImage.src} 
                src={currentImage.src} 
                alt={currentImage.title} 
                fill
                sizes="(max-width: 900px) 100vw, 480px"
                preload
                className={styles.productImage} 
              />
              <div className={styles.imageGlow}></div>
              
              <button 
                onClick={handlePrevImage} 
                className={`${styles.navBtn} ${styles.prevBtn}`}
                aria-label="الصورة السابقة"
              >
                ‹
              </button>
              <button 
                onClick={handleNextImage} 
                className={`${styles.navBtn} ${styles.nextBtn}`}
                aria-label="الصورة التالية"
              >
                ›
              </button>
            </div>

            <p className={styles.imageCaption}>{currentImage.desc}</p>
            <p className={styles.imageCaption}>{productConfig.type}</p>
            {productConfig.email && <p className={styles.imageCaption}>للتواصل: {productConfig.email}</p>}

            {/* المصغرات - Thumbnails */}
            <div className={styles.thumbnailsList}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`${styles.thumbBtn} ${selectedImageIndex === idx ? styles.activeThumb : ''}`}
                >
                  <Image src={img.src} alt={img.title} fill sizes="70px" className={styles.thumbImage} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
