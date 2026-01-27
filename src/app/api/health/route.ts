import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

/**
 * Route de santé améliorée pour diagnostiquer les problèmes en production
 * Accessible via: /api/health
 */
export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    environment: string | undefined;
    env_check: Record<string, string>;
    database?: {
      status: string;
      message?: string;
      collections?: string[];
      error?: string;
    };
    message: string;
  } = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    env_check: {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Définie' : '❌ Manquante',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Définie' : '❌ Manquante',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Définie' : '❌ Manquante',
      MONGODB_URI_preview: process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.substring(0, 25) + '...' 
        : 'N/A',
    },
    message: 'Application Next.js fonctionne correctement'
  };

  // Test de connexion MongoDB
  try {
    if (process.env.MONGODB_URI) {
      const { db } = await connectDB();
      const collections = await db.listCollections().toArray();
      
      health.database = {
        status: '✅ Connectée',
        message: 'MongoDB accessible',
        collections: collections.map(c => c.name)
      };
    } else {
      health.database = {
        status: '❌ Non configurée',
        error: 'MONGODB_URI manquante dans les variables d\'environnement'
      };
      health.status = 'WARNING';
    }
  } catch (error) {
    health.database = {
      status: '❌ Erreur de connexion',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    health.status = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : health.status === 'WARNING' ? 503 : 500;

  return NextResponse.json(health, { status: statusCode });
}
