'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight, FaUsers, FaTicketAlt } from "react-icons/fa";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  organizer?: string;
  imageUrl?: string;
  maxParticipants?: number | null;
  participants?: unknown[];
  createdAt?: string;
}

const placeholderImages = [
  "/lau/hiro_leadership_academy.jpg",
  "/lau/hiro-auditoire.jpg",
  "/graduation.jpg",
];

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Impossible de charger les événements pour le moment.");
        }
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((event) => !Number.isNaN(new Date(event.date).getTime()));
  }, [events]);

  const spotlightEvent = upcomingEvents[0];
  const secondaryEvents = upcomingEvents.slice(1, 4);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDayBadge = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
    };
  };

  const getRandomPlaceholder = (index: number) =>
    placeholderImages[index % placeholderImages.length];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="py-8 sm:py-10 bg-linear-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-red-50/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-linear-to-tr from-slate-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-100 to-pink-100 rounded-full mb-4 sm:mb-6">
            <FaCalendarAlt className="text-red-600" />
            <span className="text-[10px] sm:text-xs font-semibold text-red-600 uppercase tracking-wider">Programme</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 mb-3 sm:mb-4 font-black leading-tight px-2">
            Explorez les prochains <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent italic">rendez-vous</span> de la communauté
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
            Des conférences inspirantes, des ateliers pratiques et des moments de networking exclusifs pour les alumni LAU.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="animate-pulse rounded-2xl bg-white/70 shadow-sm p-6 border border-slate-100"
              >
                <div className="h-40 w-full rounded-xl bg-slate-200 mb-5" />
                <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
                <div className="h-6 w-1/2 bg-slate-200 rounded mb-6" />
                <div className="h-10 w-full bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto text-center bg-white border border-red-100 text-red-600 rounded-2xl px-6 py-10 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Oups…</h3>
            <p>{error}</p>
            <p className="text-sm text-red-500 mt-3">
              Réessayez dans quelques instants ou contactez l&apos;équipe si le problème persiste.
            </p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center bg-white border border-slate-100 rounded-2xl px-6 py-12 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun événement planifié pour le moment</h3>
            <p className="text-slate-600">
              Restez à l&apos;écoute, de nouveaux événements seront bientôt disponibles.
            </p>
          </div>
        ) : (
          <>
            {spotlightEvent && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-10 md:mb-14"
              >
                <div className="absolute inset-0 opacity-50">
                  <Image
                    src={spotlightEvent.imageUrl || getRandomPlaceholder(0)}
                    alt={spotlightEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
                <div className="relative px-4 py-8 sm:px-10 sm:py-12 lg:px-14">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="flex flex-row sm:flex-col items-center justify-center rounded-2xl bg-white/15 px-4 py-2 sm:px-5 sm:py-4 text-center gap-2 sm:gap-0 min-w-20">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70">
                          {formatDayBadge(spotlightEvent.date).month}
                        </span>
                        <span className="text-xl sm:text-3xl font-bold">
                          {formatDayBadge(spotlightEvent.date).day}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs font-semibold mb-3 uppercase tracking-wide">
                          {spotlightEvent.type}
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white mb-3">
                          {spotlightEvent.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none">
                          {spotlightEvent.description}
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
                          <span className="inline-flex items-center">
                            <FaCalendarAlt className="mr-2 text-red-300" />
                            {formatDate(spotlightEvent.date)}
                          </span>
                          <span className="inline-flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-red-300" />
                            {spotlightEvent.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 min-w-48 pt-4 sm:pt-0 border-t border-white/10 sm:border-t-0">
                      {spotlightEvent.maxParticipants && (
                        <div className="rounded-xl bg-white/10 px-4 py-3 text-xs sm:text-sm text-white/80 border border-white/10">
                          <div className="font-semibold text-white">
                            {spotlightEvent.maxParticipants} places disponibles
                          </div>
                          <div className="text-[10px] sm:text-xs opacity-80">
                            {spotlightEvent.participants
                              ? `${spotlightEvent.participants?.length} inscrits`
                              : "Ouvert aux inscriptions"}
                          </div>
                        </div>
                      )}
                      <Link
                        href={`/events/${spotlightEvent._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 font-bold py-3 sm:py-3.5 px-6 hover:bg-slate-100 transition-colors shadow-lg active:scale-95"
                      >
                        <FaTicketAlt className="text-red-600" />
                        <span className="text-sm">Découvrir l&apos;événement</span>
                        <FaArrowRight className="text-xs ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {secondaryEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-none border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={event.imageUrl || getRandomPlaceholder(index + 1)}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs font-semibold uppercase tracking-wide text-slate-900">
                        {event.type}
                      </span>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-white/90 px-3 py-2 text-slate-900 text-xs font-semibold uppercase">
                        <span>{formatDayBadge(event.date).day}</span>
                        <span>{formatDayBadge(event.date).month}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="typography-card-title text-slate-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="typography-small text-slate-600 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-4">
                      <span className="inline-flex items-center">
                        <FaClock className="mr-2 text-red-500/80" />
                        {formatDate(event.date)}
                      </span>
                      <span className="inline-flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-500/80" />
                        {event.location}
                      </span>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <FaUsers className="text-red-400" />
                          Capacité
                        </span>
                        <span className="font-semibold text-slate-900">
                          {event.participants?.length || 0}/{event.maxParticipants}
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      En savoir plus
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-none font-bold typography-body hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span>Voir tous les événements</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
