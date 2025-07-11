'use client';

import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useState } from "react";

const Testimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO & Founder",
      company: "TechVenture Inc.",
      promo: "Promo 2015",
      avatar: "SJ",
      quote: "Le réseau Legacy a été déterminant dans le lancement de ma startup. J'ai trouvé mes premiers investisseurs et mes meilleurs talents grâce aux connexions que j'ai faites sur la plateforme.",
      rating: 5,
      social: {
        linkedin: "#",
        twitter: "#"
      },
      achievement: "Levée de fonds de 10M€"
    },
    {
      id: 2,
      name: "Michel Dubois",
      role: "Directeur Innovation",
      company: "AirFrance-KLM",
      promo: "Promo 2012",
      avatar: "MD",
      quote: "Grâce aux événements networking Legacy, j'ai pu développer un réseau international qui m'a ouvert des portes incroyables. La qualité des échanges est exceptionnelle.",
      rating: 5,
      social: {
        linkedin: "#",
        twitter: "#"
      },
      achievement: "Prix Innovation 2023"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Senior Data Scientist",
      company: "Google",
      promo: "Promo 2018",
      avatar: "ER",
      quote: "Les formations proposées par la communauté m'ont permis de rester à la pointe des dernières technologies. Un investissement qui a transformé ma carrière.",
      rating: 5,
      social: {
        linkedin: "#",
        twitter: "#"
      },
      achievement: "Top 30 under 30 - Forbes"
    },
    {
      id: 4,
      name: "David Chen",
      role: "Investment Partner",
      company: "Sequoia Capital",
      promo: "Promo 2010",
      avatar: "DC",
      quote: "Legacy m'a permis de donner en retour à ma communauté tout en identifiant les talents de demain. Un écosystème unique qui crée de la valeur pour tous.",
      rating: 5,
      social: {
        linkedin: "#",
        twitter: "#"
      },
      achievement: "100M€+ investis en startups"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-white relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <FaQuoteLeft className="mr-2" />
            Témoignages
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ce que disent nos
            <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Alumni
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment le réseau Legacy a transformé la carrière de milliers d&apos;anciens étudiants.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          key={activeTestimonial}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative">
            
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <FaQuoteLeft className="text-white text-xl" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl mx-1" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl lg:text-3xl text-gray-700 text-center leading-relaxed mb-8 font-light">
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-center lg:text-left">
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].role} chez {testimonials[activeTestimonial].company}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    {testimonials[activeTestimonial].promo}
                  </p>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {testimonials[activeTestimonial].achievement}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center mt-6 space-x-4">
              <a 
                href={testimonials[activeTestimonial].social.linkedin}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <FaLinkedin />
              </a>
              <a 
                href={testimonials[activeTestimonial].social.twitter}
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-red-600 w-8' 
                    : 'bg-red-200 hover:bg-red-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            →
          </button>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">98%</div>
            <div className="text-gray-600 text-sm">Taux de satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">15K+</div>
            <div className="text-gray-600 text-sm">Connexions créées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">85%</div>
            <div className="text-gray-600 text-sm">Trouvent un emploi via le réseau</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">5K+</div>
            <div className="text-gray-600 text-sm">Entreprises partenaires</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 