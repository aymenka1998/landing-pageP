'use client';
import { useState, useEffect, useRef } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './FAQ.module.css';

export default function FAQ() {
  const productConfig = useProductConfig();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

  const toggle = (i: number) => {
    if (activeIndex === i) setActiveIndex(null);
    else setActiveIndex(i);
  };

  return (
    <section className={`section ${styles.faqSection}`} ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">الأسئلة الشائعة</h2>
        <p className="section-subtitle reveal">إجابات على أكثر الأسئلة شيوعاً</p>
        <div className={styles.faqList}>
          {productConfig.faq.map((item, i) => (
            <div key={i} className={`${styles.faqItem} reveal ${activeIndex === i ? styles.active : ''}`} onClick={() => toggle(i)}>
              <div className={styles.question}>
                <h3>{item.question}</h3>
                <span className={styles.icon}>{activeIndex === i ? '−' : '+'}</span>
              </div>
              <div className={styles.answerWrap} style={{ maxHeight: activeIndex === i ? '200px' : '0' }}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
