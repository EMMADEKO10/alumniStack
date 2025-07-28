// Test direct avec l'URI de production
const MONGODB_URI = 'mongodb+srv://admin:k8E3oyHBD8UgIRha@cluster0.bhckvli.mongodb.net/alumniprod?retryWrites=true&w=majority&appName=Cluster0';

console.log('=== Test de Configuration MongoDB Production ===\n');

async function testProductionConnection() {
  try {
    console.log('Test avec URI de production...');
    
    const { MongoClient } = require('mongodb');
    
    // Extraire le nom de la base de données de l'URI
    let dbName = 'alumniprod'; // Par défaut
    if (MONGODB_URI.includes('/')) {
      const uriParts = MONGODB_URI.split('/');
      const lastPart = uriParts[uriParts.length - 1];
      dbName = lastPart.split('?')[0];
    }
    
    console.log('Nom de la base extraite de l\'URI:', dbName);
    
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
    });
    
    console.log('Tentative de connexion...');
    await client.connect();
    
    const db = client.db(dbName);
    
    console.log('✅ Connexion réussie');
    console.log('Nom de la base de données utilisée:', db.databaseName);
    
    // Lister les collections
    const collections = await db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connexion fermée.');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testProductionConnection(); 