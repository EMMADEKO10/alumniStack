"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusIcon, 
  HeartIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

interface Donation {
  _id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const DonationsAdminPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Chargement des donations
  useEffect(() => {
    fetchDonations();
  }, []);

  // Filtrage des donations
  useEffect(() => {
    let filtered = [...donations];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((donation) => 
        filterStatus === "active" ? donation.isActive : !donation.isActive
      );
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, filterStatus]);

  const fetchDonations = async (): Promise<void> => {
    try {
      const response = await fetch("/api/donations");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des donations");
      }
      const data = await response.json();
      setDonations(data || []);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (donationId: string, currentStatus: boolean): Promise<void> => {
    try {
      const response = await fetch("/api/donations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: donationId,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchDonations(); // Recharger la liste
      } else {
        throw new Error("Erreur lors de la mise à jour du statut");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const deleteDonation = async (donationId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/donations?id=${donationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDonations(); // Recharger la liste
        setDeleteConfirm(null);
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const formatPrice = (price: number): string => {
    if (!price || price === 0) return '0 €';
    return `${price.toLocaleString()} €`;
  };

  const calculateProgress = (current: number, target: number): number => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (date: string): string => {
    if (!date) return 'Date non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/admin" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span>›</span>
            <span className="text-gray-900">Donations</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
                Gestion des donations
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les actions et causes pour lesquelles les utilisateurs peuvent faire des dons.
              </p>
            </div>
            <Link
              href="/admin/donations/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle action
            </Link>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Masquer
            </button>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actions actives</option>
                <option value="inactive">Actions inactives</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
                <p className="text-gray-600">Actions totales</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {donations.filter(d => d.isActive).length}
                </p>
                <p className="text-gray-600">Actions actives</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(donations.reduce((sum, d) => sum + (d.targetAmount || 0), 0))}
                </p>
                <p className="text-gray-600">Objectif total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(donations.reduce((sum, d) => sum + (d.currentAmount || 0), 0))}
                </p>
                <p className="text-gray-600">Montant collecté</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des donations */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm || filterStatus !== "all" 
                ? "Aucune action trouvée" 
                : "Aucune action de donation"}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Essayez de modifier vos critères de recherche ou de filtrage."
                : "Commencez par créer votre première action de donation."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link
                href="/admin/donations/add"
                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Créer une action
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donation.title}
                        </h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donation.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {donation.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStatus(donation._id, donation.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            donation.isActive
                              ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              : "text-green-500 hover:text-green-700 hover:bg-green-50"
                          }`}
                          title={donation.isActive ? "Désactiver" : "Activer"}
                        >
                          {donation.isActive ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                        <Link
                          href={`/admin/donations/edit/${donation._id}`}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(donation._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {donation.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Objectif</p>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(donation.targetAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Collecté</p>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(donation.currentAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progression</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${calculateProgress(donation.currentAmount, donation.targetAmount)}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(calculateProgress(donation.currentAmount, donation.targetAmount))}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Créé le {formatDate(donation.createdAt)}</span>
                      {donation.updatedAt && donation.updatedAt !== donation.createdAt && (
                        <span>Modifié le {formatDate(donation.updatedAt)}</span>
                      )}
                    </div>
                  </div>

                  {donation.image && (
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={donation.image}
                        alt={donation.title}
                        className="w-24 h-18 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette action de donation ? Cette action est irréversible.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => deleteDonation(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsAdminPage; 
