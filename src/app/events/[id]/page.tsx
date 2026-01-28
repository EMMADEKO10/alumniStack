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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
        <div className="pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Skeleton bouton retour */}
            <div className="h-6 w-40 bg-gray-200 rounded mb-8 animate-pulse"></div>

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
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
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
            Retour aux événements
          </button>

          {/* Hero Section avec image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-xl">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1536px) 100vw, 1536px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-red-400 via-orange-500 to-red-600 flex items-center justify-center">
                <CalendarIcon className="h-32 w-32 text-white opacity-50" />
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Contenu sur l'image */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-red-700 border-2 border-red-200">
                  <TagIcon className="h-4 w-4 mr-2" />
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
                {isEventPast && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100/90 backdrop-blur-sm text-gray-700 border-2 border-gray-300">
                    Événement passé
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="font-semibold">{dateInfo.weekday} {dateInfo.day} {dateInfo.month}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ClockIcon className="h-5 w-5" />
                  <span>{dateInfo.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MapPinIcon className="h-5 w-5" />
                  <span className="line-clamp-1">{event.location.split(',')[0]}</span>
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
                    <p className="font-semibold text-gray-900 text-sm mb-1">Date</p>
                    <p className="text-gray-700 text-sm">{dateInfo.fullDate}</p>
                    <p className="text-gray-600 text-sm">{dateInfo.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <MapPinIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Lieu</p>
                    <p className="text-gray-700 text-sm">{event.location}</p>
                  </div>
                </div>
                
                {event.organizer && (
                  <div className="flex items-start gap-4 p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Organisateur</p>
                      <p className="text-gray-700 font-medium">{event.organizer}</p>
                    </div>
                  </div>
                )}
                
                {event.maxParticipants && (
                  <div className="flex items-start gap-4 p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <UsersIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Participants</p>
                      <p className="text-gray-700 font-medium">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Statut et inscription */}
              <div className="mb-6">
                {!isEventPast ? (
                  <>
                    {availableSpots !== null && availableSpots > 0 ? (
                      <div className="mb-4 p-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">Places disponibles</span>
                          <span className="text-lg font-bold text-green-600">{availableSpots}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${((participantsCount) / (event.maxParticipants || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-center mt-2 font-medium text-gray-600">
                          {participantsCount} / {event.maxParticipants} participants
                        </p>
                      </div>
                    ) : availableSpots === 0 ? (
                      <div className="mb-4 p-4 bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-semibold text-center">Événement complet</p>
                      </div>
                    ) : null}
                    
                    <button
                      onClick={handleRegister}
                      disabled={availableSpots === 0}
                      className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        isRegistered
                          ? "bg-linear-to-r from-green-600 to-emerald-600 text-white"
                          : availableSpots === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-linear-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
                      }`}
                    >
                      {isRegistered ? "✓ Inscrit à l'événement" : availableSpots === 0 ? "Complet" : "S'inscrire maintenant"}
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                    <p className="text-gray-600 font-semibold text-center">Événement terminé</p>
                  </div>
                )}
              </div>

              {/* Informations pratiques */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Informations pratiques
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Durée estimée : 3-4 heures</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Langue : Français</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
                    <BookmarkIcon className="h-5 w-5 text-gray-500 shrink-0" />
                    <span className="text-gray-700">Gratuit pour les membres</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-600" />
                  Besoin d&apos;aide ?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pour toute question concernant cet événement, contactez l&apos;organisateur.
                </p>
                <button className="w-full py-3 px-4 border-2 border-red-300 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 transform hover:scale-105">
                  Contacter l&apos;organisateur
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

export default EventDetailPage; 
