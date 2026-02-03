import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { optimizedQuery, optimizedCount } from '../../../lib/api-helpers';

interface Opportunity {
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  deadline: Date;
  contactEmail: string;
  contactPhone: string;
  imageUrl: string;
  applicants: unknown[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Données de test mises à jour pour 2026
const testOpportunities: Opportunity[] = [
  {
    title: "Développeur Full Stack",
    description: "Rejoignez notre équipe en tant que développeur Full Stack et participez à la conception, au développement et à la maintenance de nos applications Web. Vous travaillerez avec des technologies modernes comme React, Node.js et MongoDB.",
    company: "TechCorp",
    location: "Paris, France",
    type: "CDI",
    salary: "45 000 - 55 000 €",
    requirements: ["React", "Node.js", "MongoDB", "TypeScript"],
    deadline: new Date("2026-12-15"),
    contactEmail: "recrutement@techcorp.fr",
    contactPhone: "01 23 45 67 89",
    imageUrl: "/graduation.jpg",
    applicants: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Spécialiste en Marketing Digital",
    description: "Nous recherchons un spécialiste en marketing numérique pour élaborer et exécuter des stratégies de marketing en ligne innovantes pour nos clients.",
    company: "DigitalAgency",
    location: "Lyon, France",
    type: "CDD",
    salary: "40 000 - 50 000 €",
    requirements: ["Google Ads", "SEO", "Social Media", "Analytics"],
    deadline: new Date("2026-11-28"),
    contactEmail: "hr@digitalagency.fr",
    contactPhone: "04 56 78 90 12",
    imageUrl: "/graduation.jpg",
    applicants: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Consultant en Finance",
    description: "Poste de consultant junior en finance d'entreprise. Excellente opportunité pour débuter votre carrière dans le conseil financier.",
    company: "Finance Conseil",
    location: "Marseille, France",
    type: "Stage",
    salary: "1 200 € / mois",
    requirements: ["Excel", "Finance d'entreprise", "Analyse financière"],
    deadline: new Date("2026-10-10"),
    contactEmail: "stages@financeconseil.fr",
    contactPhone: "04 91 23 45 67",
    imageUrl: "/graduation.jpg",
    applicants: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Développeur Frontend React",
    description: "Développeur frontend spécialisé en React pour créer des interfaces utilisateur modernes et responsive.",
    company: "WebTech Solutions",
    location: "Toulouse, France",
    type: "Freelance",
    salary: "400 - 600 € / jour",
    requirements: ["React", "TypeScript", "CSS3", "Responsive Design"],
    deadline: new Date("2026-09-30"),
    contactEmail: "projets@webtech.fr",
    contactPhone: "05 34 56 78 90",
    imageUrl: "/graduation.jpg",
    applicants: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET() {
  try {
    console.log('🔍 GET /api/opportunities - Début');
    
    // Vérifier si la collection a des données avec cache
    const count = await optimizedCount('opportunities', {});
    console.log(`📊 Nombre d'opportunités dans la base (avec cache): ${count}`);
    
    // Si pas de données, initialiser avec des données de test
    if (count === 0) {
      console.log('⚠️ Aucune opportunité trouvée, initialisation avec des données de test...');
      const { db } = await connectDB();
      await db.collection('opportunities').insertMany(testOpportunities);
    }
    
    // Récupérer les opportunités avec le helper optimisé (cache 5 min)
    const opportunities = await optimizedQuery<Opportunity>('opportunities', {}, {
      sort: { createdAt: -1 },
      cacheTTL: 5 * 60 * 1000 // 5 minutes
    });
    
    console.log(`✅ ${opportunities.length} opportunités récupérées avec succès`);
    return NextResponse.json(opportunities, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('❌ Error fetching opportunities:', error);
    
    // Tentative de fallback sur les données de test en cas d'erreur de base de données
    return NextResponse.json(testOpportunities, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, company, location, type, salary, requirements, deadline, contactEmail, contactPhone, imageUrl } = body;

    if (!title || !description || !company || !location || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();
    const opportunity: Opportunity = {
      title,
      description,
      company,
      location,
      type,
      salary: salary || 'Non spécifié',
      requirements: requirements || [],
      deadline: deadline ? new Date(deadline) : new Date(),
      contactEmail,
      contactPhone,
      imageUrl: imageUrl || '',
      applicants: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('opportunities').insertOne(opportunity);
    const createdOpportunity = await db.collection('opportunities').findOne({ _id: result.insertedId });

    return NextResponse.json(createdOpportunity, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 });
  }
} 
