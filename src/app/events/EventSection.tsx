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

        {/* Skeleton pour statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
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
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-gray-300"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap gap-3">
            {/* Filtre par type */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-medium hover:border-gray-300 transition-all"
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
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-medium hover:border-gray-300 transition-all"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="location">Lieu</option>
              <option value="type">Type</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
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

      {/* Statistiques compactes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100 p-4 flex items-center gap-3">
          <div className="bg-red-100 rounded-lg p-2">
            <CalendarIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{filteredEvents.length}</p>
            <p className="text-xs text-gray-600">Événements</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-4 flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <MapPinIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(filteredEvents.map(e => e.location).filter(Boolean))].length}
            </p>
            <p className="text-xs text-gray-600">Lieux</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4 flex items-center gap-3">
          <div className="bg-purple-100 rounded-lg p-2">
            <TagIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {getEventTypes().length}
            </p>
            <p className="text-xs text-gray-600">Types</p>
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Aucun événement trouvé
          </h3>
          <p className="mt-2 text-gray-500 text-sm">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }`}>
          {filteredEvents.map((event) => {
            const dateInfo = formatDate(event.date);
            return (
              <div 
                key={event._id}
                onClick={() => router.push(`/events/${event._id}`)}
                className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-red-300 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Image d'en-tête avec overlay */}
                    <div className="relative h-56 w-full overflow-hidden">
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
                        <div className="w-full h-full bg-gradient-to-br from-red-100 via-orange-50 to-red-50 flex items-center justify-center group-hover:from-red-200 transition-colors duration-300">
                          <CalendarIcon className="h-20 w-20 text-red-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Date badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-red-600 text-white rounded-xl p-2.5 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <p className="text-xs font-semibold uppercase tracking-wider">{dateInfo.month}</p>
                          <p className="text-xl font-bold leading-tight">{dateInfo.day}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col">
                      {/* Badge type */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <TagIcon className="h-3 w-3" />
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>

                      {/* Titre et description */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Infos */}
                      <div className="space-y-2.5 mb-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-gray-700 text-sm gap-3">
                          <MapPinIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm gap-3">
                          <ClockIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span>{dateInfo.time}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center text-gray-700 text-sm gap-3">
                            <UsersIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span>{event.participants?.length || 0}/{event.maxParticipants}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event._id}`);
                        }}
                        className="relative z-10 w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl"
                      >
                        Voir plus
                        <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 flex gap-6 flex-1">
                    <div className="relative h-40 w-40 flex-shrink-0 rounded-xl overflow-hidden">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="160px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-50 flex items-center justify-center">
                          <CalendarIcon className="h-12 w-12 text-red-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
                          <TagIcon className="h-3 w-3" />
                          {event.type}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4 text-red-600" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4 text-red-600" />
                            {dateInfo.time}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event._id}`);
                        }}
                        className="relative z-10 self-start mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        Voir plus
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