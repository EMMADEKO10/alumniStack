'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight, FaUsers, FaTicketAlt } from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  price: string;
  featured: boolean;
  image: string;
}

const Events: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "Networking Tech & Innovation",
      description: "Rencontrez les leaders technologiques de notre réseau et découvrez les dernières innovations du secteur.",
      date: "2024-02-15",
      time: "18:30 - 22:00",
      location: "Campus Unikin - Amphithéâtre A",
      category: "Networking",
      attendees: 127,
      maxAttendees: 200,
      price: "Gratuit",
      featured: true,
      image: "/graduation.jpg"
    },
    {
      id: 2,
      title: "Salon de l'Emploi Alumni",
              description: "Plus de 50 entreprises présentes pour recruter des profils Unikin. CV drive, entretiens express et conférences.",
      date: "2024-02-22",
      time: "09:00 - 17:00",
      location: "Centre de Congrès Downtown",
      category: "Carrière",
      attendees: 89,
      maxAttendees: 500,
      price: "Gratuit",
      featured: true,
      image: "/graduation.jpg"
    },
    {
      id: 3,
      title: "Conférence Entrepreneuriat",
      description: "Table ronde avec 5 entrepreneurs alumni qui ont levé plus de 10M€. Retours d'expérience et conseils pratiques.",
      date: "2024-03-05",
      time: "14:00 - 18:00",
              location: "Unikin Innovation Hub",
      category: "Entrepreneuriat",
      attendees: 156,
      maxAttendees: 150,
      price: "25€",
      featured: false,
      image: "/graduation.jpg"
    },
    {
      id: 4,
      title: "Alumni Afterwork Paris",
      description: "Retrouvailles informelles autour d'un verre dans un cadre convivial. Occasion parfaite pour élargir son réseau.",
      date: "2024-03-12",
      time: "19:00 - 23:00",
      location: "Rooftop Montparnasse",
      category: "Social",
      attendees: 67,
      maxAttendees: 100,
      price: "20€",
      featured: false,
      image: "/graduation.jpg"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Networking": "from-blue-500 to-blue-600",
      "Carrière": "from-green-500 to-green-600", 
      "Entrepreneuriat": "from-purple-500 to-purple-600",
      "Social": "from-orange-500 to-orange-600"
    };
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      year: date.getFullYear()
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <FaCalendarAlt className="mr-2" />
            Événements à venir
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Rejoignez nos
            <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              événements exclusifs
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participez aux événements networking, conférences et retrouvailles 
            organisés spécialement pour notre communauté alumni.
          </p>
        </motion.div>

        {/* Featured Events */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {events.filter(event => event.featured).map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full">
                  ⭐ Événement Phare
                </span>
              </div>

              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} rounded-full text-sm font-medium`}>
                    {event.category}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    {formatDate(event.date).day} {formatDate(event.date).month} {formatDate(event.date).year}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaClock className="mr-2 text-red-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {event.location}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-gray-400" />
                    {event.attendees}/{event.maxAttendees} participants
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {event.price}
                  </div>
                </div>

                {/* CTA */}
                <Link 
                  href={`/events/${event.id}`}
                  className="group inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  <FaTicketAlt className="mr-2" />
                  S&apos;inscrire maintenant
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other Events */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {events.filter(event => !event.featured).map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white rounded-full text-sm font-medium mb-3`}>
                      {event.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <div className="text-center bg-red-50 rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold text-red-600">
                      {formatDate(event.date).day}
                    </div>
                    <div className="text-xs text-red-500 uppercase">
                      {formatDate(event.date).month}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaClock className="mr-2 text-red-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {event.attendees}/{event.maxAttendees} participants
                  </div>
                  <div className="font-bold text-red-600">
                    {event.price}
                  </div>
                </div>

                <Link 
                  href={`/events/${event.id}`}
                  className="mt-4 group inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                  En savoir plus
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            Voir tous les événements
            <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events; 