'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaIdCard } from 'react-icons/fa';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setInfo('');

    try {
      console.log('Données d\'inscription:', formData);
      
      // Utiliser des options de requête spécifiques pour éviter les problèmes CORS
      const response = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Réponse d\'inscription:', response.data);
      
      // Vérifier s'il y a un message d'information (compte mis à jour)
      if (response.data.updated) {
        setInfo('Vos informations ont été mises à jour. Un nouvel email de vérification vous a été envoyé.');
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          router.push('/verify-email');
        }, 2000);
      } else {
        // Nouveau compte créé, rediriger immédiatement
        router.push('/verify-email');
      }
    } catch (error: unknown) {
      console.error("Erreur d'inscription:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          // Conflit - compte existe déjà
          const errorData = error.response.data as { error?: string };
          const errorMsg = errorData.error || '';
          if (errorMsg.includes('déjà utilisé') || errorMsg.includes('compte vérifié')) {
            setError('Cet email est déjà associé à un compte actif. Veuillez vous connecter.');
          } else {
            setError(errorMsg);
          }
        } else if (error.response?.data?.error) {
          setError(error.response.data.error as string);
        } else if (error.code === 'ERR_NETWORK') {
          setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
        } else if (error.code === 'ERR_BAD_REQUEST') {
          setError('Requête invalide. Veuillez vérifier les informations saisies.');
        } else {
          setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer plus tard.");
        }
      } else {
        setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
        <p className="text-gray-600">Rejoignez la communauté alumni LAU</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-cyan-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-cyan-700 font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      {info && (
        <div className="bg-blue-50 border-l-4 border-blue-900 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-900 font-medium">{info}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              placeholder="exemple@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all"
                placeholder="Jean"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all"
                placeholder="Dupont"
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 font-medium"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <FaUserPlus className="mr-2" />
              S&apos;inscrire
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Déjà inscrit?{' '}
          <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
} 
