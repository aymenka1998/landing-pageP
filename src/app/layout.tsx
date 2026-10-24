import { Tajawal } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ProductConfigProvider } from '@/config/ProductConfigProvider';
import { getProductConfig } from '@/config/getProduct';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductConfig();
  const title = [product.name, product.tagline].filter(Boolean).join(' | ');
  const description = product.description || product.tagline || product.name;

  return {
    title,
    description,
    keywords: [product.name, product.type, 'متجر إلكتروني'].filter(Boolean),
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

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
