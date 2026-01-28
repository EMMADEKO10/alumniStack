"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { 
  HeartIcon, 
  CurrencyDollarIcon, 
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";

interface FormData {
  title: string;
  description: string;
  image: string;
  targetAmount: string;
  currentAmount: string;
  isActive: boolean;
}

interface Errors {
  [key: string]: string | undefined;
  general?: string;
}

interface DonationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<FormData> | null;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    targetAmount: initialData?.targetAmount || "",
    currentAmount: initialData?.currentAmount || "0",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Supprimer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: value
    }));
    setImagePreview(value);
    // Réinitialiser le fichier si on saisit une URL
    setImageFile(null);
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Vider le champ URL
      setFormData(prev => ({
        ...prev,
        image: ""
      }));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
    uploadFormData.append('type', 'donations'); // Spécifier le type pour organiser les dossiers

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (formData.targetAmount && isNaN(parseFloat(formData.targetAmount))) {
      newErrors.targetAmount = "Le montant cible doit être un nombre valide";
    }

    if (formData.currentAmount && isNaN(parseFloat(formData.currentAmount))) {
      newErrors.currentAmount = "Le montant actuel doit être un nombre valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = formData.image;

      // Upload de l'image si un fichier est sélectionné
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error('Erreur lors de l\'upload de l\'image');
        }
      }

      const submissionData: FormData = {
        ...formData,
        image: imageUrl || '/graduation.jpg' // Image par défaut si aucune image
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ general: 'Erreur lors de l\'upload de l\'image' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <HeartIcon className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Modifier l'action de donation" : "Nouvelle action de donation"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Erreur générale */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l&apos;action *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ex: Construction de la bibliothèque"
          />
          {errors.title && (
            <div className="flex items-center mt-2 text-red-600">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{errors.title}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Décrivez l'action de donation et son impact..."
          />
          {errors.description && (
            <div className="flex items-center mt-2 text-red-600">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{errors.description}</span>
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de l&apos;action de donation
          </label>
          
          <div className="space-y-4">
            {/* Upload de fichier */}
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                Télécharger une image
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="imageFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm text-gray-500">Upload en cours...</p>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* URL d'image */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL de l&apos;image
              </label>
              <div className="relative">
                <PhotoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  id="imageUrl"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>
            </div>

            {/* Aperçu de l'image */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                <div className="relative w-32 h-24 border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                    unoptimized={imagePreview.startsWith('data:')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Montants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant cible (€)
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.targetAmount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10000"
              />
            </div>
            {errors.targetAmount && (
              <div className="flex items-center mt-2 text-red-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{errors.targetAmount}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant actuel (€)
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="currentAmount"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.currentAmount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
            </div>
            {errors.currentAmount && (
              <div className="flex items-center mt-2 text-red-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{errors.currentAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Statut actif */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Action active (visible sur le site)
          </label>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || uploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {uploadingImage ? 'Upload...' : 'Sauvegarde...'}
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {initialData ? "Mettre à jour" : "Créer l'action"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading || uploadingImage}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm; 
