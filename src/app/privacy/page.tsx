'use client';

import { useProductConfig } from '@/config/ProductConfigProvider';

export default function PrivacyPage() {
  const product = useProductConfig();
  const email = product.footer?.email || product.email;
  const whatsapp = product.whatsappNumber;

  return (
    <main dir="rtl" className="container" style={{ maxWidth: 850, paddingTop: 48, paddingBottom: 64 }}>
      <h1>سياسة الخصوصية</h1>
      <p>هذه صفحة نموذجية يجب على صاحب المتجر مراجعتها وتحديثها قبل النشر وفق طريقة عمله والمتطلبات القانونية السارية.</p>
      <h2>البيانات التي نجمعها</h2>
      <p>عند إرسال طلب، نعالج الاسم ورقم الهاتف والمدينة والكمية والملاحظات لتأكيد الطلب وتسليمه. إذا اشتركت في النشرة، نحفظ بريدك الإلكتروني وموافقتك لإرسال أخبار وعروض المتجر.</p>
      <h2>مقدمو الخدمات والتسويق</h2>
      <p>قد تُرسل بيانات الطلب إلى الخدمات التي فعّلها المتجر لمعالجة الطلبات مثل Supabase أو Google Sheets. لا تُفعّل أدوات قياس Meta وTikTok إلا بعد موافقتك من نافذة ملفات الارتباط، إذا أضاف المتجر معرّفاتها.</p>
      <h2>الاحتفاظ وطلبات الخصوصية</h2>
      <p>يحدد صاحب المتجر مدة الاحتفاظ المناسبة للطلبات والاشتراكات. لطلب الوصول إلى بياناتك أو تصحيحها أو حذفها، أو لإيقاف رسائل النشرة، تواصل مع المتجر عبر بيانات الاتصال أدناه. أضف هنا مدة المعالجة وأي شروط أو استثناءات تنطبق على متجرك.</p>
      <h2>التواصل</h2>
      <ul>
        {email && <li>البريد الإلكتروني: <a href={`mailto:${email}`}>{email}</a></li>}
        {whatsapp && <li>واتساب: <a href={`https://wa.me/${whatsapp}`} dir="ltr">{whatsapp}</a></li>}
        {!email && !whatsapp && <li>أضف بريد المتجر أو رقم واتساب في إعدادات المتجر ليظهر هنا.</li>}
      </ul>
    </main>
  );
}
