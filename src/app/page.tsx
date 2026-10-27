import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import OrderForm from '@/components/OrderForm';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGallery />
      <Features />
      <HowItWorks />
      <FAQ />
      <OrderForm />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
