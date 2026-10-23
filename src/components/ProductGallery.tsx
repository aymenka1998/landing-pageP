'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';
import { useProductConfig } from '@/config/ProductConfigProvider';

export default function ProductGallery() {
  const productConfig = useProductConfig();
  const images = productConfig.images || [];

  return (
    <section className={styles.gallerySection}>
      <div className="container">
        <h2 className="section-title">معرض الصور من جميع الزوايا</h2>
        <p className="section-subtitle">شاهد أدق التفاصيل والجودة العالية للساعة الذكية برو</p>

        <div className={styles.grid}>
          {images.map((img, index) => (
            <div
              key={index}
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <span className={styles.angleTag}>{img.title}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{img.title}</h3>
                <p className={styles.cardDesc}>{img.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
