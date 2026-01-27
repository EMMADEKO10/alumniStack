"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  CheckCircleIcon,

  DocumentTextIcon,
  StarIcon,
  PlayCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface Formation {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  price: number;
  startDate: Date;
  endDate: Date;
  location: string;
  maxStudents?: number;
  imageUrl: string;
  createdAt: Date;
}

const FormationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const formationId = params.id as string;
        
        // Si l'ID commence par "demo", utilise les données de démonstration
        if (formationId.startsWith("demo")) {
          const demoFormations: Formation[] = [
            {
              _id: "demo1",
              title: "Design d'expérience utilisateur (UX)",
              description: "Découvrez les principes fondamentaux du design d'expérience utilisateur (UX) et apprenez à créer des interfaces utilisateur intuitives et attrayantes. Cette formation complète vous donnera toutes les compétences nécessaires pour exceller dans le domaine du design UX.\n\nCe que vous apprendrez :\n• Les bases du design centré utilisateur\n• Méthodes de recherche utilisateur et personas\n• Wireframing et prototypage avec Figma\n• Tests d'utilisabilité et itération\n• Principes de design d'interface (UI)\n• Accessibilité et design inclusif\n\nÀ la fin de cette formation, vous serez capable de concevoir des expériences utilisateur complètes, de la recherche initiale au prototype final. Vous maîtriserez les outils professionnels et les méthodologies utilisées dans l'industrie.",
              duration: "5 semaines",
              level: "Débutant",
              instructor: "Sarah Martin",
              price: 300,
              startDate: new Date("2024-02-15"),
              endDate: new Date("2024-03-29"),
              location: "En ligne + 2 sessions présentielles à Paris",
              maxStudents: 25,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/v1747579799/_21bd88b7-e386-45d7-9db3-7ba43b135625_iokqbi.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Développement Web avancé",
              description: "Apprenez les techniques de développement Web avancées, y compris les frameworks populaires tels que React et Vue.js. Cette formation intensive vous permettra de maîtriser les technologies modernes du développement frontend et backend.\n\nProgramme détaillé :\n• Architecture moderne des applications web\n• React.js : composants, hooks, contexte, et routing\n• Vue.js : réactivité, composition API, et Vuex\n• Node.js et développement d'APIs REST\n• Bases de données et ORM (Prisma, TypeORM)\n• Déploiement et DevOps (Docker, CI/CD)\n• Bonnes pratiques et tests automatisés\n\nFormation hands-on avec projets pratiques à chaque module. Vous développerez une application complète en fin de parcours. Accès au mentorat individuel et à une communauté d'apprenants.",
              duration: "8 semaines",
              level: "Avancé",
              instructor: "Jean Dupont",
              price: 499,
              startDate: new Date("2024-03-01"),
              endDate: new Date("2024-04-26"),
              location: "Paris, France (Hybrid: 50% présentiel, 50% distanciel)",
              maxStudents: 20,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/c_fill,w_800,h_600/v1747579800/web-development-course_abc123.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Marketing numérique pour les entrepreneurs",
              description: "Découvrez les stratégies et les outils du marketing numérique pour développer votre entreprise en ligne. Formation pratique axée sur l'acquisition de clients et la croissance business.\n\nContenu de la formation :\n• Stratégie digitale et positionnement\n• SEO et référencement naturel\n• Google Ads et publicité payante\n• Marketing des réseaux sociaux\n• Email marketing et automation\n• Analytics et mesure de performance\n• Growth hacking et conversion\n\nFormation conçue spécialement pour les entrepreneurs et créateurs d'entreprise. Chaque participant travaillera sur son propre projet business. Outils fournis et accès aux plateformes premium inclus. Support post-formation de 3 mois.",
              duration: "4 semaines",
              level: "Intermédiaire",
              instructor: "Marie Dubois",
              price: 199,
              startDate: new Date("2024-02-20"),
              endDate: new Date("2024-03-20"),
              location: "Lyon, France + Sessions live online",
              maxStudents: 30,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/c_scale,w_800,h_600,q_auto,f_auto/v1747579801/digital-marketing-course_def456.jpg",
              createdAt: new Date()
            }
          ];
          
          const demoFormation = demoFormations.find(f => f._id === formationId);
          if (demoFormation) {
            setFormation(demoFormation);
          } else {
            setError("Formation non trouvée");
          }
        } else {
          const response = await fetch(`/api/formations/${formationId}`);
          if (!response.ok) {
            throw new Error("Formation non trouvée");
          }
          const data = await response.json();
          setFormation(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la formation:", err);
        setError("Impossible de charger les détails de la formation");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFormation();
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermédiaire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'avancé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isFormationStarted = () => {
    return new Date() > new Date(formation!.startDate);
  };

  const isFormationEnded = () => {
    return new Date() > new Date(formation!.endDate);
  };

  const getDaysUntilStart = () => {
    const now = new Date();
    const start = new Date(formation!.startDate);
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEnroll = () => {
    setIsEnrolled(!isEnrolled);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cette formation : ${formation?.title} par ${formation?.instructor}`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
        <div className="pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Skeleton bouton retour */}
            <div className="h-6 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>

            {/* Skeleton Hero */}
            <div className="relative h-96 w-full rounded-2xl bg-gray-200 mb-8 animate-pulse"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Skeleton contenu principal */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-4 bg-gray-100 rounded-xl">
                        <div className="h-12 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>

              {/* Skeleton sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="h-14 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-red-800 hover:text-red-900 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Erreur : {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStudents = Math.floor(Math.random() * (formation.maxStudents || 20)); // Simulation
  const daysUntilStart = getDaysUntilStart();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Espacement pour le header fixe */}
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bouton de retour */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-red-600 hover:text-red-700 mb-8 transition-colors font-medium group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Retour aux formations
          </button>

          {/* Hero Section avec image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-xl">
            {formation.imageUrl ? (
              <Image
                src={formation.imageUrl}
                alt={formation.title}
                fill
                className="object-cover"
                sizes="(max-width: 1536px) 100vw, 1536px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <AcademicCapIcon className="h-32 w-32 text-white opacity-50" />
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Contenu sur l'image */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 backdrop-blur-sm ${getLevelColor(formation.level)} bg-white/90`}>
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  {formation.level}
                </div>
                <div className="bg-linear-to-r from-red-600 to-rose-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg backdrop-blur-sm">
                  {formatPrice(formation.price)}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {formation.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <AcademicCapIcon className="h-5 w-5" />
                  <span className="font-semibold">{formation.instructor}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ClockIcon className="h-5 w-5" />
                  <span>{formation.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <UserGroupIcon className="h-5 w-5" />
                  <span>{currentStudents} / {formation.maxStudents || '∞'} inscrits</span>
                </div>
              </div>
            </div>
            
            {/* Bouton de partage */}
            <div className="absolute top-6 right-6">
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => shareOnSocial("facebook")}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        👥 Partager sur Facebook
                      </button>
                      <button
                        onClick={() => shareOnSocial("twitter")}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        🐦 Partager sur Twitter
                      </button>
                      <button
                        onClick={() => shareOnSocial("linkedin")}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        💼 Partager sur LinkedIn
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => shareOnSocial("copy")}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        🔗 Copier le lien
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Informations clés en grille */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Dates</p>
                    <p className="text-gray-700 text-sm">Du {formatDate(formation.startDate)}</p>
                    <p className="text-gray-700 text-sm">au {formatDate(formation.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <ClockIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Durée</p>
                    <p className="text-gray-700">{formation.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <MapPinIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Lieu</p>
                    <p className="text-gray-700">{formation.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <UserGroupIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Participants</p>
                    <p className="text-gray-700 font-medium">
                      {currentStudents} / {formation.maxStudents || 'Illimité'} inscrits
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos de cette formation</h2>
                <div className="prose max-w-none">
                  {formation.description.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Avantages */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ce qui est inclus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Accès aux supports de cours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Certificat de fin de formation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Suivi personnalisé</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Accès à la communauté</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Support post-formation (30 jours)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">Projets pratiques</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Prix et inscription */}
              <div className="mb-6">
                <div className="text-center mb-6 p-6 bg-linear-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
                  <p className="text-4xl font-bold bg-linear-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                    {formatPrice(formation.price)}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Prix total de la formation</p>
                </div>
                
                {!isFormationEnded() ? (
                  <>
                    {!isFormationStarted() ? (
                      <>
                        {daysUntilStart > 0 && (
                          <div className="mb-4 p-4 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                            <p className="text-blue-800 font-semibold text-center">
                              Début dans {daysUntilStart} jour{daysUntilStart !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                        
                        {formation.maxStudents && currentStudents >= formation.maxStudents ? (
                          <div className="mb-4 p-4 bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 font-semibold text-center">
                              Formation complète
                            </p>
                          </div>
                        ) : (
                          <div className="mb-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <CheckCircleIcon className="h-6 w-6 text-green-600" />
                              <p className="text-green-800 font-semibold">
                                Places disponibles
                              </p>
                            </div>
                            {formation.maxStudents && (
                              <div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div 
                                    className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" 
                                    style={{ width: `${(currentStudents / formation.maxStudents) * 100}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-center mt-2 font-semibold text-gray-700">
                                  {formation.maxStudents - currentStudents} places restantes
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <button
                          onClick={handleEnroll}
                          disabled={!!(formation.maxStudents && currentStudents >= formation.maxStudents)}
                          className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                            isEnrolled
                              ? "bg-linear-to-r from-green-600 to-emerald-600 text-white"
                              : formation.maxStudents && currentStudents >= formation.maxStudents
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
                          }`}
                        >
                          {isEnrolled ? "✓ Inscrit à la formation" : 
                           formation.maxStudents && currentStudents >= formation.maxStudents ? "Formation complète" : 
                           "S'inscrire maintenant"}
                        </button>
                      </>
                    ) : (
                      <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <PlayCircleIcon className="h-6 w-6 text-blue-600" />
                          <p className="text-blue-800 font-semibold">Formation en cours</p>
                        </div>
                        <button className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold transform hover:scale-105">
                          Accéder au contenu
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                    <p className="text-gray-600 font-semibold text-center">Formation terminée</p>
                  </div>
                )}
              </div>

              {/* Informations instructeur */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                  Instructeur
                </h3>
                <div className="flex items-start gap-3 p-4 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">
                      {formation.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{formation.instructor}</p>
                    <p className="text-sm text-gray-600 mb-2">Expert formateur</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-600 ml-1 font-semibold">(4.9/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations pratiques */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-green-600" />
                  Informations pratiques
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Support de cours inclus</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Certificat délivré</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <BookmarkIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Niveau {formation.level.toLowerCase()}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <CurrencyEuroIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Paiement en 3x possible</span>
                  </div>
                </div>
              </div>

              {/* Actions secondaires */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 border-2 border-indigo-300 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 transform hover:scale-105">
                    Programme
                  </button>
                  <button className="py-3 px-4 border-2 border-purple-300 rounded-xl text-sm font-semibold text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FormationDetailPage; 