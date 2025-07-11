'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaCheck, FaBell, FaGift, FaUsers, FaCalendarAlt } from "react-icons/fa";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simuler un appel API
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  const benefits = [
    {
      icon: <FaBell className="text-2xl" />,
      title: "Alertes Opportunités",
      description: "Soyez notifié en premier des nouvelles offres d'emploi exclusives"
    },
    {
      icon: <FaCalendarAlt className="text-2xl" />,
      title: "Événements VIP",
      description: "Accès prioritaire aux événements networking et conférences"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Success Stories",
      description: "Découvrez les parcours inspirants de vos pairs alumni"
    },
    {
      icon: <FaGift className="text-2xl" />,
      title: "Avantages Exclusifs",
      description: "Réductions et offres spéciales réservées aux abonnés"
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <FaCheck className="text-4xl text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Merci pour votre inscription ! 🎉
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mb-8"
          >
            Vous recevrez bientôt votre première newsletter avec les dernières 
            opportunités et événements du réseau Legacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-green-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              En attendant, explorez :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/community" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <FaUsers className="text-blue-600 mr-3" />
                <span className="font-medium">Le réseau</span>
              </a>
              <a href="/events" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <FaCalendarAlt className="text-purple-600 mr-3" />
                <span className="font-medium">Événements</span>
              </a>
              <a href="/opportunities" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <FaBell className="text-orange-600 mr-3" />
                <span className="font-medium">Opportunités</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium mb-6">
              <FaEnvelope className="mr-2" />
              Newsletter Legacy Alumni
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Restez au cœur de
              <span className="block text-red-200">
                l&apos;actualité alumni
              </span>
            </h2>

            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Recevez chaque semaine les dernières opportunités de carrière, 
              événements exclusifs et success stories de notre communauté.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="text-red-200">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-red-100 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 text-red-100">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-red-400 to-red-500"
                  />
                ))}
              </div>
              <span className="text-sm">
                <strong className="text-white">45,000+</strong> alumni déjà abonnés
              </span>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Inscription gratuite
                </h3>
                <p className="text-gray-600">
                  Rejoignez notre newsletter et ne ratez rien !
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Inscription en cours...
                    </div>
                  ) : (
                    "S'abonner gratuitement"
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-xs text-gray-500 text-center mt-6">
                En vous inscrivant, vous acceptez de recevoir nos newsletters. 
                Vous pouvez vous désabonner à tout moment.
              </p>

              {/* Trust Indicators */}
              <div className="flex justify-center items-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1x</div>
                  <div className="text-xs text-gray-500">par semaine</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-xs text-gray-500">spam</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">100%</div>
                  <div className="text-xs text-gray-500">gratuit</div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg transform rotate-12">
              🎁 Guide carrière offert !
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 