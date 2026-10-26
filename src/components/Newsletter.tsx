'use client';

import { FormEvent, useState } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const product = useProductConfig();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) { setState('error'); return; }
    setState('sending');
    try {
      const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/newsletter_subscribers?on_conflict=email`, {
        method: 'POST',
        headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), consent: true }),
      });
      if (!response.ok) throw new Error('Subscription failed');
      setState('success');
      setEmail('');
    } catch { setState('error'); }
  }

  return (
    <section className={`section ${styles.newsletter}`} id="newsletter">
      <div className="container">
        <div className={styles.panel}>
          <span className={styles.eyebrow}>ابقَ على اطلاع</span>
          <h2 className="section-title">اشترك ليصلك كل جديد وعروضنا</h2>
      <p className={styles.description}>أدخل بريدك الإلكتروني لتصلك أخبار {product.name} والعروض الجديدة.</p>
          <form className={styles.form} onSubmit={subscribe}>
            <label className={styles.label} htmlFor="newsletter-email">البريد الإلكتروني</label>
            <div className={styles.controls}>
              <input id="newsletter-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" dir="ltr" />
              <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'جارٍ الاشتراك…' : 'اشترك الآن'}</button>
            </div>
            <label className={styles.consent}><input type="checkbox" required /> أوافق على استلام أخبار وعروض عبر البريد الإلكتروني، ويمكنني إلغاء الاشتراك لاحقًا.</label>
          </form>
          <p className={state === 'error' ? styles.error : styles.message} role="status" aria-live="polite">
            {state === 'success' ? 'تم تسجيل اشتراكك بنجاح، شكرًا لك.' : state === 'error' ? 'تعذر إتمام الاشتراك. حاول مرة أخرى لاحقًا.' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}