'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaHeart, FaChartLine } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Donation {
  _id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt: string;
  category?: string;
  donorCount?: number;
}

const Contribute: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations');
      if (!response.ok) {
        // Données de démonstration si l'API échoue
        const demoData: Donation[] = [
          {
            _id: "demo1",
            title: "Bibliothèque Universitaire",
            description: "Modernisation et extension de notre bibliothèque universitaire pour offrir un environnement d'apprentissage optimal.",
            image: "/graduation.jpg",
            targetAmount: 100000,
            currentAmount: 75000,
            isActive: true,
            createdAt: new Date().toISOString(),
            category: "infrastructure",
            donorCount: 150
          },
          {
            _id: "demo2",
            title: "Bourses d'Excellence",
            description: "Programme de bourses pour soutenir les étudiants méritants issus de familles à revenus modestes.",
            image: "/graduation.jpg",
            targetAmount: 50000,
            currentAmount: 35000,
            isActive: true,
            createdAt: new Date().toISOString(),
            category: "bourse",
            donorCount: 89
          },
          {
            _id: "demo3",
            title: "Laboratoire de Recherche",
            description: "Équipement moderne pour le nouveau laboratoire de recherche en sciences appliquées.",
            image: "/graduation.jpg",
            targetAmount: 80000,
            currentAmount: 80000,
            isActive: false,
            createdAt: new Date().toISOString(),
            category: "recherche",
            donorCount: 120
          }
        ];
        setDonations(demoData.filter(d => d.isActive).slice(0, 3));
        setLoading(false);
        return;
      }
      const data = await response.json();
      // Prendre seulement les 3 premières campagnes actives
      setDonations((data || []).filter((d: Donation) => d.isActive).slice(0, 3));
    } catch (err) {
      console.error("Erreur lors de la récupération des donations:", err);
      // Données de démonstration en cas d'erreur
      const demoData: Donation[] = [
        {
          _id: "demo1",
          title: "Bibliothèque Universitaire",
          description: "Modernisation et extension de notre bibliothèque universitaire pour offrir un environnement d'apprentissage optimal.",
          image: "/graduation.jpg",
          targetAmount: 100000,
          currentAmount: 75000,
          isActive: true,
          createdAt: new Date().toISOString(),
          category: "infrastructure",
          donorCount: 150
        },
        {
          _id: "demo2",
          title: "Bourses d'Excellence",
          description: "Programme de bourses pour soutenir les étudiants méritants issus de familles à revenus modestes.",
          image: "/graduation.jpg",
          targetAmount: 50000,
          currentAmount: 35000,
          isActive: true,
          createdAt: new Date().toISOString(),
          category: "bourse",
          donorCount: 89
        },
        {
          _id: "demo3",
          title: "Laboratoire de Recherche",
          description: "Équipement moderne pour le nouveau laboratoire de recherche en sciences appliquées.",
          image: "/graduation.jpg",
          targetAmount: 80000,
          currentAmount: 45000,
          isActive: true,
          createdAt: new Date().toISOString(),
          category: "recherche",
          donorCount: 85
        }
      ];
      setDonations(demoData.filter(d => d.isActive).slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <section className="py-20 bg-linear-to-b from-white via-red-50/30 to-white relative overflow-hidden">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-linear-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 -right-24 w-96 h-96 bg-linear-to-br from-pink-200/20 to-red-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-100 to-pink-100 rounded-full mb-4">
            <FaHeart className="text-red-600" />
            <span className="text-sm font-semibold text-red-600">Soutenez-nous</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Faites la
            <span className="block bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent mt-1">
              différence
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre générosité aide à bâtir l&apos;avenir de l&apos;éducation et à soutenir nos étudiants dans leur parcours académique.
          </p>
        </motion.div>

        {/* Grille des campagnes de donation */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Aucune campagne active pour le moment.</p>
            <Link href="/donations" className="inline-flex items-center gap-2 mt-4 text-red-600 hover:text-red-700 font-semibold">
              Voir toutes les campagnes <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donations.map((donation, index) => {
              const progress = calculateProgress(donation.currentAmount, donation.targetAmount);
              
              return (
                <motion.div
                  key={donation._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/donations`}>
                    <div className="h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 relative">
                      {/* Effet de brillance au survol */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />
                      
                      {/* Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={donation.image}
                          alt={donation.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {donation.category && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                            {donation.category}
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {donation.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {donation.description}
                        </p>

                        {/* Barre de progression */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-gray-900">
                              {formatAmount(donation.currentAmount)}
                            </span>
                            <span className="text-gray-500">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-linear-to-r from-red-500 to-rose-600 h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                              viewport={{ once: true }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              Objectif: {formatAmount(donation.targetAmount)}
                            </span>
                            {donation.donorCount && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaHeart className="text-red-500" />
                                {donation.donorCount} donateurs
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bouton d'action */}
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold text-sm group-hover:gap-4 transition-all duration-300 shadow-md hover:shadow-lg w-full justify-center">
                          <span>Contribuer</span>
                          <FaArrowRight className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Lien vers toutes les campagnes */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/donations">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold text-base hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Voir toutes les campagnes</span>
              <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Contribute; 
