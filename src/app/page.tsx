import LandingShell from '@/features/landing/LandingShell';
import Hero from '@/features/landing/Hero';
import Features from '@/features/landing/Features';
import Blog from '@/features/landing/Blog';
import Footer from '@/features/landing/Footer';

export default function HomePage() {
  return (
    <>
      <LandingShell />
      <main>
        <Hero />
        <Features />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
