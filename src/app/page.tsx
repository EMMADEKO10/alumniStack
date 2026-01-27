import Hero from "../ui/Hero";
import Features from "../ui/Features";
import Testimonials from "../ui/Testimonials";
import Events from "../ui/Events";
import Contribute from "../ui/Contribute";
// import Newsletter from "../ui/Newsletter";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section - Première impression */}
      <Hero />
       {/* Contribute Section - Appel aux dons */}
      <Contribute />
      {/* Events Section - Engagement communautaire */}
      <Events />
      
      {/* Features Section - Présentation des fonctionnalités */}
      <Features />
      
      {/* Stats Section - Impact et crédibilité */}
      {/* <Stats /> */}
      
      {/* Testimonials Section - Preuve sociale */}
      <Testimonials />
      
      
      {/* About Section - Information sur l'organisation */}
      {/* <About /> */}
      
      {/* Newsletter Section - Capture d'audience */}
      {/* <Newsletter /> */}
    </main>
  );
}
