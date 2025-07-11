import Hero from "../ui/Hero";
import Features from "../ui/Features";
import Stats from "../ui/Stats";
import Testimonials from "../ui/Testimonials";
import Events from "../ui/Events";
import About from "../ui/About";
import Contribute from "../ui/Contribute";
import Newsletter from "../ui/Newsletter";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section - Première impression */}
      <Hero />
      
      {/* Features Section - Présentation des fonctionnalités */}
      <Features />
      
      {/* Stats Section - Impact et crédibilité */}
      <Stats />
      
      {/* Testimonials Section - Preuve sociale */}
      <Testimonials />
      
      {/* Events Section - Engagement communautaire */}
      <Events />
      
      {/* About Section - Information sur l'organisation */}
      <About />
      
      {/* Contribute Section - Appel aux dons */}
      <Contribute />
      
      {/* Newsletter Section - Capture d'audience */}
      <Newsletter />
    </main>
  );
}
