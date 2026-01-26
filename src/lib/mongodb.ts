import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-platform';

// Configuration simplifiée et optimisée pour MongoDB Atlas
const options = {
  serverSelectionTimeoutMS: 30000, // 30 secondes pour la sélection du serveur
  connectTimeoutMS: 30000, // 30 secondes pour la connexion
  socketTimeoutMS: 45000, // 45 secondes pour les opérations socket
  maxPoolSize: 10, // Limiter le nombre de connexions simultanées
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;

// Utiliser une variable globale pour la production aussi afin de réutiliser les connexions
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
  console.log('🔄 Nouvelle connexion MongoDB initialisée');
}
const clientPromise = globalWithMongo._mongoClientPromise;

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  try {
    console.log('🔌 Tentative de connexion à MongoDB...');
    const client = await clientPromise;
    console.log('✅ Connexion MongoDB établie');
    
    // Extraire le nom de la base de données de l'URI ou utiliser une variable d'environnement
    let dbName = process.env.MONGODB_DB_NAME;
    
    if (!dbName && uri.includes('/')) {
      // Extraire le nom de la base de données de l'URI MongoDB
      const uriParts = uri.split('/');
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
    console.error('URI (masquée):', uri.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@'));
    throw error;
  }
}

export default clientPromise; 