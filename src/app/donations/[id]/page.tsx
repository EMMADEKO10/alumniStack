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
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-8">
          <Link href="/donations" className="hover:text-red-600 transition-colors">Donations</Link>
          <span className="text-gray-300">/</span>
          <span className="truncate max-w-50 sm:max-w-md">{donation.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header / Image Section */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <div className="relative h-72 sm:h-96 w-full">
                <Image 
                  src={donation.image || '/lau/felicitations_finalistes.jpg'} 
                  alt={donation.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg ${
                    donation.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {donation.isActive ? 'Active' : 'Terminée'}
                  </span>
                  {donation.category && (
                    <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold shadow-lg border border-gray-100">
                      {donation.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 sm:p-10">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  {donation.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                    <MapPinIcon className="h-4 w-4 text-red-600" />
                    <span className="text-[10px] font-bold text-gray-900">{donation.location || 'Leadership Academy'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                    <CalendarIcon className="h-4 w-4 text-red-600" />
                    <span className="text-[10px] font-bold text-gray-900">Publié le {new Date(donation.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                    <TagIcon className="h-4 w-4 text-red-600" />
                    <span className="text-[10px] font-bold text-gray-900">Priorité {donation.priority || 'Normale'}</span>
                  </div>
                </div>

                <div className="prose prose-red max-w-none text-black leading-relaxed text-sm sm:text-base font-normal text-justify">
                  {donation.description}
                </div>
              </div>
            </div>

            {/* Contributors Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-red-600" />
                    </div>
                    Contributeurs ({donation.contributors?.length || 0})
                  </h2>
                </div>

                <div className="space-y-4">
                  {donation.contributors && donation.contributors.length > 0 ? (
                    donation.contributors.map((contrib) => (
                      <div 
                        key={contrib._id} 
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                          contrib.isMe ? 'bg-red-50 border-red-600 ring-4 ring-red-100' : 'bg-gray-50 border-transparent hover:border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg transition-transform hover:scale-105 ${
                            contrib.isMe ? 'bg-red-600 text-white' : 'bg-white text-gray-400 border border-gray-100'
                          }`}>
                            {contrib.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-semibold tracking-tight text-base ${contrib.isMe ? 'text-red-900' : 'text-gray-900'}`}>
                              {contrib.customerName} {contrib.isMe && <span className="text-[9px] bg-red-600 text-white px-2.5 py-1 rounded-full ml-2 font-bold tracking-wide">Moi</span>}
                            </p>
                            <p className="text-[10px] text-gray-900 font-normal mt-1">
                              {new Date(contrib.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${contrib.isMe ? 'text-red-600' : 'text-gray-900'}`}>
                            +{contrib.amount}$
                          </p>
                          <p className="text-[9px] text-gray-900 font-normal mt-1">Validé</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <HeartIcon className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium text-sm text-center px-6">Soyez le premier à soutenir cette cause</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            
            {/* Donation Progress Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 sticky top-28 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-red-600"
                />
              </div>

              <div className="mb-8 pt-4">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">{donation.currentAmount}$</span>
                    <p className="typography-tiny font-medium text-black mt-1">Déjà récoltés</p>
                  </div>
                  <div className="text-right">
                    <span className="typography-tiny font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">{progress}%</span>
                  </div>
                </div>
                
                <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden mb-6 border border-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-linear-to-r from-red-600 via-rose-600 to-red-500 rounded-full"
                  />
                </div>
                
                <div className="flex justify-between items-center typography-tiny font-medium text-black">
                  <span className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    Cible: {donation.targetAmount}$
                  </span>
                  <span className="flex items-center gap-1.5 text-red-600">
                    Reste: {remainingAmount}$
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 transition-colors hover:bg-gray-100/50">
                  <p className="text-lg font-bold text-gray-900">{donation.donorCount || 0}</p>
                  <p className="typography-tiny font-normal text-black mt-1">Généreux donateurs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 transition-colors hover:bg-gray-100/50">
                  <p className="text-lg font-bold text-gray-900">{remainingAmount <= 0 ? 0 : Math.ceil(remainingAmount / 10)}</p>
                  <p className="typography-tiny font-normal text-black mt-1">Dons de 10$ requis</p>
                </div>
              </div>

              {donation.isActive ? (
                <Link 
                  href={`/donations/${donation._id}/pay`}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 group active:scale-95"
                >
                  SOUTENIR LE PROJET
                </Link>
              ) : (
                <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                  CAMPAGNE TERMINEE
                  <CheckCircleIcon className="h-4 w-4" />
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                <div className="flex items-center justify-center gap-4 opacity-30 mb-3">
                    <Image src="/icon_pay/svg/Orange_Money-Logo.wine.svg" alt="Orange" width={32} height={16} className="grayscale" />
                    <Image src="/icon_pay/svg/M-PESA logo - Brandlogos.net.svg" alt="Mpesa" width={32} height={16} className="grayscale" />
                    <Image src="/icon_pay/svg/Visa_Inc.-Logo.wine.svg" alt="Visa" width={32} height={16} className="grayscale" />
                </div>
                <p className="typography-tiny font-normal text-black leading-relaxed">
                  Paiement 100% sécurisé via Araka Pay<br />Développement communautaire LAU
                </p>
              </div>
            </div>

            {/* Impact Info Box */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/20 transition-colors" />
              
              <h3 className="text-base font-bold mb-6 flex items-center gap-3 relative z-10">
                <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="h-5 w-5 text-white" />
                </div>
                Impact de votre don
              </h3>
              <ul className="space-y-5 relative z-10">
                <li className="flex gap-4">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-normal text-gray-300 leading-relaxed">Soutien direct à l&apos;infrastructure universitaire</span>
                </li>
                <li className="flex gap-4">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-normal text-gray-300 leading-relaxed">Amélioration des conditions d&apos;étude</span>
                </li>
                <li className="flex gap-4">
                  <CheckCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-normal text-gray-300 leading-relaxed">Transparence totale sur l&apos;utilisation des fonds</span>
                </li>
              </ul>
              
              <div className="mt-8 pt-8 border-t border-white/10 relative z-10 text-center">
                 <p className="text-[10px] font-bold text-gray-500 tracking-widest">LEADERSHIP ACADEMY UNIVERSITY</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
