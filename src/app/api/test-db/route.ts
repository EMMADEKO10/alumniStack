import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test des variables d'environnement
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        error: 'MONGODB_URI non définie',
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasMongoUri: !!mongoUri
        }
      }, { status: 500 });
    }

    // Test de la connexion
    const { connectDB } = await import('@/lib/mongodb');
    const { db } = await connectDB();
    
    // Test simple de la base
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      mongoUri: mongoUri.includes('localhost') ? 'localhost' : 'cloud',
      collections: collections.map(c => c.name),
      message: 'MongoDB connecté avec succès'
    });

  } catch (error) {
    console.error('Erreur test MongoDB:', error);
    return NextResponse.json({
      error: 'Erreur de connexion MongoDB',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 
