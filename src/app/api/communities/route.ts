import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { Community, CommunityType, LEADERSHIP_ACADEMY_FACULTIES, REGIONS, PROFESSIONAL_SECTORS } from '../../../types/community';

interface CommunityFilter {
  type?: CommunityType;
  facultyId?: string;
  region?: string;
  promotionYear?: number;
  isActive?: boolean;
}

interface CommunityData {
  promotionYear?: number;
  facultyId?: string;
  departmentId?: string;
  region?: string;
  profession?: string;
}

// GET - Récupérer toutes les communautés avec filtres
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as CommunityType;
    const facultyId = searchParams.get('facultyId');
    const region = searchParams.get('region');
    const promotionYear = searchParams.get('promotionYear');
    const isActive = searchParams.get('isActive');

    const { db } = await connectDB();
    
    // Construire le filtre de recherche
    const filter: CommunityFilter = {};
    
    if (type) filter.type = type;
    if (facultyId) filter.facultyId = facultyId;
    if (region) filter.region = region;
    if (promotionYear) filter.promotionYear = parseInt(promotionYear);
    if (isActive !== null) filter.isActive = isActive === 'true';

    const communities = await db.collection('communities')
      .find(filter)
      .sort({ memberCount: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      communities,
      totalCount: communities.length,
      faculties: LEADERSHIP_ACADEMY_FACULTIES,
      regions: REGIONS,
      professionalSectors: PROFESSIONAL_SECTORS
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des communautés:', error);
    return NextResponse.json({ error: 'Impossible de récupérer les communautés' }, { status: 500 });
  }
}

// POST - Créer une nouvelle communauté
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      type, 
      promotionYear, 
      facultyId, 
      departmentId, 
      region, 
      profession,
      privacy = 'public',
      moderators = []
    } = body;

    // Validation des champs requis
    if (!name || !description || !type) {
      return NextResponse.json({ 
        error: 'Les champs nom, description et type sont obligatoires' 
      }, { status: 400 });
    }

    // Validation selon le type de communauté
    const validationError = validateCommunityData(type, {
      promotionYear,
      facultyId,
      departmentId,
      region,
      profession
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { db } = await connectDB();

    // Vérifier si une communauté similaire existe déjà
    const existingCommunity = await findExistingCommunity(db, type, {
      promotionYear,
      facultyId,
      departmentId,
      region,
      profession
    });

    if (existingCommunity) {
      return NextResponse.json({ 
        error: 'Une communauté similaire existe déjà' 
      }, { status: 409 });
    }

    const community: Community = {
      name,
      description,
      type,
      promotionYear,
      facultyId,
      departmentId,
      region,
      profession,
      memberCount: 0,
      isActive: true,
      privacy,
      moderators,
      rules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('communities').insertOne(community);
    const createdCommunity = await db.collection('communities').findOne({ _id: result.insertedId });

    return NextResponse.json(createdCommunity, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la communauté:', error);
    return NextResponse.json({ error: 'Impossible de créer la communauté' }, { status: 500 });
  }
}

// Fonction de validation des données selon le type
function validateCommunityData(type: CommunityType, data: CommunityData): string | null {
  switch (type) {
    case CommunityType.PROMOTION:
      if (!data.promotionYear || data.promotionYear < 2012 || data.promotionYear > new Date().getFullYear()) {
        return 'Année de promotion invalide (doit être entre 2012 et l\'année actuelle)';
      }
      break;
    
    case CommunityType.FACULTY:
      if (!data.facultyId) {
        return 'ID de faculté requis pour une communauté de faculté';
      }
      const faculty = LEADERSHIP_ACADEMY_FACULTIES.find(f => f.id === data.facultyId);
      if (!faculty) {
        return 'Faculté non trouvée';
      }
      break;
    
    case CommunityType.DEPARTMENT:
      if (!data.departmentId || !data.facultyId) {
        return 'ID de département et de faculté requis pour une communauté de département';
      }
      break;
    
    case CommunityType.REGION:
      if (!data.region) {
        return 'Région requise pour une communauté régionale';
      }
      if (!REGIONS.includes(data.region)) {
        return 'Région non valide';
      }
      break;
    
    case CommunityType.PROFESSION:
      if (!data.profession) {
        return 'Secteur professionnel requis pour une communauté professionnelle';
      }
      if (!PROFESSIONAL_SECTORS.includes(data.profession)) {
        return 'Secteur professionnel non valide';
      }
      break;
    
    default:
      return 'Type de communauté non valide';
  }
  
  return null;
}

// Fonction pour vérifier l'existence d'une communauté similaire
async function findExistingCommunity(db: any, type: CommunityType, data: CommunityData) {
  const filter: Record<string, string | number | undefined> = { type };
  
  switch (type) {
    case CommunityType.PROMOTION:
      filter.promotionYear = data.promotionYear;
      break;
    case CommunityType.FACULTY:
      filter.facultyId = data.facultyId;
      break;
    case CommunityType.DEPARTMENT:
      filter.departmentId = data.departmentId;
      break;
    case CommunityType.REGION:
      filter.region = data.region;
      break;
    case CommunityType.PROFESSION:
      filter.profession = data.profession;
      break;
  }
  
  return await db.collection('communities').findOne(filter);
} 