'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UsersIcon, 
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  TagIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Contributor {
  _id: string;
  amount: number;
  createdAt: string;
  customerName: string;
  isMe: boolean;
}

interface Donation {
  _id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: string;
  priority?: string;
  location?: string;
  endDate?: string;
  donorCount?: number;
  contributors?: Contributor[];
}

export default function DonationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/donations/${id}`);
        if (!res.ok) throw new Error('Campagne non trouvée');
        const data = await res.json();
        setDonation(data);
      } catch {
        setError('Impossible de charger les détails de cette campagne.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDonation();
  }, [id, session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
          <p className="text-red-600 font-bold mb-4">{error || "Une erreur est survenue"}</p>
          <Link href="/donations" className="text-red-600 hover:underline font-semibold">
            Retour aux donations
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(Math.round((donation.currentAmount / donation.targetAmount) * 100), 100);
  const remainingAmount = Math.max(donation.targetAmount - donation.currentAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/donations" className="hover:text-red-600 transition-colors">Donations</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{donation.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header / Image Section */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-96 w-full">
                <Image 
                  src={donation.image || '/lau/felicitations_finalistes.jpg'} 
                  alt={donation.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                    donation.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {donation.isActive ? 'Active' : 'Terminée'}
                  </span>
                  {donation.category && (
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold uppercase tracking-wider shadow-sm">
                      {donation.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                  {donation.title}
                </h1>
                
                <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <MapPinIcon className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-gray-700">{donation.location || 'Leadership Academy'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <CalendarIcon className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-gray-700">Publié le {new Date(donation.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <TagIcon className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-gray-700">Priorité {donation.priority || 'Normale'}</span>
                  </div>
                </div>

                <div className="prose prose-red max-w-none text-gray-600 leading-relaxed text-lg">
                  {donation.description}
                </div>
              </div>
            </div>

            {/* Contributors Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <UsersIcon className="h-6 w-6 text-red-600" />
                  Contributeurs ({donation.contributors?.length || 0})
                </h2>
              </div>

              <div className="space-y-4">
                {donation.contributors && donation.contributors.length > 0 ? (
                  donation.contributors.map((contrib) => (
                    <div 
                      key={contrib._id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        contrib.isMe ? 'bg-red-50 border-red-200 ring-1 ring-red-200' : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          contrib.isMe ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {contrib.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-bold ${contrib.isMe ? 'text-red-900' : 'text-gray-900'}`}>
                            {contrib.customerName} {contrib.isMe && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full ml-2 uppercase">Moi</span>}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                            {new Date(contrib.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${contrib.isMe ? 'text-red-600' : 'text-gray-900'}`}>
                          +{contrib.amount}$
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Contribution validée</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Soyez le premier à contribuer !</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            
            {/* Donation Progress Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-28">
              <div className="mb-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-4xl font-black text-gray-900">{donation.currentAmount}$</span>
                    <span className="text-gray-400 ml-2 font-bold uppercase text-xs tracking-widest">Récoltés</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg">{progress}%</span>
                  </div>
                </div>
                
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-linear-to-r from-red-600 to-rose-500 rounded-full"
                  />
                </div>
                
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Objectif: {donation.targetAmount}$</span>
                  <span className="text-red-600">Restant: {remainingAmount}$</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-gray-900">{donation.donorCount || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Donateurs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-gray-900">{remainingAmount <= 0 ? 0 : Math.ceil(remainingAmount / 10)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dons de 10$ requis</p>
                </div>
              </div>

              {donation.isActive ? (
                <Link 
                  href={`/donations/${donation._id}/pay`}
                  className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-lg shadow-red-200 group"
                >
                  <HeartIcon className="h-6 w-6 fill-white group-hover:scale-110 transition-transform" />
                  FAIRE UN DON
                </Link>
              ) : (
                <div className="w-full bg-gray-100 text-gray-400 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 cursor-not-allowed">
                  CAMPAGNE TERMINÉE
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
              )}

              <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center leading-relaxed">
                Paiement sécurisé par Araka Pay.<br />Vos données sont chiffrées et protégées.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BanknotesIcon className="h-6 w-6 text-red-500" />
                Impact de votre don
              </h3>
              <ul className="space-y-4 text-gray-300 text-sm font-medium">
                <li className="flex gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0" />
                  <span>Soutien direct à l&apos;infrastructure universitaire</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0" />
                  <span>Amélioration des conditions d&apos;étude</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0" />
                  <span>Transparence totale sur l&apos;utilisation des fonds</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
