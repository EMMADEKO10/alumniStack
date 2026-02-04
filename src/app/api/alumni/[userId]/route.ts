import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';

// GET - Récupérer le profil alumni d'un utilisateur spécifique
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();
    const { userId } = params;
    const { db } = await connectDB();

    const profile = await db.collection('alumni_profiles').findOne({ userId });

    if (!profile) {
      return NextResponse.json({ error: 'Profil alumni non trouvé' }, { status: 404 });
    }

    // Si c'est le profil de l'utilisateur connecté, retourner toutes les infos
    if (session?.user?.email && profile.personalInfo.email === session.user.email) {
      return NextResponse.json(profile);
    }

    // Sinon, filtrer selon les préférences de confidentialité
    const { privacySettings } = profile;
    
    if (privacySettings.profileVisibility === 'Privé') {
      return NextResponse.json({ error: 'Profil privé' }, { status: 403 });
    }

    if (privacySettings.profileVisibility === 'Alumni seulement' && !session?.user) {
      return NextResponse.json({ error: 'Accès réservé aux alumni' }, { status: 403 });
    }

    // Retourner le profil filtré
    const publicProfile = {
      _id: profile._id,
      personalInfo: {
        firstName: profile.personalInfo.firstName,
        lastName: profile.personalInfo.lastName,
        profilePicture: profile.personalInfo.profilePicture,
        bio: profile.personalInfo.bio,
        linkedinUrl: profile.personalInfo.linkedinUrl,
        websiteUrl: profile.personalInfo.websiteUrl,
        ...(privacySettings.showEmail && { email: profile.personalInfo.email }),
        ...(privacySettings.showPhone && { phone: profile.personalInfo.phone }),
      },
      academicInfo: profile.academicInfo,
      professionalInfo: {
        skills: profile.professionalInfo.skills,
        ...(privacySettings.showWorkInfo && { 
          currentPosition: profile.professionalInfo.currentPosition,
          experience: profile.professionalInfo.experience,
          certifications: profile.professionalInfo.certifications 
        }),
        languages: profile.professionalInfo.languages,
      },
      ...(privacySettings.showAddress && {
        contactInfo: {
          currentAddress: profile.contactInfo.currentAddress
        }
      }),
      status: {
        isVerified: profile.status.isVerified,
        completionPercentage: profile.status.completionPercentage,
      }
    };

    return NextResponse.json(publicProfile);

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json({ error: 'Impossible de récupérer le profil' }, { status: 500 });
  }
} 