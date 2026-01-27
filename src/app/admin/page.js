'use client';

import { FaCalendarAlt, FaGraduationCap, FaBriefcase, FaUsers, FaChartBar, FaCog, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: FaChartBar, href: '/admin' },
    { id: 'events', label: 'Événements', icon: FaCalendarAlt, href: '/admin/events' },
    { id: 'formations', label: 'Formations', icon: FaGraduationCap, href: '/admin/formations' },
    { id: 'opportunities', label: 'Opportunités', icon: FaBriefcase, href: '/admin/opportunities' },
    { id: 'stories', label: 'Stories', icon: FaUsers, href: '/admin/stories' },
    { id: 'community', label: 'Communauté', icon: FaUsers, href: '/admin/community' },
    { id: 'donations', label: 'Donations', icon: FaHeart, href: '/admin/donations' },
    { id: 'settings', label: 'Paramètres', icon: FaCog, href: '/admin/settings' },
  ];

  const quickActions = [
    {
      title: 'Nouvel Événement',
      description: 'Créer un nouvel événement',
      href: '/admin/events/add',
      icon: FaCalendarAlt,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Nouvelle Formation',
      description: 'Ajouter une formation',
      href: '/admin/formations/add',
      icon: FaGraduationCap,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Nouvelle Opportunité',
      description: 'Publier une opportunité',
      href: '/admin/opportunities/add',
      icon: FaBriefcase,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Nouvelle Action',
      description: 'Créer une action de donation',
      href: '/admin/donations/add',
      icon: FaHeart,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Nouveau Story',
      description: 'Créer une histoire',
      href: '/admin/stories/add',
      icon: FaUsers,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Nouveau Post',
      description: 'Créer un post communauté',
      href: '/admin/community/add',
      icon: FaUsers,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const stats = [
    { label: 'Événements', value: '12', change: '+2 ce mois' },
    { label: 'Formations', value: '8', change: '+1 cette semaine' },
    { label: 'Opportunités', value: '15', change: '+5 ce mois' },
    { label: 'Actions Donation', value: '6', change: '+2 ce mois' },
    { label: 'Posts Communauté', value: '23', change: '+8 cette semaine' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Bonjour, Admin</span>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation rapide */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-white p-6 rounded-lg shadow-md transition-transform hover:scale-105`}
              >
                <div className="flex items-center mb-3">
                  <action.icon className="h-6 w-6 mr-3" />
                  <h3 className="font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu de navigation */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion du contenu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.slice(1, -1).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <item.icon className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">Gérer les {item.label.toLowerCase()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Nouvel événement &#34;Networking Alumni&#34; créé</span>
                <span className="text-xs text-gray-400 ml-auto">Il y a 2h</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Formation  &#34;React Advanced &#34; mise à jour</span>
                <span className="text-xs text-gray-400 ml-auto">Il y a 4h</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Nouvelle opportunité  &#34;Développeur Full Stack &#34; publiée</span>
                <span className="text-xs text-gray-400 ml-auto">Il y a 1j</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
