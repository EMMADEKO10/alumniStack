"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  BuildingOfficeIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  requirements?: string[];
  deadline: Date;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl: string;
  applicants?: unknown[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const OpportunityDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const opportunityId = params.id as string;
        
        // Si l'ID commence par "demo", utilise les données de démonstration
        if (opportunityId.startsWith("demo")) {
          const demoOpportunities: Opportunity[] = [
            {
              _id: "demo1",
              title: "Développeur Full Stack",
              description: "Rejoignez notre équipe en tant que développeur Full Stack et participez à la conception, au développement et à la maintenance de nos applications Web. Vous travaillerez avec des technologies modernes dans un environnement agile et collaboratif.\n\nResponsabilités principales :\n• Développement d'applications web avec React et Node.js\n• Conception et implémentation d'APIs REST\n• Collaboration avec l'équipe UX/UI pour l'intégration des designs\n• Maintenance et optimisation des performances\n• Participation aux revues de code et aux sessions de planification\n• Veille technologique et proposition d'améliorations\n\nCe poste offre une excellente opportunité de croissance professionnelle dans une entreprise innovante du secteur tech. Vous bénéficierez d'une formation continue et d'un environnement de travail stimulant avec des projets variés et challengeants.",
              company: "TechCorp",
              location: "Paris, France (Télétravail partiel possible)",
              type: "CDI",
              salary: "45 000 - 55 000 € brut/an",
              requirements: [
                "Master en informatique ou équivalent",
                "3+ années d'expérience en développement web",
                "Maîtrise de JavaScript, React, Node.js",
                "Connaissance des bases de données (SQL/NoSQL)",
                "Expérience avec Git et méthodologies Agile",
                "Anglais technique (lecture de documentation)",
                "Bon esprit d'équipe et capacité d'adaptation"
              ],
              deadline: new Date("2024-03-15"),
              contactEmail: "recrutement@techcorp.com",
              contactPhone: "+33 1 23 45 67 89",
              imageUrl: "/graduation.jpg",
              applicants: new Array(23).fill({}),
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Spécialiste en Marketing Digital",
              description: "Nous recherchons un spécialiste en marketing numérique pour élaborer et exécuter des stratégies de marketing en ligne innovantes pour nos clients. Vous serez responsable de la gestion complète des campagnes digitales et de l'analyse des performances.\n\nVos missions :\n• Élaboration de stratégies marketing digitales personnalisées\n• Gestion des campagnes publicitaires sur Google Ads et réseaux sociaux\n• Création et optimisation de contenu pour différentes plateformes\n• Analyse des performances et reporting détaillé\n• Veille concurrentielle et identification de nouvelles opportunités\n• Formation et accompagnement des équipes clients\n\nUn poste idéal pour quelqu'un de créatif, analytique et passionné par les dernières tendances du marketing digital. Vous évoluerez dans une agence dynamique avec des clients variés et des projets stimulants.",
              company: "DigitalAgency",
              location: "Lyon, France",
              type: "CDD",
              salary: "40 000 - 50 000 € brut/an",
              requirements: [
                "Formation en marketing digital ou communication",
                "2+ années d'expérience en marketing digital",
                "Maîtrise des outils Google (Analytics, Ads, Search Console)",
                "Connaissance des réseaux sociaux professionnels",
                "Compétences en SEO/SEA",
                "Créativité et sens de l'analyse",
                "Excellent relationnel client"
              ],
              deadline: new Date("2024-02-28"),
              contactEmail: "jobs@digitalagency.fr",
              contactPhone: "+33 4 56 78 90 12",
              imageUrl: "/graduation.jpg",
              applicants: new Array(15).fill({}),
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Consultant en Finance",
              description: "Poste de consultant junior en finance d'entreprise. Excellente opportunité pour débuter votre carrière dans le conseil financier au sein d'un cabinet reconnu. Vous accompagnerez nos clients dans leurs décisions stratégiques et financières.\n\nVos responsabilités :\n• Analyse financière des entreprises clientes\n• Préparation de business plans et modèles financiers\n• Assistance dans les opérations de fusion-acquisition\n• Évaluation d'entreprises et d'actifs\n• Présentation des résultats aux clients\n• Participation aux missions de due diligence\n\nCe stage peut déboucher sur une embauche en CDI selon les performances. Une formation complète sera dispensée et vous serez encadré par des consultants seniors expérimentés. Parfait pour acquérir une solide expérience en finance d'entreprise.",
              company: "Finance Conseil",
              location: "Marseille, France",
              type: "Stage",
              salary: "1 200 € / mois + tickets restaurant",
              requirements: [
                "Master 2 en finance ou école de commerce",
                "Stage précédent en banque ou finance",
                "Maîtrise d'Excel et outils financiers",
                "Connaissance des normes comptables",
                "Rigueur et capacité d'analyse",
                "Anglais courant",
                "Disponibilité 6 mois minimum"
              ],
              deadline: new Date("2024-04-10"),
              contactEmail: "stage@financeconseil.fr",
              contactPhone: "+33 4 91 23 45 67",
              imageUrl: "/graduation.jpg",
              applicants: new Array(8).fill({}),
              createdAt: new Date()
            },
            {
              _id: "demo4",
              title: "Développeur Frontend React",
              description: "Développeur frontend spécialisé en React pour créer des interfaces utilisateur modernes et responsive. Mission freelance pour un projet e-commerce innovant avec une équipe tech expérimentée.\n\nObjectifs de la mission :\n• Développement d'une nouvelle plateforme e-commerce\n• Intégration d'APIs REST et GraphQL\n• Optimisation des performances frontend\n• Implémentation de tests unitaires et d'intégration\n• Collaboration avec l'équipe UX/UI\n• Documentation technique\n\nMission de 6 mois renouvelable, avec possibilité d'extension selon l'avancement du projet. Environnement de travail flexible avec équipe dispersée en remote. Technologies utilisées : React, TypeScript, Next.js, Tailwind CSS.",
              company: "WebTech Solutions",
              location: "Toulouse, France (100% Remote)",
              type: "Freelance",
              salary: "400 - 600 € / jour TJM",
              requirements: [
                "5+ années d'expérience React",
                "Expertise TypeScript et Next.js",
                "Maîtrise des outils modernes (Webpack, Vite)",
                "Expérience avec les tests (Jest, Cypress)",
                "Connaissance des API REST et GraphQL",
                "Portfolio de réalisations récentes",
                "Statut freelance actif"
              ],
              deadline: new Date("2024-03-30"),
              contactEmail: "freelance@webtech.com",
              contactPhone: "+33 5 34 56 78 90",
              imageUrl: "/graduation.jpg",
              applicants: new Array(12).fill({}),
              createdAt: new Date()
            }
          ];
          
          const demoOpportunity = demoOpportunities.find(o => o._id === opportunityId);
          if (demoOpportunity) {
            setOpportunity(demoOpportunity);
          } else {
            setError("Opportunité non trouvée");
          }
        } else {
          const response = await fetch(`/api/opportunities/${opportunityId}`);
          if (!response.ok) {
            throw new Error("Opportunité non trouvée");
          }
          const data = await response.json();
          setOpportunity(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'opportunité:", err);
        setError("Impossible de charger les détails de l'opportunité");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOpportunity();
    }
  }, [params.id]);

  const formatDeadline = (deadline: Date) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      formatted: date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      daysLeft: diffDays,
      isExpired: diffDays < 0
    };
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cdi':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cdd':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'freelance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApply = () => {
    setHasApplied(!hasApplied);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cette opportunité : ${opportunity?.title} chez ${opportunity?.company}`;
    
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
                  </div>
                </div>
              </div>

              {/* Skeleton sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-14 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="space-y-3">
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

  if (error || !opportunity) {
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

  const deadlineInfo = formatDeadline(opportunity.deadline);
  const applicantsCount = opportunity.applicants?.length || 0;

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
            Retour aux opportunités
          </button>

          {/* Hero Section avec image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-xl">
            {opportunity.imageUrl ? (
              <Image
                src={opportunity.imageUrl}
                alt={opportunity.title}
                fill
                className="object-cover"
                sizes="(max-width: 1536px) 100vw, 1536px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-red-500 via-rose-500 to-red-600 flex items-center justify-center">
                <BriefcaseIcon className="h-32 w-32 text-white opacity-50" />
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Contenu sur l'image */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 backdrop-blur-sm ${getTypeColor(opportunity.type)} bg-white/90`}>
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  {opportunity.type}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {opportunity.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  <span className="font-semibold text-lg">{opportunity.company}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <UserGroupIcon className="h-5 w-5" />
                  <span>{applicantsCount} candidat{applicantsCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="absolute top-6 right-6 flex gap-3">
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
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Localisation</p>
                    <p className="text-gray-700">{opportunity.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Rémunération</p>
                    <p className="text-gray-700">{opportunity.salary || 'Non spécifié'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Date limite</p>
                    <p className={`text-sm font-medium ${deadlineInfo.isExpired ? 'text-red-600' : 'text-gray-700'}`}>
                      {deadlineInfo.formatted}
                    </p>
                    {!deadlineInfo.isExpired && (
                      <span className="inline-block mt-1 px-2 py-1 bg-white rounded text-xs font-semibold text-purple-600">
                        {deadlineInfo.daysLeft} jour{deadlineInfo.daysLeft !== 1 ? 's' : ''} restant{deadlineInfo.daysLeft !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <UserGroupIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Candidatures</p>
                    <p className="text-gray-700 font-medium">{applicantsCount} candidat{applicantsCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
                <div className="prose max-w-none">
                  {opportunity.description.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Exigences */}
              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil recherché</h2>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Statut et candidature */}
              <div className="mb-6">
                {!deadlineInfo.isExpired ? (
                  <>
                    <div className="mb-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        <p className="text-green-800 font-semibold">Candidatures ouvertes</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleApply}
                      className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        hasApplied
                          ? "bg-linear-to-r from-green-600 to-emerald-600 text-white"
                          : "bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
                      }`}
                    >
                      {hasApplied ? "✓ Candidature envoyée" : "Postuler maintenant"}
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                      <p className="text-red-800 font-semibold">Date limite dépassée</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              {(opportunity.contactEmail || opportunity.contactPhone) && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <EnvelopeIcon className="h-5 w-5 text-red-600" />
                    Contact recruteur
                  </h3>
                  <div className="space-y-3">
                    {opportunity.contactEmail && (
                      <a 
                        href={`mailto:${opportunity.contactEmail}`}
                        className="flex items-center gap-3 p-3 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
                      >
                        <EnvelopeIcon className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-blue-700 font-medium group-hover:underline">
                          {opportunity.contactEmail}
                        </span>
                      </a>
                    )}
                    {opportunity.contactPhone && (
                      <a 
                        href={`tel:${opportunity.contactPhone}`}
                        className="flex items-center gap-3 p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group"
                      >
                        <PhoneIcon className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-green-700 font-medium group-hover:underline">
                          {opportunity.contactPhone}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  Informations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">CV et lettre de motivation requis</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Réponse sous 1-2 semaines</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                    <BookmarkIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Référence: <span className="font-mono font-semibold">{opportunity._id.substring(0, 8)}</span></span>
                  </div>
                </div>
              </div>

              {/* Actions secondaires */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105">
                    Signaler
                  </button>
                  <button className="py-3 px-4 border-2 border-red-300 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 transform hover:scale-105">
                    Similaires
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

export default OpportunityDetailPage; 
