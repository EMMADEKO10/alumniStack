import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-platform';

// Configuration simplifiée et optimisée pour MongoDB Atlas
const options = {
  serverSelectionTimeoutMS: 5000, // Réduire de 30s à 5s
  connectTimeoutMS: 10000,
  maxPoolSize: 10, // Limiter le nombre de connexions simultanées
  retryWrites: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise;
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
    
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    throw error;
  }
}

export default clientPromise; 