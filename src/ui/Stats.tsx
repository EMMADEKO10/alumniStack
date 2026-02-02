'use client';

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FaGraduationCap, FaUsers, FaBriefcase, FaGlobe, FaHeart, FaRocket } from "react-icons/fa";

interface StatItem {
  icon: React.ReactNode;
  number: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const Stats: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const stats: StatItem[] = [
    {
      icon: <FaUsers className="text-4xl" />,
      number: 100000,
      suffix: "+",
      label: "Alumni connectés",
      description: "Dans le monde entier",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaGlobe className="text-4xl" />,
      number: 150,
      suffix: "+",
      label: "Pays représentés",
      description: "Sur tous les continents",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaBriefcase className="text-4xl" />,
      number: 2500,
      suffix: "+",
      label: "Opportunités créées",
      description: "Cette année",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaRocket className="text-4xl" />,
      number: 85,
      suffix: "%",
      label: "Taux de placement",
      description: "Via notre réseau",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      number: 2000000,
      suffix: "€",
      label: "Fonds collectés",
      description: "Pour les projets étudiants",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      number: 500,
      suffix: "+",
      label: "Événements par an",
      description: "Partout dans le monde",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-linear-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-purple-500/5 rounded-full filter blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium mb-6">
            📊 Impact LAU
          </div>
          <h2 className="typography-heading-1 font-bold mb-6">
            Notre impact en
            <span className="block bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              chiffres
            </span>
          </h2>
          <p className="typography-body text-gray-300 max-w-3xl mx-auto">
            Découvrez l&apos;ampleur de notre réseau et l&apos;impact concret que nous créons 
            pour notre communauté d&apos;alumni.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br ${stat.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="scale-75 sm:scale-100">
                    {stat.icon}
                  </div>
                </div>

                {/* Animated Number */}
                <div className="mb-4">
                  <AnimatedCounter 
                    value={stat.number} 
                    suffix={stat.suffix}
                    isInView={isInView}
                    delay={index * 0.2}
                  />
                </div>

                {/* Label */}
                <h3 className="typography-card-title text-white mb-2">
                  {stat.label}
                </h3>
                <p className="typography-small text-gray-400">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous aussi, faites partie de ces chiffres ! 
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Rejoignez une communauté qui grandit chaque jour et qui crée des opportunités 
              concrètes pour tous ses membres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
              >
                Rejoindre la communauté
              </motion.a>
              <motion.a
                href="/events"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Découvrir nos événements
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Composant pour l'animation des chiffres
interface AnimatedCounterProps {
  value: number;
  suffix: string;
  isInView: boolean;
  delay: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, suffix, isInView, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 2000; // 2 secondes
        const increment = value / (duration / 16); // 60 FPS

        const counter = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(counter);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
      {formatNumber(count)}{suffix}
    </div>
  );
};

export default Stats; 
