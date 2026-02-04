'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CreditCardIcon, 
  PhoneIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface DonationPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: {
    _id: string;
    title: string;
    image: string;
  } | null;
}

const PAYMENT_METHODS = [
  {
    id: 'ORANGE',
    name: 'Orange Money',
    logo: '/icon_reseaux_sociaux/png/orange_money.png', // Fallback if exists, or use colors
    color: 'bg-[#FF6600]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'MPESA',
    name: 'M-Pesa',
    logo: '/icon_reseaux_sociaux/png/mpesa.png',
    color: 'bg-[#EF3123]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'AIRTEL',
    name: 'Airtel Money',
    logo: '/icon_reseaux_sociaux/png/airtel.png',
    color: 'bg-[#FF0000]',
    textColor: 'text-white',
    type: 'MOBILEMONEY'
  },
  {
    id: 'CARD',
    name: 'Carte Bancaire',
    logo: null,
    color: 'bg-blue-600',
    textColor: 'text-white',
    type: 'CARD'
  }
];

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

export default function DonationPaymentModal({ isOpen, onClose, donation }: DonationPaymentModalProps) {
  const { data: session } = useSession();
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!donation) return null;

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
          donationId: donation._id,
          phoneNumber: phoneNumber || '+243810000001', // Example default if empty
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>

            {/* Header / Donation Info */}
            <div className="bg-linear-to-r from-red-600 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-white/20 relative shrink-0">
                  <Image src={donation.image} alt={donation.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-red-100 text-xs font-medium uppercase tracking-wider mb-1">Faire un don à</p>
                  <h3 className="text-lg font-bold leading-tight line-clamp-1">{donation.title}</h3>
                </div>
              </div>
            </div>

            {/* Progress Wrapper */}
            <div className="px-8 pt-6 pb-2">
              <div className="flex justify-between mb-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step === s ? 'bg-red-600 text-white' : 
                      step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step > s ? <CheckCircleIcon className="h-5 w-5" /> : s}
                    </div>
                    {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Amount */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Choisissez le montant de votre don (USD)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {PRESET_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                              amount === val.toString() 
                                ? 'bg-red-50 border-red-600 text-red-600 shadow-md' 
                                : 'border-gray-100 text-gray-600 hover:border-red-200'
                            }`}
                          >
                            ${val}
                          </button>
                        ))}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Autre"
                            className="w-full py-3 pl-7 pr-3 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:ring-0 outline-none font-bold text-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleNext}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                    >
                      Continuer
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <label className="block text-sm font-semibold text-gray-700">
                      Moyen de paiement
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 h-28 relative overflow-hidden group ${
                            method?.id === m.id 
                              ? 'border-red-600 bg-red-50 ring-2 ring-red-100' 
                              : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'
                          }`}
                        >
                          {method?.id === m.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircleIcon className="h-5 w-5 text-red-600" />
                            </div>
                          )}
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md ${m.color} group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-sm font-black text-white">{m.name.split(' ')[0][0]}{m.name.split(' ').length > 1 ? m.name.split(' ')[1][0] : ''}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-700">{m.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold transition-all"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!method}
                        className="flex-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        Continuer
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${method?.color}`}>
                        {method?.id === 'CARD' ? <CreditCardIcon className="h-5 w-5 text-white" /> : <PhoneIcon className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Sélectionné</p>
                        <p className="text-sm font-bold text-gray-800">{method?.name} - {amount}$</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom complet</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Jean Mukendi"
                          className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:ring-0 outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adresse Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:ring-0 outline-none font-medium"
                        />
                      </div>

                      {method?.type === 'MOBILEMONEY' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Numéro de téléphone</label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+243..."
                            className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-100 focus:border-red-600 focus:ring-0 outline-none font-medium"
                          />
                        </div>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                      </p>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        disabled={isLoading}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold transition-all"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || (method?.type === 'MOBILEMONEY' && !phoneNumber)}
                        className="flex-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Confirmer le don</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">Merci pour votre don !</h3>
                      <p className="text-gray-600">
                        Votre générosité fait une réelle différence. Un email de confirmation vous sera envoyé dès que la transaction sera validée.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                    >
                      Fermer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 flex items-center justify-center gap-2">
              <HeartIcon className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Paiement sécurisé par la plateforme Alumni LAU
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
