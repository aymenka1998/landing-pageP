'use client';

import React, { useEffect } from 'react';
import styles from './Features.module.css';
import productConfig from '@/config/product';

export default function Features() {
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

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={`${styles.header} ${styles.reveal}`}>
          <h2 className={styles.title}>لماذا تختارنا؟</h2>
          <p className={styles.subtitle}>مميزات تجعلنا الخيار الأول لك</p>
        </div>
        
        <div className={styles.grid}>
          {productConfig.features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${styles.reveal}`} 
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{feature.icon}</span>
                <div className={styles.iconGlow}></div>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
