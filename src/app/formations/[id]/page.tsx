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
import { HeartIcon } from "@heroicons/react/24/solid";

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
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            <span className="ml-3 text-gray-600">Chargement des détails...</span>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        {/* Bouton de retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-red-800 hover:text-red-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux formations
        </button>

        {/* Image principale */}
        <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          {formation.imageUrl ? (
            <Image
              src={formation.imageUrl}
              alt={formation.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <AcademicCapIcon className="h-24 w-24 text-white opacity-80" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-6 left-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getLevelColor(formation.level)}`}>
              <ChartBarIcon className="h-4 w-4 mr-2" />
              {formation.level}
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="bg-red-800 text-white px-4 py-2 rounded-lg font-bold text-lg">
              {formatPrice(formation.price)}
            </div>
          </div>
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={handleFavorite}
              className={`p-3 rounded-full shadow-lg transition-colors ${
                isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <HeartIcon className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-3 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-lg transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => shareOnSocial("facebook")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Partager sur Facebook
                    </button>
                    <button
                      onClick={() => shareOnSocial("twitter")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Partager sur Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial("linkedin")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Partager sur LinkedIn
                    </button>
                    <button
                      onClick={() => shareOnSocial("copy")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copier le lien
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* En-tête */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{formation.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-xl text-red-800 font-semibold">par {formation.instructor}</span>
                </div>
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Dates</p>
                    <p className="text-gray-600">Du {formatDate(formation.startDate)}</p>
                    <p className="text-gray-600">au {formatDate(formation.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Durée</p>
                    <p className="text-gray-600">{formation.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Lieu</p>
                    <p className="text-gray-600">{formation.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserGroupIcon className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Participants</p>
                    <p className="text-gray-600">
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
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Accès aux supports de cours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Certificat de fin de formation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Suivi personnalisé</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Accès à la communauté</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Support post-formation (30 jours)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Projets pratiques</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Prix et inscription */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-red-800">{formatPrice(formation.price)}</p>
                  <p className="text-sm text-gray-600">Prix total de la formation</p>
                </div>
                
                {!isFormationEnded() ? (
                  <>
                    {!isFormationStarted() ? (
                      <>
                        {daysUntilStart > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 font-medium text-sm text-center">
                              Début dans {daysUntilStart} jour{daysUntilStart !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                        
                        {formation.maxStudents && currentStudents >= formation.maxStudents ? (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 font-medium text-sm text-center">
                              Formation complète
                            </p>
                          </div>
                        ) : (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              <p className="text-green-800 font-medium text-sm">
                                Places disponibles
                              </p>
                            </div>
                            {formation.maxStudents && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${(currentStudents / formation.maxStudents) * 100}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-center mt-1 text-gray-600">
                                  {formation.maxStudents - currentStudents} places restantes
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <button
                          onClick={handleEnroll}
                          disabled={formation.maxStudents && currentStudents >= formation.maxStudents}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                            isEnrolled
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : formation.maxStudents && currentStudents >= formation.maxStudents
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-800 text-white hover:bg-red-900"
                          }`}
                        >
                          {isEnrolled ? "✓ Inscrit à la formation" : 
                           formation.maxStudents && currentStudents >= formation.maxStudents ? "Formation complète" : 
                           "S'inscrire maintenant"}
                        </button>
                      </>
                    ) : (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <PlayCircleIcon className="h-5 w-5 text-blue-600" />
                          <p className="text-blue-800 font-medium text-sm">Formation en cours</p>
                        </div>
                        <button className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Accéder au contenu
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600 font-medium">Formation terminée</p>
                  </div>
                )}
              </div>

              {/* Informations instructeur */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Instructeur</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {formation.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{formation.instructor}</p>
                    <p className="text-sm text-gray-600">Expert formateur</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.9/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations pratiques */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Support de cours inclus</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Certificat délivré</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookmarkIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Niveau {formation.level.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CurrencyEuroIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Paiement en 3x possible</span>
                  </div>
                </div>
              </div>

              {/* Actions secondaires */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                    Programme
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                    Contact
                  </button>
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