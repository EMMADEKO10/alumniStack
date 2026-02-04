'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const PAYMENT_METHODS = [
  {
    id: 'ORANGE',
    name: 'Orange Money',
    logo: '/icon_pay/svg/Orange_Money-Logo.wine.svg',
    color: 'bg-[#FF6600]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'MPESA',
    name: 'M-Pesa',
    logo: '/icon_pay/svg/M-PESA logo - Brandlogos.net.svg',
    color: 'bg-[#EF3123]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'AIRTEL',
    name: 'Airtel Money',
    logo: '/icon_pay/svg/Airtel_India-Logo.wine.svg',
    color: 'bg-[#FF0000]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'CARD',
    name: 'Carte Bancaire',
    logo: '/icon_pay/svg/Visa_Inc.-Logo.wine.svg',
    color: 'bg-blue-600',
    textColor: 'text-white',
    type: 'CARD'
  }
];

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

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
}

export default function DonationPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loadingDonation, setLoadingDonation] = useState(true);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('10');
  const [method, setMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pré-remplir les informations si l'utilisateur est connecté
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session, name, email]);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/donations/${id}`);
        if (!res.ok) throw new Error('Donation non trouvée');
        const data = await res.json();
        setDonation(data);
      } catch {
        setError('Impossible de charger les détails de cette action.');
      } finally {
        setLoadingDonation(false);
      }
    };

    if (id) fetchDonation();
  }, [id]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!method) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/donations/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          donationId: id,
          phoneNumber: phoneNumber || '+243810000001',
          customerName: name || 'Donateur LAU',
          customerEmail: email || null,
          paymentMethod: method.type,
          provider: method.type === 'MOBILEMONEY' ? method.id : undefined,
          walletID: method.type === 'MOBILEMONEY' ? phoneNumber : undefined
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.success) {
        setStep(4); // Success step
      } else {
        setError(data.error || "Impossible d'initialiser le paiement");
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion au service de paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingDonation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation non trouvée</h2>
        <Link href="/donations" className="text-red-600 hover:underline">Retourner aux donations</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Donation Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden sticky top-28 sm:top-40">
              <div className="relative h-48 w-full">
                <Image src={donation.image} alt={donation.title} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                  <h2 className="text-white text-xl font-bold leading-tight">{donation.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-gray-600 mb-4">
                  <ShoppingBagIcon className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Récapitulatif du don</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Montant</span>
                    <span className="font-bold text-gray-900">{amount} USD</span>
                  </div>
                  {method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Méthode</span>
                      <span className="font-bold text-gray-900">{method.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Link href="/donations" className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Annuler et retourner
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Flow */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-125 flex flex-col">
              
              {/* Progress Header */}
              <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
                <h1 className="text-lg font-semibold text-gray-900">Finaliser votre don</h1>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        step === s ? 'bg-red-600 text-white' : 
                        step > s ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
                      }`}>
                        {step > s ? <CheckCircleIcon className="h-5 w-5" /> : s}
                      </div>
                      {s < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8 grow">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-6">
                          Choisissez le montant de votre don (USD)
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
                          {PRESET_AMOUNTS.map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val.toString())}
                              className={`py-2.5 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all ${
                                amount === val.toString() 
                                  ? 'bg-red-600 text-white shadow-md' 
                                  : 'bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-200 border border-transparent'
                              }`}
                            >
                              {val}$
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-px bg-gray-100 grow"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Ou montant personnalisé</span>
                            <div className="h-px bg-gray-100 grow"></div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Autre montant"
                              value={PRESET_AMOUNTS.includes(Number(amount)) && amount !== '' ? '' : amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full py-2.5 sm:py-4 px-4 bg-gray-50 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold focus:ring-2 focus:ring-red-600 outline-none border border-gray-100 focus:bg-white text-center transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="w-full bg-red-600 text-white py-5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200"
                      >
                        Continuer vers le paiement
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-sm font-semibold text-gray-700 mb-6">Moyen de paiement</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setMethod(m)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-4 relative overflow-hidden group h-36 ${
                              method?.id === m.id 
                                ? 'border-red-600 bg-red-50 ring-4 ring-red-100' 
                                : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'
                            }`}
                          >
                            {method?.id === m.id && (
                              <div className="absolute top-3 right-3">
                                <CheckCircleIcon className="h-6 w-6 text-red-600" />
                              </div>
                            )}
                            <div className="h-16 w-32 relative">
                              <Image 
                                src={m.logo} 
                                alt={m.name} 
                                fill 
                                className="object-contain grayscale group-hover:grayscale-0 transition-all" 
                              />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{m.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button onClick={handleBack} className="flex-1 py-4 px-6 border-2 border-gray-100 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                          Retour
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!method}
                          className="flex-2 bg-red-600 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200"
                        >
                          Suivant
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-sm text-red-800 flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5" />
                          Vous allez verser <strong>{amount} USD</strong> via <strong>{method?.name}</strong>
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Votre nom complet</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Votre Adresse Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all"
                          />
                        </div>

                        {method?.type === 'MOBILEMONEY' && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Numéro de téléphone {method.name}</label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="0810000000"
                                className="w-full p-4 pl-12 bg-gray-50 rounded-xl border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-shake">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button onClick={handleBack} disabled={isLoading} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                          Retour
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="flex-2 bg-red-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200"
                        >
                          {isLoading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          ) : (
                            <>
                              Confirmer le don
                              <HeartIcon className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                        <CheckCircleIcon className="h-12 w-12" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Merci pour votre don !</h2>
                      <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed text-sm">
                        Votre contribution de <span className="text-gray-900 font-semibold">{amount} USD</span> pour <span className="text-gray-900 font-semibold">{donation.title}</span> a été reçue avec succès.
                      </p>
                      <button
                        onClick={() => router.push('/donations')}
                        className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-black transition-all shadow-xl shadow-gray-200"
                      >
                        Retour aux campagnes
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 opacity-60">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Paiement Sécurisé SSL</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">Verified by Visa</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-red-600">Mobile Money Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
