import { MongoClient, Db } from 'mongodb';

// Configuration optimisée pour MongoDB Atlas avec meilleures performances
const options = {
  serverSelectionTimeoutMS: 5000, // Réduit à 5 secondes pour détecter les problèmes plus rapidement
  connectTimeoutMS: 10000, // 10 secondes pour établir la connexion initiale
  socketTimeoutMS: 30000, // 30 secondes pour les opérations
  maxPoolSize: 50, // Augmenté pour supporter plus de connexions simultanées
  minPoolSize: 10, // Maintenir un pool minimum actif
  maxIdleTimeMS: 10000, // Fermer les connexions inactives après 10 secondes
  retryWrites: true,
  retryReads: true,
  compressors: ['zlib'], // Compression pour réduire la latence réseau
  zlibCompressionLevel: 6,
  readPreference: 'primaryPreferred', // Lecture depuis primary d'abord, puis secondaires
  w: 'majority', // Garantir l'écriture sur la majorité des nœuds
};

// Cache global pour la connexion
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoClient?: MongoClient;
  _db?: Db;
  _lastConnection?: number;
};

// Cache pour 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;

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

  // Vérifier si la connexion existe et est toujours valide
  const now = Date.now();
  if (
    globalWithMongo._mongoClientPromise &&
    globalWithMongo._lastConnection &&
    (now - globalWithMongo._lastConnection) < CACHE_DURATION
  ) {
    return globalWithMongo._mongoClientPromise;
  }

  // Créer une nouvelle connexion
  const client = new MongoClient(process.env.MONGODB_URI, options);
  globalWithMongo._mongoClientPromise = client.connect().then((connectedClient) => {
    globalWithMongo._mongoClient = connectedClient;
    globalWithMongo._lastConnection = Date.now();
    console.log('✅ Nouvelle connexion MongoDB établie et mise en cache');
    return connectedClient;
  });

  return globalWithMongo._mongoClientPromise;
}

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  try {
    // Utiliser la connexion en cache si disponible
    if (globalWithMongo._mongoClient && globalWithMongo._db) {
      // Vérifier que la connexion est toujours active
      try {
        await globalWithMongo._db.admin().ping();
        return { 
          client: globalWithMongo._mongoClient, 
          db: globalWithMongo._db 
        };
      } catch {
        // La connexion n'est plus valide, réinitialiser
        console.warn('⚠️ Connexion MongoDB expirée, reconnexion...');
        globalWithMongo._mongoClientPromise = undefined;
        globalWithMongo._mongoClient = undefined;
        globalWithMongo._db = undefined;
      }
    }

    const clientPromise = getMongoClientPromise();
    const client = await clientPromise;
    
    // Extraire le nom de la base de données
    let dbName = process.env.MONGODB_DB_NAME;
    
    if (!dbName && process.env.MONGODB_URI && process.env.MONGODB_URI.includes('/')) {
      const uriParts = process.env.MONGODB_URI.split('/');
      const lastPart = uriParts[uriParts.length - 1];
      dbName = lastPart.split('?')[0];
    }
    
    if (!dbName || dbName === '') {
      dbName = 'alumniprod';
    }
    
    const db = client.db(dbName);
    
    // Mettre en cache la connexion
    globalWithMongo._db = db;
    
    return { client, db };
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    if (process.env.MONGODB_URI) {
      console.error('URI (masquée):', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@'));
    }
    // Nettoyer le cache en cas d'erreur
    globalWithMongo._mongoClientPromise = undefined;
    globalWithMongo._mongoClient = undefined;
    globalWithMongo._db = undefined;
    throw error;
  }
}

// Helper pour créer des index optimisés
export async function ensureIndexes() {
  try {
    const { db } = await connectDB();
    
    // Index pour la collection users
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, background: true },
      { key: { createdAt: -1 }, background: true },
      { key: { role: 1 }, background: true },
    ]);

    // Index pour la collection alumni
    await db.collection('alumni').createIndexes([
      { key: { userId: 1 }, unique: true, background: true },
      { key: { isVerified: 1 }, background: true },
      { key: { graduationYear: -1 }, background: true },
      { key: { fieldOfStudy: 1 }, background: true },
      { key: { currentCompany: 1 }, background: true },
    ]);

    // Index pour les formations
    await db.collection('formations').createIndexes([
      { key: { startDate: -1 }, background: true },
      { key: { level: 1 }, background: true },
      { key: { createdAt: -1 }, background: true },
    ]);

    // Index pour les événements
    await db.collection('events').createIndexes([
      { key: { date: -1 }, background: true },
      { key: { createdAt: -1 }, background: true },
    ]);

    // Index pour les opportunités
    await db.collection('opportunities').createIndexes([
      { key: { createdAt: -1 }, background: true },
      { key: { type: 1 }, background: true },
      { key: { deadline: 1 }, background: true },
    ]);

    // Index pour les stories
    await db.collection('stories').createIndexes([
      { key: { createdAt: -1 }, background: true },
      { key: { isPublished: 1 }, background: true },
    ]);

    // Index pour les donations
    await db.collection('donations').createIndexes([
      { key: { createdAt: -1 }, background: true },
      { key: { status: 1 }, background: true },
      { key: { userId: 1 }, background: true },
    ]);

    console.log('✅ Index de base de données créés avec succès');
  } catch (error) {
    console.error('⚠️ Erreur lors de la création des index:', error);
  }
}

export default getMongoClientPromise; 
