import LandingShell from './components/landing/LandingShell';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Blog from './components/landing/Blog';
import Footer from './components/landing/Footer';

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
