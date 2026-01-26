import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Leadership Academia Alumni Platform',
    short_name: 'LAU Alumni',
    description: 'Plateforme officielle des anciens élèves de Leadership Academy University',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/Logo LAU .png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/Logo LAU .png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['education', 'social', 'networking'],
    lang: 'fr',
    dir: 'ltr',
  };
}
