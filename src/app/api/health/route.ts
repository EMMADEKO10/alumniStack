import { NextResponse } from 'next/server';

/**
 * Route de santé simple pour vérifier si l'application démarre
 * Accessible via: /api/health
 */
export async function GET() {
  try {
    const health = {
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

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
