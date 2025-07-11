import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

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

// Données de test
const testOpportunities: Opportunity[] = [
  {
    title: "Développeur Full Stack",
    description: "Rejoignez notre équipe en tant que développeur Full Stack et participez à la conception, au développement et à la maintenance de nos applications Web. Vous travaillerez avec des technologies modernes comme React, Node.js et MongoDB.",
    company: "TechCorp",
    location: "Paris, France",
    type: "CDI",
    salary: "45 000 - 55 000 €",
    requirements: ["React", "Node.js", "MongoDB", "TypeScript"],
    deadline: new Date("2024-03-15"),
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
    deadline: new Date("2024-02-28"),
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
    deadline: new Date("2024-04-10"),
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
    deadline: new Date("2024-03-30"),
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
    const { db } = await connectDB();
    
    // Vérifier si la collection a des données
    const count = await db.collection('opportunities').countDocuments();
    
    // Si pas de données, initialiser avec des données de test
    if (count === 0) {
      console.log('Aucune opportunité trouvée, initialisation avec des données de test...');
      await db.collection('opportunities').insertMany(testOpportunities);
    }
    
    const opportunities = await db.collection('opportunities').find({}).sort({ createdAt: -1 }).toArray();
    
    console.log(`Nombre d'opportunités récupérées: ${opportunities.length}`);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    // En cas d'erreur de base de données, retourner les données de test
    console.log('Erreur de base de données, utilisation des données de test locales');
    return NextResponse.json(testOpportunities);
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