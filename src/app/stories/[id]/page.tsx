'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Story {
  _id: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
  category?: string;
  featured?: boolean;
  readTime?: string;
  author?: string;
  fullContent?: string;
  createdAt?: string;
}

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyId = params.id as string;
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) throw new Error('Histoire non trouvée');
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError('Impossible de charger les détails de l\'histoire');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-6">&larr; Retour</button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-6">&larr; Retour aux histoires</button>

        <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          {story.image ? (
            <Image src={story.image} alt={story.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
            <div className="text-sm opacity-90">
              <span>{story.author}</span>
              {story.date && <span className="mx-2">•</span>}
              {story.date}
              {story.readTime && <><span className="mx-2">•</span><span>{story.readTime}</span></>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="prose max-w-none">
                {story.fullContent ? (
                  <div dangerouslySetInnerHTML={{ __html: story.fullContent }} />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{story.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {story.category && <p>Catégorie : <span className="font-medium">{story.category}</span></p>}
                {story.date && <p>Date : <span className="font-medium">{story.date}</span></p>}
                {story.author && <p>Auteur : <span className="font-medium">{story.author}</span></p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


