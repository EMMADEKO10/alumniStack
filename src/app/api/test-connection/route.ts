import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

/**
 * Route de diagnostic pour tester la connexion MongoDB en production
 * Accessible via: /api/test-connection
 */
export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  };

  try {
    // 1. Vérifier la présence de MONGODB_URI
    diagnostics.checks = {
      ...diagnostics.checks as object,
      mongodbUriExists: !!process.env.MONGODB_URI,
      mongodbUriFormat: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 20) + '...'
        : 'MISSING',
    };

    // 2. Tenter la connexion
    const startTime = Date.now();
    const { db } = await connectDB();
    const connectionTime = Date.now() - startTime;

    diagnostics.checks = {
      ...diagnostics.checks as object,
      connectionSuccess: true,
      connectionTimeMs: connectionTime,
      databaseName: db.databaseName,
    };

    // 3. Tester une opération simple
    const collections = await db.listCollections().toArray();
    diagnostics.checks = {
      ...diagnostics.checks as object,
      collectionsCount: collections.length,
      collectionNames: collections.map((c) => c.name),
    };

    // 4. Tester une requête sur une collection
    const eventsCount = await db.collection('events').countDocuments();
    const opportunitiesCount = await db.collection('opportunities').countDocuments();

    diagnostics.checks = {
      ...diagnostics.checks as object,
      eventsCount,
      opportunitiesCount,
    };

    diagnostics.status = 'SUCCESS';
    diagnostics.message = 'Connexion MongoDB fonctionnelle';

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    diagnostics.status = 'ERROR';
    diagnostics.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'UnknownError',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    };

    console.error('❌ Test de connexion échoué:', error);

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
