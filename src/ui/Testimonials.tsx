'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaLinkedin, FaTwitter } from "react-icons/fa";

const Testimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Stephane Kalenga",
      role: "CEO & Founder",
      company: "TechVenture Inc.",
      promo: "Promo 2024",
      avatar: "SJ",
      quote: "Le réseau LAU a été déterminant dans le lancement de ma startup. J'ai trouvé mes premiers investisseurs et mes meilleurs talents grâce aux connexions que j'ai faites sur la plateforme.",
      rating: 5,
      social: {
        linkedin: "#",
        twitter: "#"
      },
      achievement: "Levée de fonds de 10M€"
    }
    
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <FaQuoteLeft className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
            Témoignages
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 px-4 tracking-tight leading-tight">
            Ce que disent nos
            <span className="block bg-linear-to-r from-red-600 to-red-700 bg-clip-text text-transparent mt-2">
              Alumni
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Découvrez comment le réseau LAU a transformé la carrière de milliers d&apos;anciens étudiants.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          key={activeTestimonial}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 lg:p-10 relative">
            
            {/* Quote Icon */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <FaQuoteLeft className="text-white text-sm sm:text-lg" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-4 sm:mb-6 pt-2">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl mx-0.5" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-base sm:text-lg lg:text-xl text-gray-700 text-center leading-relaxed mb-6 sm:mb-8 font-normal px-2 sm:px-4 italic">
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl mr-3 sm:mr-4 shadow-md shrink-0">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                    {testimonials[activeTestimonial].role}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                    {testimonials[activeTestimonial].company}
                  </p>
                  <p className="text-xs sm:text-sm text-red-600 font-medium mt-0.5">
                    {testimonials[activeTestimonial].promo}
                  </p>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-md whitespace-nowrap">
                {testimonials[activeTestimonial].achievement}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-3">
              <a 
                href={testimonials[activeTestimonial].social.linkedin}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-sm sm:text-base" />
              </a>
              <a 
                href={testimonials[activeTestimonial].social.twitter}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm sm:text-base" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-8 sm:mb-12 lg:mb-16">
          <motion.button
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 flex items-center justify-center font-bold shadow-md hover:shadow-lg"
            aria-label="Témoignage précédent"
          >
            ←
          </motion.button>

          {/* Dots Indicator */}
          <div className="flex space-x-1.5 sm:space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-red-600 w-6 sm:w-8' 
                    : 'bg-red-200 hover:bg-red-300 w-2 sm:w-2.5'
                }`}
                aria-label={`Voir témoignage ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 flex items-center justify-center font-bold shadow-md hover:shadow-lg"
            aria-label="Témoignage suivant"
          >
            →
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
