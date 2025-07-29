"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  UserIcon,
  TagIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  organizer?: string;
  imageUrl?: string;
  maxParticipants?: number;
  participants?: unknown[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const EventDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventId = params.id as string;
        
        // Si l'ID commence par "demo", utilise les données de démonstration
        if (eventId.startsWith("demo")) {
          const demoEvents: Event[] = [
            {
              _id: "demo1",
              title: "Conférence sur l'Innovation",
              description: "Une conférence passionnante sur les dernières innovations technologiques et leur impact sur le monde des affaires. Cette événement rassemblera des experts internationaux, des entrepreneurs visionnaires et des leaders d'opinion pour explorer les tendances émergentes qui façonnent notre avenir numérique.\n\nAu programme :\n• Keynotes inspirantes de leaders technologiques\n• Tables rondes sur l'intelligence artificielle et l'automatisation\n• Ateliers pratiques sur les nouvelles technologies\n• Sessions de networking avec des professionnels du secteur\n• Présentation de startups innovantes\n\nUn événement incontournable pour tous ceux qui souhaitent rester à la pointe de l'innovation et développer leur réseau professionnel dans un environnement stimulant.",
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              location: "Centre de Conférences Paris La Défense, 2 Place de la Défense, 92400 Courbevoie",
              type: "conférence",
              organizer: "Leadership Academy",
              imageUrl: "/graduation.jpg",
              maxParticipants: 150,
              participants: new Array(87).fill({}),
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Networking Alumni",
              description: "Rencontrez d'autres anciens élèves et développez votre réseau professionnel dans une ambiance conviviale et détendue. Cette soirée networking est l'occasion parfaite de renouer avec d'anciens camarades, de partager vos expériences professionnelles et de créer de nouvelles opportunités d'affaires.\n\nCe qui vous attend :\n• Cocktail d'accueil avec vue panoramique sur la ville\n• Présentations courtes des participants sur leurs projets actuels\n• Speed networking organisé par secteurs d'activité\n• Buffet gastronomique avec spécialités locales\n• Remise des prix aux alumni de l'année\n• Photobooth souvenir\n\nVenez découvrir comment vos anciens camarades ont évolué dans leur carrière et partagez vos propres réussites dans un cadre élégant et professionnel.",
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              location: "Hôtel Marriott Lyon Cité Internationale, 70 Quai Charles de Gaulle, 69006 Lyon",
              type: "networking",
              organizer: "Club Alumni",
              imageUrl: "/graduation.jpg",
              maxParticipants: 80,
              participants: new Array(45).fill({}),
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Atelier de Développement Personnel",
              description: "Un atelier interactif pour améliorer vos compétences en leadership et communication. Animé par des coaches professionnels certifiés, cet atelier vous donnera les outils pratiques pour développer votre potentiel et atteindre vos objectifs personnels et professionnels.\n\nProgramme détaillé :\n• Assessment personnel des compétences de leadership\n• Techniques de communication persuasive et empathique\n• Gestion du stress et des émotions en situation difficile\n• Méthodes de prise de décision stratégique\n• Exercices pratiques en groupe et mises en situation\n• Plan d'action personnel pour continuer votre développement\n\nCet atelier s'adresse à tous ceux qui souhaitent renforcer leur leadership, améliorer leurs relations professionnelles et personnelles, et développer une communication plus efficace dans tous les contextes.",
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
              location: "Centre de Formation Marseille Innovation, 25 Rue de la République, 13001 Marseille",
              type: "workshop",
              organizer: "Formation Academy",
              imageUrl: "/graduation.jpg",
              maxParticipants: 50,
              participants: new Array(28).fill({}),
              createdAt: new Date()
            }
          ];
          
          const demoEvent = demoEvents.find(e => e._id === eventId);
          if (demoEvent) {
            setEvent(demoEvent);
          } else {
            setError("Événement non trouvé");
          }
        } else {
          const response = await fetch(`/api/events/${eventId}`);
          if (!response.ok) {
            throw new Error("Événement non trouvé");
          }
          const data = await response.json();
          setEvent(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'événement:", err);
        setError("Impossible de charger les détails de l'événement");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "long" }),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString("fr-FR", { weekday: "long" }),
      time: date.toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
      fullDate: date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
  };

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cet événement : ${event?.title}`;
    
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
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des détails...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
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

  const dateInfo = formatDate(event.date);
  const isEventPast = new Date(event.date) < new Date();
  const participantsCount = event.participants?.length || 0;
  const availableSpots = event.maxParticipants ? event.maxParticipants - participantsCount : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* Bouton de retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux événements
        </button>

        {/* Image principale */}
        <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <CalendarIcon className="h-24 w-24 text-white opacity-80" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <p className="text-sm font-medium text-gray-600 uppercase">{dateInfo.month}</p>
              <p className="text-3xl font-bold text-gray-900">{dateInfo.day}</p>
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
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <TagIcon className="h-4 w-4 mr-1" />
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  {isEventPast && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Événement passé
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{dateInfo.fullDate}</p>
                    <p className="text-gray-600">{dateInfo.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Lieu</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Organisateur</p>
                      <p className="text-gray-600">{event.organizer}</p>
                    </div>
                  </div>
                )}
                {event.maxParticipants && (
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Participants</p>
                      <p className="text-gray-600">
                        {participantsCount} / {event.maxParticipants} inscrits
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos de cet événement</h2>
                <div className="prose max-w-none">
                  {event.description.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Statut et inscription */}
              <div className="mb-6">
                {!isEventPast ? (
                  <>
                    {availableSpots !== null && availableSpots > 0 ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Places disponibles</span>
                          <span className="text-sm font-bold text-green-600">{availableSpots}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${((participantsCount) / (event.maxParticipants || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : availableSpots === 0 ? (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 font-medium text-sm">Événement complet</p>
                      </div>
                    ) : null}
                    
                    <button
                      onClick={handleRegister}
                      disabled={availableSpots === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        isRegistered
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : availableSpots === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isRegistered ? "✓ Inscrit" : availableSpots === 0 ? "Complet" : "S'inscrire"}
                    </button>
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600 font-medium">Événement terminé</p>
                  </div>
                )}
              </div>

              {/* Informations pratiques */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Durée estimée : 3-4 heures</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Langue : Français</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookmarkIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Gratuit pour les membres</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Pour toute question concernant cet événement, contactez l'organisateur.
                </p>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Contacter l'organisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 