"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../../components/cards/EventCard";
import { CalendarIcon, MapPinIcon, UsersIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
              organizer: "Université de Kinshasa",
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
            organizer: "Université de Kinshasa",
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
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement des événements...</span>
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
    <div className="max-w-7xl mx-auto px-4 pt-16 pb-16">
      {/* Description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          Pour plus d&apos;informations sur un événement Club ou SIG particulier,
          veuillez contacter directement le Club ou le SIG. Pour les événements
          exclusifs de réunion du Collège, veuillez visiter la page de votre
          classe et les membres de la Crimson Society, veuillez visiter la page
          d&apos;accueil de la Crimson Society.
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap gap-3">
            {/* Filtre par type */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="title">Trier par titre</option>
              <option value="location">Trier par lieu</option>
              <option value="type">Trier par type</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{filteredEvents.length}</p>
              <p className="text-gray-600">Événements trouvés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MapPinIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(filteredEvents.map(e => e.location).filter(Boolean))].length}
              </p>
              <p className="text-gray-600">Lieux différents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {getEventTypes().length}
              </p>
              <p className="text-gray-600">Types d&apos;événements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des événements */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Aucun événement trouvé
          </h3>
          <p className="mt-1 text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtrage.
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
              <div key={event._id} className={`${
                viewMode === "grid" 
                  ? "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200" 
                  : "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              }`}>
                {viewMode === "grid" ? (
                  <div className="overflow-hidden">
                    {/* Image d'en-tête */}
                    <div className="relative h-48 w-full">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          unoptimized={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <CalendarIcon className="h-16 w-16 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <div className="bg-blue-600 text-white rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium uppercase">{dateInfo.month}</p>
                          <p className="text-2xl font-bold">{dateInfo.day}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                            {event.type}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {event.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{dateInfo.time}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-2" />
                            <span>{event.participants?.length || 0}/{event.maxParticipants} participants</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => router.push(`/events/${event._id}`)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <EventCard
                      event={event.title}
                      place={event.location}
                      day={dateInfo.day}
                      month={dateInfo.month}
                      category={event.type}
                      time={dateInfo.time}
                      imageUrl={event.imageUrl}
                    />
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