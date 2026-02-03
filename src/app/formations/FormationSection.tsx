"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  ArrowRightIcon,
  SignalIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface Formation {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  startDate: string;
  maxParticipants?: number;
  participants?: unknown[];
  imageUrl?: string;
  isActive?: boolean;
  createdAt: Date;
}

const FormationSection: React.FC = () => {
  const router = useRouter();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch("/api/formations");
        if (!response.ok) {
          const demoData: Formation[] = [
            {
              _id: "demo1",
              title: "Leadership & Management",
              description: "Développez vos compétences en leadership et apprenez à gérer efficacement une équipe.",
              instructor: "Dr. Marie Dupont",
              duration: "8 semaines",
              level: "Intermédiaire",
              category: "Management",
              price: "599 €",
              startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              maxParticipants: 30,
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Marketing Digital Avancé",
              description: "Maîtrisez les stratégies de marketing digital pour booster votre présence en ligne.",
              instructor: "Sophie Martin",
              duration: "6 semaines",
              level: "Avancé",
              category: "Marketing",
              price: "499 €",
              startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
              maxParticipants: 25,
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Data Science & IA",
              description: "Initiez-vous à la science des données et à l'intelligence artificielle.",
              instructor: "Prof. Jean Leroy",
              duration: "10 semaines",
              level: "Débutant",
              category: "Technologie",
              price: "699 €",
              startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
              maxParticipants: 20,
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo4",
              title: "Finance d'Entreprise",
              description: "Comprenez les fondamentaux de la finance et de la gestion d'entreprise.",
              instructor: "Éric Bernard",
              duration: "7 semaines",
              level: "Intermédiaire",
              category: "Finance",
              price: "549 €",
              startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
              maxParticipants: 30,
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            }
          ];
          setFormations(demoData);
          setFilteredFormations(demoData);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setFormations(data || []);
        setFilteredFormations(data || []);
      } catch (err) {
        console.error("Erreur:", err);
        const demoData: Formation[] = [
          {
            _id: "demo1",
            title: "Leadership & Management",
            description: "Développez vos compétences en leadership et apprenez à gérer efficacement une équipe.",
            instructor: "Dr. Marie Dupont",
            duration: "8 semaines",
            level: "Intermédiaire",
            category: "Management",
            price: "599 €",
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            maxParticipants: 30,
            imageUrl: "/graduation.jpg",
            createdAt: new Date()
          }
        ];
        setFormations(demoData);
        setFilteredFormations(demoData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  useEffect(() => {
    let filtered = [...formations];

    if (searchTerm) {
      filtered = filtered.filter(
        (formation) =>
          formation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formation.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLevel !== "all") {
      filtered = filtered.filter((formation) => formation.level === filterLevel);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((formation) => formation.category === filterCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "startDate":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "title":
          return a.title?.localeCompare(b.title) || 0;
        case "price":
          return parseFloat(a.price) - parseFloat(b.price);
        default:
          return 0;
      }
    });

    setFilteredFormations(filtered);
  }, [formations, searchTerm, sortBy, filterLevel, filterCategory]);

  const getLevels = () => {
    return [...new Set(formations.map((f) => f.level).filter(Boolean))];
  };

  const getCategories = () => {
    return [...new Set(formations.map((f) => f.category).filter(Boolean))];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      year: date.getFullYear()
    };
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "débutant":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermédiaire":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "avancé":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
        {/* Skeleton pour barre de recherche */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Skeleton pour cartes de formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Erreur : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-10">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-gray-300 text-sm sm:text-base sm:pl-12 sm:py-2.5"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto justify-start">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <FunnelIcon className="h-4 w-4 text-gray-600 hidden sm:block" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm font-medium hover:border-gray-300 transition-all bg-white"
              >
                <option value="all">Tous niveaux</option>
                {getLevels().map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm font-medium hover:border-gray-300 transition-all bg-white"
            >
              <option value="all">Toutes catégories</option>
              {getCategories().map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm font-medium hover:border-gray-300 transition-all bg-white"
            >
              <option value="startDate">Date</option>
              <option value="title">Titre</option>
              <option value="price">Prix</option>
            </select>

            <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des formations */}
      {filteredFormations.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Aucune formation trouvée</h3>
          <p className="mt-2 text-gray-500 text-xs sm:text-sm px-4">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" 
            : "space-y-4"
        }`}>
          {filteredFormations.map((formation) => {
            const dateInfo = formatDate(formation.startDate);
            return (
              <div 
                key={formation._id} 
                onClick={() => router.push(`/formations/${formation._id}`)}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                      {formation.imageUrl ? (
                        <Image
                          src={formation.imageUrl}
                          alt={formation.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-purple-100 via-indigo-50 to-purple-50 flex items-center justify-center group-hover:from-purple-200 transition-colors duration-300">
                          <AcademicCapIcon className="h-16 w-16 sm:h-20 sm:w-20 text-purple-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="bg-purple-600 text-white rounded-xl p-1.5 sm:p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300 min-w-12 text-center">
                          <p className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider">{dateInfo.month}</p>
                          <p className="text-base sm:text-lg font-bold leading-tight">{dateInfo.day}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold border ${getLevelColor(formation.level)}`}>
                          <SignalIcon className="h-2.5 w-2.5" />
                          {formation.level}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          <TagIcon className="h-2.5 w-2.5" />
                          {formation.category}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {formation.title}
                      </h3>
                      <p className="text-gray-600 text-[11px] sm:text-xs mb-3 line-clamp-2">
                        {formation.description}
                      </p>

                      <div className="mt-auto">
                        <div className="space-y-1.5 mb-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[11px] sm:text-xs">
                            <span className="flex items-center text-gray-700 gap-2 truncate">
                              <AcademicCapIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{formation.instructor}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] sm:text-xs">
                            <span className="flex items-center text-gray-700 gap-2">
                              <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-600 shrink-0" />
                              {formation.duration}
                            </span>
                            <span className="font-bold text-purple-600">{formation.price}</span>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/formations/${formation._id}`);
                          }}
                          className="relative z-10 w-full bg-red-600 text-white py-2 sm:py-2.5 px-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-xl text-xs sm:text-sm"
                        >
                          Détails
                          <ArrowRightIcon className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="relative h-32 w-full sm:h-40 sm:w-40 shrink-0 rounded-xl overflow-hidden">
                      {formation.imageUrl ? (
                        <Image
                          src={formation.imageUrl}
                          alt={formation.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 160px"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-purple-100 to-indigo-50 flex items-center justify-center">
                          <AcademicCapIcon className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${getLevelColor(formation.level)}`}>
                            {formation.level}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {formation.category}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {formation.title}
                        </h3>
                        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                            {formation.duration}
                          </span>
                          <span className="font-bold text-purple-600">{formation.price}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/formations/${formation._id}`);
                        }}
                        className="relative z-10 self-start mt-4 px-4 sm:px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        En savoir plus
                        <ArrowRightIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormationSection;
