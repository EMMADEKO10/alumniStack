import Hero from "../ui/Hero";
import Features from "../ui/Features";
import Testimonials from "../ui/Testimonials";
import Events from "../ui/Events";
import Contribute from "../ui/Contribute";
import About from "../ui/About";
import Stats from "../ui/Stats";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section - Première impression immersive */}
      <Hero />
      
      {/* Contribute Section - Appel à l'action et philanthropie */}
      <Contribute />
{/* Events Section - Engagement communautaire et actualité */}
      <Events />
      {/* Features Section - Proposition de valeur (Carousel interactif) */}
      <Features />

      {/* About Section - Notre histoire et mission */}
      {/* <About /> */}

      {/* Stats Section - Preuve de l'impact et crédibilité globale */}
      {/* <Stats /> */}
            
      {/* Testimonials Section - Preuve sociale par les pairs */}
      <Testimonials />
    </main>
  );
}
