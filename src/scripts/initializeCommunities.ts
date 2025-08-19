/**
 * Script d'initialisation des communautés Université de Kinshasa
 * 
 * Ce script crée automatiquement les communautés de base selon l'architecture définie :
 * - Une communauté par faculté (8 facultés)
 * - Une communauté par région principale
 * - Les communautés de promotion depuis 2012
 * - Les communautés professionnelles principales
 */

import { connectDB } from '../lib/mongodb';
import {
  Community,
  CommunityType,
  UNIKIN_FACULTIES 
} from '../types/community';

interface CommunityTemplate {
  name: string;
  description: string;
  type: CommunityType;
  promotionYear?: number;
  facultyId?: string;
  departmentId?: string;
  region?: string;
  profession?: string;
  privacy: 'public' | 'private' | 'restricted';
}

async function initializeCommunities() {
  try {
    console.log('🚀 Initialisation des communautés Université de Kinshasa...');
    
    const { db } = await connectDB();
    
    // Vérifier si des communautés existent déjà
    const existingCount = await db.collection('communities').countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} communautés existent déjà. Arrêt de l'initialisation.`);
      return;
    }

    const communities: CommunityTemplate[] = [];

    // 1. Communautés par faculté (8 facultés)
    console.log('📚 Création des communautés de facultés...');
    UNIKIN_FACULTIES.forEach(faculty => {
      communities.push({
        name: `Alumni ${faculty.name}`,
        description: `Communauté des anciens étudiants de la ${faculty.name}. Partagez vos expériences professionnelles, opportunités et restez connectés avec vos collègues de promotion.`,
        type: CommunityType.FACULTY,
        facultyId: faculty.id,
        privacy: 'public'
      });
    });

    // 2. Communautés par région
    console.log('🌍 Création des communautés régionales...');
    const mainRegions = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Matadi'];
    mainRegions.forEach(region => {
      communities.push({
        name: `Alumni ${region}`,
        description: `Réseau des diplômés Université de Kinshasa basés à ${region}. Organisez des événements locaux, des rencontres professionnelles et maintenez le lien dans votre région.`,
        type: CommunityType.REGION,
        region: region,
        privacy: 'public'
      });
    });

    // 3. Communautés par promotion (dernières 5 années)
    console.log('🎓 Création des communautés de promotion...');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 4; year <= currentYear; year++) {
      communities.push({
        name: `Promotion ${year}`,
        description: `Retrouvez vos camarades de la promotion ${year} ! Partagez vos parcours professionnels, organisez des retrouvailles et maintenez l'esprit de cohésion de votre promotion.`,
        type: CommunityType.PROMOTION,
        promotionYear: year,
        privacy: 'public'
      });
    }

    // 4. Communautés professionnelles principales
    console.log('💼 Création des communautés professionnelles...');
    const mainProfessions = [
      'Santé et Médecine',
      'Ingénierie et Technologie', 
      'Finance et Banque',
      'Éducation et Formation',
      'Droit et Justice'
    ];
    mainProfessions.forEach(profession => {
      communities.push({
        name: `Professionnels - ${profession}`,
        description: `Réseau professionnel des diplômés Université de Kinshasa dans le secteur ${profession}. Échangez sur les tendances du secteur, partagez des opportunités et développez votre réseau professionnel.`,
        type: CommunityType.PROFESSION,
        profession: profession,
        privacy: 'public'
      });
    });

    // 5. Quelques communautés de département pour les facultés principales
    console.log('📖 Création des communautés de département...');
    const departmentCommunities = [
      {
        name: 'Informaticiens Université de Kinshasa',
        description: 'Communauté des diplômés en informatique. Partagez les dernières technologies, opportunités IT et projets innovants.',
        facultyId: 'fac_ingenierie',
        departmentId: 'Informatique'
      },
      {
        name: 'Médecins Université de Kinshasa',
        description: 'Réseau des diplômés en médecine. Échanges scientifiques, opportunités médicales et solidarité professionnelle.',
        facultyId: 'fac_medecine',
        departmentId: 'Médecine Générale'
      },
      {
        name: 'Économistes et Gestionnaires',
        description: 'Communauté des diplômés en économie et gestion. Analyses économiques, opportunités business et networking.',
        facultyId: 'fac_economie',
        departmentId: 'Finance'
      }
    ];

    departmentCommunities.forEach(dept => {
      communities.push({
        name: dept.name,
        description: dept.description,
        type: CommunityType.DEPARTMENT,
        facultyId: dept.facultyId,
        departmentId: dept.departmentId,
        privacy: 'public'
      });
    });

    // Convertir en format MongoDB
    const communityDocuments: Community[] = communities.map(template => ({
      ...template,
      memberCount: 0,
      isActive: true,
      moderators: [],
      rules: [
        'Respectez tous les membres de la communauté',
        'Partagez du contenu pertinent et constructif',
        'Aidez-vous mutuellement dans vos projets professionnels',
        'Maintenez la confidentialité des informations sensibles',
        'Participez activement aux discussions et événements'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insérer en base
    console.log(`💾 Insertion de ${communityDocuments.length} communautés...`);
    const result = await db.collection('communities').insertMany(communityDocuments);
    
    console.log(`✅ ${result.insertedCount} communautés créées avec succès !`);
    
    // Statistiques finales
    const stats = {
      facultes: communities.filter(c => c.type === CommunityType.FACULTY).length,
      regions: communities.filter(c => c.type === CommunityType.REGION).length,
      promotions: communities.filter(c => c.type === CommunityType.PROMOTION).length,
      professions: communities.filter(c => c.type === CommunityType.PROFESSION).length,
      departements: communities.filter(c => c.type === CommunityType.DEPARTMENT).length
    };

    console.log('\n📊 Récapitulatif des communautés créées :');
    console.log(`   • ${stats.facultes} communautés de facultés`);
    console.log(`   • ${stats.regions} communautés régionales`);
    console.log(`   • ${stats.promotions} communautés de promotion`);
    console.log(`   • ${stats.professions} communautés professionnelles`);
    console.log(`   • ${stats.departements} communautés de département`);
    console.log(`   📈 Total : ${communityDocuments.length} communautés`);

    console.log('\n🎉 Initialisation terminée avec succès !');
    console.log('🔗 Les utilisateurs peuvent maintenant rejoindre ces communautés via /communities');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des communautés:', error);
    throw error;
  }
}

// Fonction pour réinitialiser toutes les communautés (ATTENTION : destructif)
async function resetCommunities() {
  try {
    console.log('⚠️  ATTENTION : Suppression de toutes les communautés existantes...');
    
    const { db } = await connectDB();
    const result = await db.collection('communities').deleteMany({});
    
    console.log(`🗑️  ${result.deletedCount} communautés supprimées.`);
    console.log('🔄 Vous pouvez maintenant relancer l\'initialisation.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
}

// Export des fonctions pour utilisation programmatique
export { initializeCommunities, resetCommunities };

// Exécution directe si appelé en ligne de commande
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--reset')) {
    resetCommunities()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    initializeCommunities()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
} 