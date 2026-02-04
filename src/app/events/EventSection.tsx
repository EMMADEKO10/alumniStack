"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import EventCard from "../../components/cards/EventCard";
import { CalendarIcon, MapPinIcon, UsersIcon, FunnelIcon, MagnifyingGlassIcon, ClockIcon, TagIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

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

const EventSection: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Récupération des événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          // Si l'API échoue, utiliser des données de démonstration
          console.warn("API non disponible, utilisation des données de démonstration");
          const demoData: Event[] = [
            {
              _id: "demo1",
              title: "Conférence sur l'Innovation",
              description: "Une conférence passionnante sur les dernières innovations technologiques et leur impact sur le monde des affaires.",
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
              location: "Paris, France",
              type: "conférence",
              organizer: "Leadership Academy",
              imageUrl: "/graduation.jpg",
              maxParticipants: 150,
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Networking Alumni",
              description: "Rencontrez d'autres anciens élèves et développez votre réseau professionnel.",
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 jours
              location: "Lyon, France",
              type: "networking",
              organizer: "Club Alumni",
              imageUrl: "/graduation.jpg",
              maxParticipants: 80,
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Atelier de Développement Personnel",
              description: "Un atelier interactif pour améliorer vos compétences en leadership et communication.",
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 jours
              location: "Marseille, France",
              type: "workshop",
              organizer: "Formation Academy",
              imageUrl: "/graduation.jpg",
              maxParticipants: 50,
              createdAt: new Date()
            }
          ];
          setEvents(demoData);
          setFilteredEvents(demoData);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setEvents(data || []);
        setFilteredEvents(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des événements:", err);
        // En cas d'erreur, utiliser des données de démonstration
        const demoData: Event[] = [
          {
            _id: "demo1",
            title: "Conférence sur l'Innovation",
            description: "Une conférence passionnante sur les dernières innovations technologiques et leur impact sur le monde des affaires.",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Paris, France",
            type: "conférence",
            organizer: "Leadership Academy",
            imageUrl: "/graduation.jpg",
            maxParticipants: 150,
            createdAt: new Date()
          },
          {
            _id: "demo2",
            title: "Networking Alumni",
            description: "Rencontrez d'autres anciens élèves et développez votre réseau professionnel.",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Lyon, France",
            type: "networking",
            organizer: "Club Alumni",
            imageUrl: "/graduation.jpg",
            maxParticipants: 80,
            createdAt: new Date()
          },
          {
            _id: "demo3",
            title: "Atelier de Développement Personnel",
            description: "Un atelier interactif pour améliorer vos compétences en leadership et communication.",
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Marseille, France",
            type: "workshop",
            organizer: "Formation Academy",
            imageUrl: "/graduation.jpg",
            maxParticipants: 50,
            createdAt: new Date()
          }
        ];
        setEvents(demoData);
        setFilteredEvents(demoData);
        setError(null); // Pas d'erreur si on utilise les données de démo
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrage et tri des événements
  useEffect(() => {
    let filtered = [...events];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par type
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title":
          return a.title?.localeCompare(b.title) || 0;
        case "location":
          return a.location?.localeCompare(b.location) || 0;
        case "type":
          return a.type?.localeCompare(b.type) || 0;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, sortBy, filterType]);

  const getEventTypes = () => {
    const types = [...new Set(events.map((event) => event.type).filter(Boolean))];
    return types;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "long" }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    };
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

        {/* Skeleton pour cartes d'événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 w-20 bg-gray-200 rounded-full mb-3"></div>
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
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Erreur : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-10">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-gray-300 text-sm sm:text-base sm:pl-12 sm:py-3"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto justify-start">
            {/* Filtre par type */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FunnelIcon className="h-5 w-5 text-gray-600 hidden sm:block" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs sm:text-sm font-medium hover:border-gray-300 transition-all bg-white"
              >
                <option value="all">Tous les types</option>
                {getEventTypes().map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs sm:text-sm font-medium hover:border-gray-300 transition-all bg-white"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="location">Lieu</option>
              <option value="type">Type</option>
            </select>

            {/* Mode d'affichage */}
            <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Aucun événement trouvé
          </h3>
          <p className="mt-2 text-gray-500 text-xs sm:text-sm px-4">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" 
            : "space-y-4"
        }`}>
          {filteredEvents.map((event) => {
            const dateInfo = formatDate(event.date);
            return (
              <div 
                key={event._id}
                onClick={() => router.push(`/events/${event._id}`)}
                className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full ${
                  viewMode === "list" ? "sm:flex-row" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Image d'en-tête avec overlay */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          unoptimized={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-red-100 via-orange-50 to-red-50 flex items-center justify-center group-hover:from-red-200 transition-colors duration-300">
                          <CalendarIcon className="h-16 w-16 sm:h-20 sm:w-20 text-red-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Date badge */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="bg-red-600 text-white rounded-xl p-2 sm:p-2.5 shadow-lg transform group-hover:scale-110 transition-transform duration-300 min-w-14 text-center">
                          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{dateInfo.month.substring(0, 3)}</p>
                          <p className="text-lg sm:text-xl font-bold leading-tight">{dateInfo.day}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      {/* Badge type */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <TagIcon className="h-3 w-3" />
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>

                      {/* Titre et description */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Infos */}
                      <div className="mt-auto">
                        <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center text-gray-700 text-xs sm:text-sm gap-2">
                            <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-700 text-xs sm:text-sm gap-2">
                              <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                              <span>{dateInfo.time}</span>
                            </div>
                            {event.maxParticipants && (
                              <div className="flex items-center text-gray-700 text-xs sm:text-sm gap-2">
                                <UsersIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                                <span>{event.participants?.length || 0}/{event.maxParticipants}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/events/${event._id}`);
                          }}
                          className="relative z-10 w-full bg-red-600 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-xl text-sm"
                        >
                          En savoir plus
                          <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                    <div className="relative h-32 w-full sm:h-40 sm:w-40 shrink-0 rounded-xl overflow-hidden">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 160px"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-red-100 to-orange-50 flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
                          <TagIcon className="h-3 w-3" />
                          {event.type}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                            {dateInfo.time}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event._id}`);
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

export default EventSection;
