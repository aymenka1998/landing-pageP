'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useProductConfig } from '@/config/ProductConfigProvider';
import styles from './OrderForm.module.css';
import { trackLead } from './TrackingPixels';

type OrderFormData = {
  name: string;
  phone: string;
  city: string;
  qty: number;
  notes: string;
};

export default function OrderForm() {
  const productConfig = useProductConfig();
  const [formData, setFormData] = useState<OrderFormData>({
    name: '', phone: '', city: 'الجزائر', qty: 1, notes: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; qty?: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'qty') setFormData((current) => ({ ...current, qty: Number(value) }));
    if (name === 'name') setFormData((current) => ({ ...current, name: value }));
    if (name === 'phone') setFormData((current) => ({ ...current, phone: value }));
    if (name === 'city') setFormData((current) => ({ ...current, city: value }));
    if (name === 'notes') setFormData((current) => ({ ...current, notes: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    const phone = formData.phone.replace(/[\s()-]/g, '');
    if (!/^(?:0[567]\d{8}|\+?213[567]\d{8})$/.test(phone)) newErrors.phone = 'أدخل رقم هاتف جزائري صالحاً';
    if (!Number.isInteger(Number(formData.qty)) || Number(formData.qty) < 1 || Number(formData.qty) > productConfig.maxQty) newErrors.qty = `الكمية من 1 إلى ${productConfig.maxQty}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    
    const total = formData.qty * productConfig.price;
    const orderData = {
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      qty: Number(formData.qty),
      notes: formData.notes,
      website: String(new FormData(e.currentTarget).get("website") || ""),
      product: productConfig.name,
      price: productConfig.price,
      total: total,
      currency: productConfig.currency,
      date: new Date().toLocaleString('ar-DZ')
    };

    const message = productConfig.whatsappMessage(orderData);
    const waUrl = `https://wa.me/${productConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappTab = window.open('about:blank', '_blank');

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success !== true) {
        setStatus('error');
        setSaveMessage(result?.message || 'تعذر تسجيل الطلب. يمكنك إكماله عبر واتساب.');
      } else if (result.persisted) {
        trackLead({ product: orderData.product });
        setStatus('success');
        setSaveMessage('تم حفظ الطلب بنجاح. أرسل رسالة واتساب لتأكيده.');
      } else {
        setStatus('success');
        setSaveMessage('لم يُحفظ الطلب في جدول. أرسل رسالة واتساب لإتمامه.');
      }
    } catch {
      setStatus('error');
      setSaveMessage('تعذر الاتصال بخدمة تسجيل الطلب. يمكنك إكماله عبر واتساب.');
    }

    if (whatsappTab) {
      whatsappTab.location.href = waUrl;
    } else {
      window.location.assign(waUrl);
    }
  };

  const total = formData.qty * (productConfig.price || 0);

  return (
    <section id="order-form" className={`section ${styles.orderSection}`}>
      <div className="container">
        <div className={styles.formWrapper}>
          <h2 className="section-title">اطلب الآن</h2>
          <p className="section-subtitle">املأ البيانات وسنتواصل معك عبر الواتساب</p>
          
          <div className={styles.content}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                <label htmlFor="order-website">Leave this field empty</label>
                <input id="order-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="order-name">الاسم الكامل *</label>
                <input id="order-name" type="text" name="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'order-name-error' : undefined} required value={formData.name} onChange={handleChange} placeholder="أدخل اسمك الكامل" />
                {errors.name && <span id="order-name-error" className={styles.error}>{errors.name}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="order-phone">رقم الجوال *</label>
                <input id="order-phone" type="tel" name="phone" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'order-phone-error' : undefined} placeholder="+213 5XX XX XX XX" required value={formData.phone} onChange={handleChange} dir="ltr" style={{textAlign: 'right'}} />
                {errors.phone && <span id="order-phone-error" className={styles.error}>{errors.phone}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="order-city">المدينة</label>
                <select id="order-city" name="city" value={formData.city} onChange={handleChange}>
                  {productConfig.cities.map(wilaya => <option key={wilaya} value={wilaya}>{wilaya}</option>)}
                </select>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="order-quantity">الكمية</label>
                  <input id="order-quantity" type="number" name="qty" aria-invalid={Boolean(errors.qty)} aria-describedby={errors.qty ? 'order-quantity-error' : undefined} min="1" max={productConfig.maxQty} value={formData.qty} onChange={handleChange} />
                  {errors.qty && <span id="order-quantity-error" className={styles.error}>{errors.qty}</span>}
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="order-notes">ملاحظات إضافية</label>
                <textarea id="order-notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="اكتب أي ملاحظات إضافية (اختياري)"></textarea>
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={status === 'loading' || status === 'success'}>
                {status === 'idle' && (
                  <>
                    <svg viewBox="0 0 32 32" className={styles.waIcon} fill="currentColor" width="24" height="24">
                      <path d="M16 2.5a13.5 13.5 0 0 0-11.4 20.7l-1.8 5.4 5.6-1.8A13.5 13.5 0 1 0 16 2.5zm7.8 19.3c-.3.9-1.8 1.7-2.6 1.8-.7.1-1.6.3-4.6-1-3.6-1.5-6-5.3-6.1-5.5-.2-.2-1.5-1.9-1.5-3.7s.9-2.6 1.3-3c.3-.3.7-.4 1-.4.2 0 .5 0 .7.1.3 0 .6-.1.9.7.3.8 1 2.5 1 2.7.1.2.2.4.1.6-.1.3-.2.4-.4.6l-.5.6c-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.5 1.4 1.3 2.6 1.7 2.9 1.8.3.2.5.1.7-.1.2-.2.8-1 1-1.3.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.2.3.2 1-.1 1.9z"/>
                    </svg>
                    أرسل الطلب عبر واتساب
                  </>
                )}
                {status === 'loading' && <span className={styles.spinner}></span>}
                {status === 'success' && <span className={styles.checkmark}>✓ تم تجهيز الطلب</span>}
                {status === 'error' && 'المتابعة عبر واتساب'}
              </button>
              {saveMessage && <p role="status" aria-live="polite">{saveMessage}</p>}
            </form>

            <div className={styles.summary}>
              <h3>ملخص الطلب</h3>
              <div className={styles.summaryItem}>
                <span>المنتج</span>
                <span>{productConfig.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>السعر</span>
                <span>{productConfig.price} {productConfig.currency}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>الكمية</span>
                <span>{formData.qty}</span>
              </div>
              {productConfig.oldPrice && (
                <div className={styles.summaryItem}>
                  <span>الخصم</span>
                  <span className={styles.discount}>-{(productConfig.oldPrice - productConfig.price) * formData.qty} {productConfig.currency}</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>الإجمالي</span>
                <span>{total} {productConfig.currency}</span>
              </div>
              <div className={styles.guarantee}>
                <span>🛡️</span>
                  <p>{productConfig.guaranteeText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
