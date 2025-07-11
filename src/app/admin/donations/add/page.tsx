"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DonationForm from "../../../../components/forms/DonationForm";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface FormData {
  title: string;
  description: string;
  image: string;
  targetAmount: string;
  currentAmount: string;
  isActive: boolean;
}

interface Message {
  type: "success" | "error" | "";
  content: string;
}

const AddDonationPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", content: "" });
  const router = useRouter();

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Action de donation créée avec succès !",
        });

        // Rediriger vers la liste des donations après un délai
        setTimeout(() => {
          router.push("/admin/donations");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          content: result.error || "Erreur lors de la création de l'action de donation",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({
        type: "error",
        content: "Erreur de connexion. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/admin" className="hover:text-gray-700">
              Dashboard
            </a>
            <span>›</span>
            <a href="/admin/donations" className="hover:text-gray-700">
              Donations
            </a>
            <span>›</span>
            <span className="text-gray-900">Nouvelle action</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Créer une nouvelle action de donation
              </h1>
              <p className="mt-2 text-gray-600">
                Ajoutez une nouvelle cause ou action pour laquelle les utilisateurs peuvent faire des dons.
              </p>
            </div>
          </div>
        </div>

        {/* Messages de feedback */}
        {message.content && (
          <div className={`mb-6 rounded-lg border p-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {message.content}
              </span>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <DonationForm onSubmit={handleSubmit} loading={loading} />

        {/* Conseils */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            Conseils pour créer une action de donation efficace
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Utilisez un titre clair et engageant qui explique l&apos;objectif de la donation</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Décrivez l&apos;impact concret que aura la donation sur l&apos;université ou la communauté</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Définissez un montant cible réaliste et motivant</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Ajoutez une image représentative pour rendre l&apos;action plus attractive</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Mettez à jour régulièrement le montant actuel pour encourager les donations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddDonationPage; 