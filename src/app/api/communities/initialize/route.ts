import { NextResponse } from 'next/server';
import { initializeCommunities, resetCommunities } from '@/scripts/initializeCommunities';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'initialize') {
      await initializeCommunities();
      return NextResponse.json({ 
        message: 'Communautés initialisées avec succès',
        success: true 
      });
    } else if (action === 'reset') {
      await resetCommunities();
      return NextResponse.json({ 
        message: 'Communautés réinitialisées avec succès',
        success: true 
      });
    } else {
      return NextResponse.json({ 
        error: 'Action non valide. Utilisez "initialize" ou "reset"' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des communautés:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'initialisation des communautés' 
    }, { status: 500 });
  }
} 
