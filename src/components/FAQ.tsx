'use client';
import { useState } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './FAQ.module.css';

export default function FAQ() {
  const productConfig = useProductConfig();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    if (activeIndex === i) setActiveIndex(null);
    else setActiveIndex(i);
  };

  return (
    <section className={`section ${styles.faqSection}`}>
      <div className="container">
        <h2 className="section-title">الأسئلة الشائعة</h2>
        <p className="section-subtitle">إجابات على أكثر الأسئلة شيوعاً</p>
        <div className={styles.faqList}>
          {productConfig.faq.map((item, i) => (
            <div key={i} className={`${styles.faqItem} ${activeIndex === i ? styles.active : ''}`}>
              <button type="button" className={styles.question} aria-expanded={activeIndex === i} aria-controls={`faq-answer-${i}`} onClick={() => toggle(i)}>
                <h3>{item.question}</h3>
                <span className={styles.icon} aria-hidden="true">{activeIndex === i ? '−' : '+'}</span>
              </button>
              <div id={`faq-answer-${i}`} className={styles.answerWrap} hidden={activeIndex !== i}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
