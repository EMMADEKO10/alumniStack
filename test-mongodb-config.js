// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

// Script de test pour vérifier la configuration MongoDB
console.log('=== Test de Configuration MongoDB ===\n');

// Vérifier les variables d'environnement
console.log('Variables d\'environnement:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('MONGODB_DB_NAME:', process.env.MONGODB_DB_NAME ? 'DÉFINIE' : 'NON DÉFINIE');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.MONGODB_URI) {
  console.log('\nURI MongoDB configurée:');
  // Ne pas afficher l'URI complète pour des raisons de sécurité
  const uri = process.env.MONGODB_URI;
  const maskedUri = uri.replace(/:([^:@]+)@/, ':***@');
  console.log('URI (masquée):', maskedUri);
  
  // Extraire le nom de la base de données de l'URI
  if (uri.includes('/')) {
    const uriParts = uri.split('/');
    const lastPart = uriParts[uriParts.length - 1];
    const dbName = lastPart.split('?')[0];
    console.log('Nom de la base extraite:', dbName);
  }
}

// Test de connexion simple avec MongoDB native
async function testConnection() {
  try {
    console.log('\n=== Test de Connexion ===');
    
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-platform';
    
    const client = new MongoClient(uri);
    await client.connect();
    
    // Extraire le nom de la base de données
    let dbName = process.env.MONGODB_DB_NAME;
    if (!dbName && uri.includes('/')) {
      const uriParts = uri.split('/');
      const lastPart = uriParts[uriParts.length - 1];
      dbName = lastPart.split('?')[0];
    }
    if (!dbName || dbName === '') {
      dbName = 'alumniprod';
    }
    
    const db = client.db(dbName);
    
    console.log('✅ Connexion réussie');
    console.log('Nom de la base de données utilisée:', db.databaseName);
    
    // Lister les collections
    const collections = await db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testConnection(); 