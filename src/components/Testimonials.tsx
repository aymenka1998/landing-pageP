'use client';
import { useEffect, useRef } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const productConfig = useProductConfig();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.testimonials}`} ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">آراء عملائنا</h2>
        <div className={styles.grid}>
          {productConfig.testimonials?.map((t, i) => (
            <div key={i} className={`${styles.card} reveal`} style={{transitionDelay: `${i * 0.15}s`}}>
              <div className={styles.quoteIcon}>❝</div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.stars}>
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <div className={styles.author}>
                <h4>{t.name}</h4>
                <span>{t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
