'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ThankYou.module.css';
import { useProductConfig } from '@/config/ProductConfigProvider';

export default function ThankYou() {
  const productConfig = useProductConfig();
  const upsell = productConfig.thankYou.upsell;
  const currentYear = new Date().getFullYear();
  const waNumber = productConfig.whatsappNumber || '213000000000';
  const supportWaUrl = `https://wa.me/${waNumber}`;
  const upsellWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(upsell.whatsappText)}`;

  return (
    <div className={styles.thankYouWrapper}>
      <div className={styles.container}>
        <div className={styles.glassCard}>
          {/* Decorative Glow */}
          <div className={`${styles.glowOrb} ${styles.primaryGlow}`}></div>
          <div className={`${styles.glowOrb} ${styles.secondaryGlow}`}></div>

          {/* Checkmark Icon */}
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>
              <svg className={styles.checkSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className={styles.title}>تم استلام طلبك بنجاح!</h1>
          <p className={styles.subtitle}>{productConfig.thankYou.message}</p>

          {/* Order Summary Mini */}
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>المنتج:</span>
              <span className={styles.summaryValue}>{productConfig.name}</span>
            </div>
            <div className={styles.summaryRowTotal}>
              <span className={styles.summaryLabel}>الإجمالي المستحق:</span>
              <span className={styles.summaryTotal}>{productConfig.price} {productConfig.currency}</span>
            </div>
          </div>

          {/* Upsell Section */}
          {upsell.enabled && <div className={styles.upsellBox}>
            <div className={styles.upsellBadge}>عرض حصري لفترة محدودة 🔥</div>
            <h3 className={styles.upsellTitle}>{upsell.title}</h3>
            <p className={styles.upsellDesc}>{upsell.description}</p>
            <div className={styles.upsellAction}>
              <div className={styles.upsellPrice}>
                <span className={styles.oldPrice}>{upsell.oldPrice} {productConfig.currency}</span>
                <span className={styles.newPrice}>{upsell.price} {productConfig.currency}</span>
              </div>
              <a href={upsellWaUrl} target="_blank" rel="noopener noreferrer" className={styles.upsellBtn}>
                إضافة العرض لطلبي 👈
              </a>
            </div>
          </div>}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <a href={supportWaUrl} target="_blank" rel="noopener noreferrer" className={styles.supportBtn}>
              <svg className={styles.waIcon} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              تواصل مع الدعم
            </a>
            <Link href="/" className={styles.homeBtn}>
              العودة للرئيسية
            </Link>
          </div>
          
          <p className={styles.copyright}>
            &copy; {currentYear} جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
