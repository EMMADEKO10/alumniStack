import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { 
  AlumniProfile, 
  PublicAlumniProfile,
  calculateProfileCompletion,
  isProfileComplete 
} from '../../../types/alumni';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// GET - Récupérer le profil alumni de l'utilisateur connecté ou rechercher des profils
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const facultyId = searchParams.get('facultyId');
    const graduationYear = searchParams.get('graduationYear');
    const industry = searchParams.get('industry');
    const public_only = searchParams.get('public_only');

    const { db } = await connectDB();

    // Si userId spécifique, retourner ce profil
    if (userId) {
      const profile = await db.collection('alumni_profiles').findOne({ userId });
      
      if (!profile) {
        return NextResponse.json({ error: 'Profil alumni non trouvé' }, { status: 404 });
      }

      // Si demande publique, filtrer les informations selon les préférences
      if (public_only === 'true') {
        const publicProfile = await filterPublicProfile(profile as AlumniProfile);
        return NextResponse.json(publicProfile);
      }

      return NextResponse.json(profile);
    }

    // Recherche de profils avec filtres
    const filter: Record<string, unknown> = {};
    
    if (search) {
      filter.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'academicInfo.degreeTitle': { $regex: search, $options: 'i' } },
        { 'professionalInfo.currentPosition.jobTitle': { $regex: search, $options: 'i' } },
        { 'professionalInfo.currentPosition.company': { $regex: search, $options: 'i' } }
      ];
    }

    if (facultyId) filter['academicInfo.facultyId'] = facultyId;
    if (graduationYear) filter['academicInfo.graduationYear'] = parseInt(graduationYear);
    if (industry) filter['professionalInfo.currentPosition.industry'] = industry;

    // Toujours filtrer les profils publics pour les recherches
    filter['privacySettings.profileVisibility'] = { $in: ['Public', 'Alumni seulement'] };

    const profiles = await db.collection('alumni_profiles')
      .find(filter)
      .sort({ 'status.isVerified': -1, 'academicInfo.graduationYear': -1 })
      .limit(50)
      .toArray();

    // Filtrer les informations selon les préférences de confidentialité
    const publicProfiles = await Promise.all(
      profiles.map(profile => filterPublicProfile(profile as AlumniProfile))
    );

    return NextResponse.json({
      profiles: publicProfiles,
      totalCount: publicProfiles.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des profils alumni:', error);
    return NextResponse.json({ error: 'Impossible de récupérer les profils' }, { status: 500 });
  }
}

