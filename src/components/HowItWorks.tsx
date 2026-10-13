'use client';
import { useEffect, useRef } from 'react';
import productConfig from '@/config/product';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
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
    <section className={`section ${styles.howItWorks}`} ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">كيف تطلب؟</h2>
        <p className="section-subtitle reveal">ثلاث خطوات بسيطة فقط</p>
        <div className={styles.stepsContainer}>
          {productConfig.steps.map((step, i) => (
            <div key={i} className={`${styles.step} reveal`} style={{transitionDelay: `${i * 0.2}s`}}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {i < productConfig.steps.length - 1 && <div className={styles.connector}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
