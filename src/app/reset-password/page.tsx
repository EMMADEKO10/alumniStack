'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    if (password.length < 6) {
      setStatus({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: data.message });
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus({ type: 'error', text: data.message || 'Une erreur est survenue.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ type: 'error', text: 'Une erreur de connexion est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-200">
          Token de réinitialisation manquant ou invalide.
        </div>
        <Link href="/login" className="mt-4 inline-block text-red-600 hover:text-red-500 font-medium">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
      {status && (
        <div className={`mb-6 p-4 rounded-md flex items-center ${
          status.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {status.type === 'success' ? <FaCheck className="mr-3" /> : null}
          {status.text}
        </div>
      )}

      {status?.type === 'success' ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous allez être redirigé vers la page de connexion...</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Se connecter maintenant
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" title="Nouveau mot de passe" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" title="Confirmer le mot de passe" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="mr-2" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mb-8">
          Veuillez saisir votre nouveau mot de passe ci-dessous.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center">Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
