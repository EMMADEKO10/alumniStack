import { MongoClient, Db } from 'mongodb';

// Configuration simplifiée et optimisée pour MongoDB Atlas
const options = {
  serverSelectionTimeoutMS: 30000, // 30 secondes pour la sélection du serveur
  connectTimeoutMS: 30000, // 30 secondes pour la connexion
  socketTimeoutMS: 45000, // 45 secondes pour les opérations socket
  maxPoolSize: 10, // Limiter le nombre de connexions simultanées
  retryWrites: true,
  retryReads: true,
};

// Utiliser une variable globale pour la production aussi afin de réutiliser les connexions
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.trim() === '') {
    throw new Error(
      '❌ MONGODB_URI manquante dans les variables d\'environnement.\n' +
      'Configuration requise sur Hostinger:\n' +
      '1. Allez dans votre panneau Hostinger\n' +
      '2. Sites web > alumni-launiversity.cd > Paramètres\n' +
      '3. Variables d\'environnement > Ajouter MONGODB_URI'
    );
  }

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('🔄 Nouvelle connexion MongoDB initialisée');
  }
  
  return globalWithMongo._mongoClientPromise;
}

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  try {
    console.log('🔌 Tentative de connexion à MongoDB...');
    const clientPromise = getMongoClientPromise();
    const client = await clientPromise;
    console.log('✅ Connexion MongoDB établie');
    
    // Extraire le nom de la base de données de l'URI ou utiliser une variable d'environnement
    let dbName = process.env.MONGODB_DB_NAME;
    
    if (!dbName && process.env.MONGODB_URI && process.env.MONGODB_URI.includes('/')) {
      // Extraire le nom de la base de données de l'URI MongoDB
      const uriParts = process.env.MONGODB_URI.split('/');
      const lastPart = uriParts[uriParts.length - 1];
      dbName = lastPart.split('?')[0]; // Enlever les paramètres de requête
    }
    
    // Fallback par défaut
    if (!dbName || dbName === '') {
      dbName = 'alumniprod';
    }
    
    console.log(`📊 Utilisation de la base de données: ${dbName}`);
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    if (process.env.MONGODB_URI) {
      console.error('URI (masquée):', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@'));
    }
    throw error;
  }
}

export default getMongoClientPromise; 
