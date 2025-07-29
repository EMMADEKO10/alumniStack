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
import { HeartIcon } from "@heroicons/react/24/solid";

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
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        {/* Bouton de retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-red-800 hover:text-red-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux opportunités
        </button>

        {/* Image principale */}
        <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          {opportunity.imageUrl ? (
            <Image
              src={opportunity.imageUrl}
              alt={opportunity.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <BriefcaseIcon className="h-24 w-24 text-white opacity-80" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-6 left-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(opportunity.type)}`}>
              {opportunity.type}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-xl text-red-800 font-semibold">{opportunity.company}</span>
                </div>
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Localisation</p>
                    <p className="text-gray-600">{opportunity.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Rémunération</p>
                    <p className="text-gray-600">{opportunity.salary || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Date limite</p>
                    <p className={`text-sm ${deadlineInfo.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                      {deadlineInfo.formatted}
                      {!deadlineInfo.isExpired && (
                        <span className="block text-xs text-gray-500">
                          ({deadlineInfo.daysLeft} jour{deadlineInfo.daysLeft !== 1 ? 's' : ''} restant{deadlineInfo.daysLeft !== 1 ? 's' : ''})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserGroupIcon className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Candidatures</p>
                    <p className="text-gray-600">{applicantsCount} candidat{applicantsCount !== 1 ? 's' : ''}</p>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Statut et candidature */}
              <div className="mb-6">
                {!deadlineInfo.isExpired ? (
                  <>
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <p className="text-green-800 font-medium text-sm">Candidatures ouvertes</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleApply}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        hasApplied
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-800 text-white hover:bg-red-900"
                      }`}
                    >
                      {hasApplied ? "✓ Candidature envoyée" : "Postuler maintenant"}
                    </button>
                  </>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                      <p className="text-red-800 font-medium text-sm">Date limite dépassée</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              {(opportunity.contactEmail || opportunity.contactPhone) && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact recruteur</h3>
                  <div className="space-y-3">
                    {opportunity.contactEmail && (
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        <a 
                          href={`mailto:${opportunity.contactEmail}`}
                          className="text-sm text-red-800 hover:text-red-900 underline"
                        >
                          {opportunity.contactEmail}
                        </a>
                      </div>
                    )}
                    {opportunity.contactPhone && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <a 
                          href={`tel:${opportunity.contactPhone}`}
                          className="text-sm text-red-800 hover:text-red-900 underline"
                        >
                          {opportunity.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">CV et lettre de motivation requis</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Réponse sous 1-2 semaines</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookmarkIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Offre référence: {opportunity._id.substring(0, 8)}</span>
                  </div>
                </div>
              </div>

              {/* Actions secondaires */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                    Signaler
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                    Similaires
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

export default OpportunityDetailPage; 