// POST - Créer un nouveau profil alumni
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const body = await request.json();
    const { db } = await connectDB();

    // Vérifier si un profil existe déjà pour cet utilisateur
    const existingProfile = await db.collection('alumni_profiles').findOne({ 
      userId: session.user.id 
    });

    if (existingProfile) {
      return NextResponse.json({ 
        error: 'Un profil alumni existe déjà pour cet utilisateur' 
      }, { status: 409 });
    }

    // Validation des champs requis
    if (!body.personalInfo?.firstName || !body.personalInfo?.lastName || 
        !body.academicInfo?.facultyId || !body.academicInfo?.graduationYear) {
      return NextResponse.json({ 
        error: 'Les champs prénom, nom, faculté et année de fin sont obligatoires' 
      }, { status: 400 });
    }

    // Validation de l'année de fin
    const currentYear = new Date().getFullYear();
    if (body.academicInfo.graduationYear < 2012 || body.academicInfo.graduationYear > currentYear + 1) {
      return NextResponse.json({ 
        error: 'Année de fin invalide (doit être entre 2012 et année actuelle + 1)' 
      }, { status: 400 });
    }

    // Créer le profil avec valeurs par défaut
    const alumniProfile: AlumniProfile = {
      userId: session.user.id,
      personalInfo: {
        firstName: body.personalInfo.firstName,
        lastName: body.personalInfo.lastName,
        email: body.personalInfo.email || session.user.email,
        phone: body.personalInfo.phone,
        dateOfBirth: body.personalInfo.dateOfBirth ? new Date(body.personalInfo.dateOfBirth) : undefined,
        gender: body.personalInfo.gender,
        nationality: body.personalInfo.nationality,
        profilePicture: body.personalInfo.profilePicture,
        bio: body.personalInfo.bio,
        linkedinUrl: body.personalInfo.linkedinUrl,
        websiteUrl: body.personalInfo.websiteUrl,
      },
      academicInfo: {
        studentId: body.academicInfo.studentId,
        facultyId: body.academicInfo.facultyId,
        departmentName: body.academicInfo.departmentName,
        specializationField: body.academicInfo.specializationField,
        degreeLevel: body.academicInfo.degreeLevel || 'Licence',
        degreeTitle: body.academicInfo.degreeTitle,
        graduationYear: body.academicInfo.graduationYear,
        graduationDate: body.academicInfo.graduationDate ? new Date(body.academicInfo.graduationDate) : undefined,
        honors: body.academicInfo.honors,
        thesis: body.academicInfo.thesis,
      },
      contactInfo: {
        currentAddress: body.contactInfo?.currentAddress,
        originAddress: body.contactInfo?.originAddress,
        emergencyContact: body.contactInfo?.emergencyContact,
      },
      professionalInfo: {
        currentPosition: body.professionalInfo?.currentPosition ? {
          ...body.professionalInfo.currentPosition,
          startDate: new Date(body.professionalInfo.currentPosition.startDate)
        } : undefined,
        experience: body.professionalInfo?.experience?.map((exp: { startDate: string; endDate?: string }) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined
        })) || [],
        skills: body.professionalInfo?.skills || [],
        certifications: body.professionalInfo?.certifications?.map((cert: { issueDate: string; expirationDate?: string }) => ({
          ...cert,
          issueDate: new Date(cert.issueDate),
          expirationDate: cert.expirationDate ? new Date(cert.expirationDate) : undefined
        })) || [],
        languages: body.professionalInfo?.languages || [],
      },
      communityPreferences: {
        interestedCommunityTypes: body.communityPreferences?.interestedCommunityTypes || [],
        autoJoinByPromotion: body.communityPreferences?.autoJoinByPromotion ?? true,
        autoJoinByFaculty: body.communityPreferences?.autoJoinByFaculty ?? true,
        autoJoinByRegion: body.communityPreferences?.autoJoinByRegion ?? false,
        autoJoinByProfession: body.communityPreferences?.autoJoinByProfession ?? false,
        preferredRegions: body.communityPreferences?.preferredRegions || [],
        mentorshipInterest: body.communityPreferences?.mentorshipInterest || 'None',
        networkingPreference: body.communityPreferences?.networkingPreference || 'Modéré',
      },
      privacySettings: {
        profileVisibility: body.privacySettings?.profileVisibility || 'Alumni seulement',
        showEmail: body.privacySettings?.showEmail ?? false,
        showPhone: body.privacySettings?.showPhone ?? false,
        showAddress: body.privacySettings?.showAddress ?? false,
        showWorkInfo: body.privacySettings?.showWorkInfo ?? true,
        allowDirectMessages: body.privacySettings?.allowDirectMessages ?? true,
        allowJobOffers: body.privacySettings?.allowJobOffers ?? true,
        newsletterSubscription: body.privacySettings?.newsletterSubscription ?? true,
      },
      status: {
        isVerified: false,
        isComplete: false,
        completionPercentage: 0,
        lastLoginDate: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculer le pourcentage de complétion
    alumniProfile.status.completionPercentage = calculateProfileCompletion(alumniProfile);
    alumniProfile.status.isComplete = isProfileComplete(alumniProfile);

    const result = await db.collection('alumni_profiles').insertOne(alumniProfile);
    const createdProfile = await db.collection('alumni_profiles').findOne({ _id: result.insertedId });

    return NextResponse.json(createdProfile, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du profil alumni:', error);
    return NextResponse.json({ error: 'Impossible de créer le profil alumni' }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil alumni
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    const body = await request.json();
    const { db } = await connectDB();

    // Récupérer le profil existant
    const existingProfile = await db.collection('alumni_profiles').findOne({ 
      userId: session.user.id 
    });

    if (!existingProfile) {
      return NextResponse.json({ 
        error: 'Profil alumni non trouvé' 
      }, { status: 404 });
    }

    // Préparer la mise à jour
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date(),
      lastProfileUpdate: new Date(),
    };

    // Traitement des dates
    if (body.personalInfo?.dateOfBirth) {
      (updateData as any).personalInfo.dateOfBirth = new Date(body.personalInfo.dateOfBirth);
    }
    if (body.academicInfo?.graduationDate) {
      (updateData as any).academicInfo.graduationDate = new Date(body.academicInfo.graduationDate);
    }
    if (body.professionalInfo?.currentPosition?.startDate) {
      (updateData as any).professionalInfo.currentPosition.startDate = new Date(body.professionalInfo.currentPosition.startDate);
    }

    // Fusionner avec le profil existant
    const updatedProfile = { ...existingProfile, ...updateData } as AlumniProfile;

    // Recalculer le pourcentage de complétion
    updatedProfile.status.completionPercentage = calculateProfileCompletion(updatedProfile);
    updatedProfile.status.isComplete = isProfileComplete(updatedProfile);

    // Mettre à jour en base
    await db.collection('alumni_profiles').updateOne(
      { userId: session.user.id },
      { $set: updatedProfile }
    );

    const updated = await db.collection('alumni_profiles').findOne({ userId: session.user.id });
    return NextResponse.json(updated);

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil alumni:', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour le profil' }, { status: 500 });
  }
}

// Fonction helper pour filtrer les informations publiques selon les préférences
async function filterPublicProfile(profile: AlumniProfile): Promise<PublicAlumniProfile> {
  const publicProfile: PublicAlumniProfile = {
    _id: profile._id!,
    personalInfo: {
      firstName: profile.personalInfo.firstName,
      lastName: profile.personalInfo.lastName,
      profilePicture: profile.personalInfo.profilePicture,
      bio: profile.personalInfo.bio,
      linkedinUrl: profile.personalInfo.linkedinUrl,
      websiteUrl: profile.personalInfo.websiteUrl,
    },
    academicInfo: {
      facultyId: profile.academicInfo.facultyId,
      departmentName: profile.academicInfo.departmentName,
      degreeLevel: profile.academicInfo.degreeLevel,
      degreeTitle: profile.academicInfo.degreeTitle,
      graduationYear: profile.academicInfo.graduationYear,
    },
    professionalInfo: {
      skills: profile.professionalInfo.skills || [],
    },
  };

  // Ajouter l'email si autorisé
  if (profile.privacySettings.showEmail) {
    publicProfile.personalInfo.email = profile.personalInfo.email;
  }

  // Ajouter les informations de travail si autorisées
  if (profile.privacySettings.showWorkInfo && profile.professionalInfo.currentPosition) {
    publicProfile.professionalInfo.currentPosition = profile.professionalInfo.currentPosition;
  }

  // Ajouter l'adresse si autorisée
  if (profile.privacySettings.showAddress && profile.contactInfo?.currentAddress) {
    publicProfile.contactInfo = {
      currentAddress: {
        city: profile.contactInfo.currentAddress.city,
        province: profile.contactInfo.currentAddress.province,
        country: profile.contactInfo.currentAddress.country,
      }
    };
  }

  return publicProfile;
} 