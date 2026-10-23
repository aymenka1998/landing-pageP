import { Tajawal } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ProductConfigProvider } from '@/config/ProductConfigProvider';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'الساعة الذكية برو | تكنولوجيا المستقبل بين يديك',
  description: 'اكتشف الجيل الجديد من الساعات الذكية. تصميم عصري، بطارية تدوم 7 أيام، مقاومة للماء، وتتبع صحي متقدم. اطلب الآن والدفع عند الاستلام.',
  keywords: 'ساعة ذكية، ساعة رياضية، تقنية، متجر الكتروني',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body>
        <ProductConfigProvider><main>{children}</main></ProductConfigProvider>
      </body>
    </html>
  );
}

