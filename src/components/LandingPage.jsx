import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import Features from './Features.jsx';
import HowItWorks from './HowItWorks.jsx';
import Stats from './Stats.jsx';
import CTA from './CTA.jsx';
import Footer from './Footer.jsx';

export default function LandingPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
