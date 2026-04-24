import LandingShell from './components/landing/LandingShell';
import Hero from './components/landing/Hero';
import Services from './components/landing/Services';
import MiniTool from './components/landing/MiniTool';
import Blog from './components/landing/Blog';
import Footer from './components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <LandingShell />
      <main>
        <Hero />
        <Services />
        <MiniTool />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
