'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHandHoldingHeart, 
  FaNetworkWired,
  FaArrowRight,
  FaBookOpen
} from "react-icons/fa";

const Features: React.FC = () => {
  const features = [
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Réseau Alumni",
      description: "Connectez-vous avec plus de 100,000 anciens étudiants à travers le monde entier.",
      link: "/community",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      stats: "100K+ membres"
    },
    {
      icon: <FaBriefcase className="text-4xl" />,
      title: "Opportunités Carrière",
      description: "Découvrez des offres d'emploi exclusives partagées par notre communauté.",
      link: "/opportunities", 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      stats: "2K+ opportunités"
    },
    {
      icon: <FaCalendarAlt className="text-4xl" />,
      title: "Événements Alumni",
      description: "Participez à des événements, conférences et retrouvailles organisés régulièrement.",
      link: "/events",
      color: "from-purple-500 to-purple-600", 
      bgColor: "bg-purple-50",
      stats: "500+ événements/an"
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      title: "Formations Continue",
      description: "Accédez à des formations professionnelles pour développer vos compétences.",
      link: "/formations",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50", 
      stats: "200+ formations"
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl" />,
      title: "Contribuer & Donner",
      description: "Soutenez les projets de l'université et aidez les nouveaux étudiants.",
      link: "/donations",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      stats: "€2M+ collectés"
    },
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Histoires Inspirantes",
      description: "Partagez votre parcours et inspirez la prochaine génération d'étudiants.",
      link: "/stories",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      stats: "1K+ histoires"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <FaNetworkWired className="mr-2" />
            Fonctionnalités principales
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tout ce dont vous avez besoin pour
            <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              rester connecté
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre plateforme offre tous les outils nécessaires pour maintenir et développer 
            votre réseau professionnel alumni.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <Link href={feature.link}>
                <div className={`${feature.bgColor} rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 relative overflow-hidden`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-full transform translate-x-16 -translate-y-16`}></div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-semibold text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Découvrir</span>
                    <FaArrowRight className="ml-2 text-sm" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Prêt à rejoindre la communauté LAU ?
            </h3>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Inscrivez-vous aujourd&apos;hui et commencez à bénéficier de tous 
              les avantages de notre réseau alumni.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
            >
              Commencer maintenant
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 