import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Force la route à être dynamique
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { db } = await connectDB();
    
    // Récupérer les informations de l'utilisateur
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le rôle de base
    const baseRole = user.role || 'user';
    
    // Si c'est un admin, retourner directement
    if (baseRole === 'admin') {
      return NextResponse.json({
        role: 'admin',
        isVerified: true,
        isComplete: true
      });
    }

    // Pour les utilisateurs normaux, vérifier s'ils ont un profil alumni
    const alumniProfile = await db.collection('alumni_profiles').findOne({ 
      userId: session.user.id 
    });

    if (alumniProfile) {
      return NextResponse.json({
        role: 'alumni',
        isVerified: alumniProfile.status?.isVerified || false,
        isComplete: alumniProfile.status?.isComplete || false
      });
    }

    // Utilisateur simple sans profil alumni
    return NextResponse.json({
      role: 'user',
      isVerified: false,
      isComplete: false
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
} 
