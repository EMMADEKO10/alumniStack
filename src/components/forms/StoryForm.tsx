'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface StoryFormData {
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  featured: boolean;
  readTime: string;
  author: string;
  fullContent: string;
}

export default function StoryForm({ storyId }: { storyId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    description: '',
    date: '',
    image: '',
    category: '',
    featured: false,
    readTime: '',
    author: '',
    fullContent: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
    uploadFormData.append('type', 'stories');
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'upload de l'image");
      }
      const result = await response.json();
      return result.url;
    } catch (err) {
      console.error('Erreur upload:', err);
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const payload = { ...formData, image: imageUrl };

      const response = await fetch(storyId ? `/api/stories/${storyId}` : '/api/stories', {
        method: storyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde de l\'histoire');
      }

      router.push('/admin/stories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {storyId ? 'Modifier une histoire' : 'Ajouter une histoire'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input id="title" name="title" type="text" required value={formData.title} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id="date" name="date" type="date" value={formData.date} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Choisir --</option>
              <option value="Entrepreneuriat">Entrepreneuriat</option>
              <option value="Leadership">Leadership</option>
              <option value="International">International</option>
              <option value="Social">Social</option>
              <option value="Recherche">Recherche</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">Temps de lecture</label>
            <input id="readTime" name="readTime" type="text" value={formData.readTime} onChange={handleChange}
              placeholder="ex: 5 min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input id="featured" name="featured" type="checkbox" checked={formData.featured} onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="featured" className="text-sm text-gray-700">Mettre à la Une</label>
          </div>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
          <input id="author" name="author" type="text" value={formData.author} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {imagePreview && (
            <div className="relative w-32 h-32 mt-3">
              <Image 
                src={imagePreview} 
                alt="Aperçu" 
                fill 
                className="object-cover rounded-md border" 
                unoptimized={imagePreview.startsWith('data:')}
              />
            </div>
          )}
          <div className="border-t pt-3 mt-3">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Ou URL de l'image</label>
            <input id="image" name="image" type="url" value={formData.image} onChange={handleChange}
              placeholder="https://exemple.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label htmlFor="fullContent" className="block text-sm font-medium text-gray-700 mb-1">Contenu complet (HTML autorisé)</label>
          <textarea id="fullContent" name="fullContent" rows={8} value={formData.fullContent} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading || uploadingImage}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
            {uploadingImage ? "Upload de l'image..." : loading ? (storyId ? 'Mise à jour...' : 'Création...') : (storyId ? 'Mettre à jour' : 'Créer l\'histoire')}
          </button>
          <button type="button" onClick={() => router.back()}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}


