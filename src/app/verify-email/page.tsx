'use client';

import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  const handleResendEmail = async () => {
    setIsResending(true);
    // Simuler l'envoi d'email (à remplacer par votre logique réelle)
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Décorations de fond avec palette LAU */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="pt-32 pb-16 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* En-tête avec icône */}
            <div className="bg-linear-to-br from-red-600 to-red-500 px-8 py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6"
              >
                <EnvelopeIcon className="w-10 h-10 text-red-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Vérifiez votre email
              </h1>
              <p className="text-red-50 text-lg">
                Dernière étape avant de rejoindre la communauté LAU
              </p>
            </div>

            {/* Contenu principal */}
            <div className="px-8 py-10">
              {/* Message principal */}
              <div className="text-center mb-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Un email de confirmation vient d&apos;être envoyé à votre adresse.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour activer votre compte.
                </p>
              </div>

              {/* Instructions pas à pas */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border border-cyan-100">
                <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-cyan-600" />
                  Instructions
                </h2>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    <span>Ouvrez votre boîte de réception email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    <span>Recherchez un email de <strong>LAU Alumni Platform</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </span>
                    <span>Cliquez sur le bouton ou le lien de vérification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </span>
                    <span>Vous serez automatiquement redirigé vers votre profil</span>
                  </li>
                </ol>
              </div>

              {/* Alerte spam */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">Email non reçu ?</p>
                    <p className="text-sm text-red-700">
                      Vérifiez votre dossier <strong>spam</strong> ou <strong>courrier indésirable</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton de renvoi */}
              <div className="text-center">
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || resendSuccess}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    resendSuccess
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600 hover:text-red-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isResending ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : resendSuccess ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Email renvoyé avec succès !
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="w-5 h-5" />
                      Renvoyer l&apos;email de vérification
                    </>
                  )}
                </button>
              </div>

              {/* Retour à la connexion */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-3">Vous avez déjà vérifié votre email ?</p>
                <button
                  onClick={() => router.push('/login')}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
                >
                  Se connecter →
                </button>
              </div>
            </div>
          </motion.div>

          {/* Palette de couleurs LAU - Information */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Palette de couleurs LAU</h3>
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center">
                <div className="w-full h-12 bg-red-600 rounded-lg shadow-sm mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Rouge</p>
                <p className="text-xs text-gray-500">#ef4444</p>
                <p className="text-xs text-gray-400">Primaire</p>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-blue-900 rounded-lg shadow-sm mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Bleu foncé</p>
                <p className="text-xs text-gray-500">#1e3a8a</p>
                <p className="text-xs text-gray-400">Secondaire</p>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-cyan-600 rounded-lg shadow-sm mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Cyan</p>
                <p className="text-xs text-gray-500">#06b6d4</p>
                <p className="text-xs text-gray-400">Tertiaire</p>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-gray-900 rounded-lg shadow-sm mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Noir</p>
                <p className="text-xs text-gray-500">#111827</p>
                <p className="text-xs text-gray-400">Texte</p>
              </div>
              <div className="text-center">
                <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-gray-200 mb-2"></div>
                <p className="text-xs font-medium text-gray-700">Blanc</p>
                <p className="text-xs text-gray-500">#ffffff</p>
                <p className="text-xs text-gray-400">Fond</p>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}
