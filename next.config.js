/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimisations pour améliorer les performances
  experimental: {
    optimizePackageImports: ['react-icons', '@heroicons/react'],
  },
  // Réduire la taille des bundles
  swcMinify: true,
  // Optimiser la compilation TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimiser les performances de développement
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimiser pour le développement
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 