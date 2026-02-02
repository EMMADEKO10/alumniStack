'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('transactionId');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!transactionId) {
      setStatus('failed');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/donations/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId }),
        });

        const data = await response.json();
        if (data.success) {
          setStatus('success');
        } else if (attempts < 5) {
          // Réessayer toutes les 5 secondes pendant 25 secondes si c'est encore en cours
          setTimeout(() => {
            setAttempts(prev => prev + 1);
          }, 5000);
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Error checking status:', err);
        setStatus('failed');
      }
    };

    checkStatus();
  }, [transactionId, attempts]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
    >
      {status === 'loading' ? (
        <>
          <FaSpinner className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification de votre don</h1>
          <p className="text-gray-600">Nous confirmons la réception de votre paiement auprès d'Araka Pay...</p>
          <p className="text-xs text-gray-400 mt-4">Tentative {attempts + 1}/5</p>
        </>
      ) : status === 'success' ? (
        <>
          <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre don !</h1>
          <p className="text-gray-600 mb-8">Votre contribution a été enregistrée avec succès. Merci de soutenir notre communauté.</p>
          <Link 
            href="/donations"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full"
          >
            Retour aux donations
          </Link>
        </>
      ) : (
        <>
          <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oups !</h1>
          <p className="text-gray-600 mb-4">Nous n'avons pas pu confirmer votre paiement pour le moment.</p>
          <p className="text-sm text-gray-500 mb-8 text-left bg-gray-100 p-3 rounded">
            Si vous avez été débité, ne vous inquiétez pas : votre don sera traité dès que le service de paiement nous enverra la confirmation.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setAttempts(0)}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Réessayer la vérification
            </button>
            <Link 
              href="/donations"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <FaArrowLeft className="mr-2" /> Retour à la liste
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaSpinner className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h1>
        </div>
      }>
        <DonationSuccessContent />
      </Suspense>
    </div>
  );
}
