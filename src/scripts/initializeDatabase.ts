// Charger les variables d'environnement
import { config } from 'dotenv';
import { resolve } from 'path';

// Charger le fichier .env depuis la racine du projet
config({ path: resolve(__dirname, '../../.env') });

import { ensureIndexes } from '../lib/mongodb';

/**
 * Script pour initialiser les index de la base de données
 * Exécuter ce script après le déploiement ou lors du premier démarrage
 */
async function initializeDatabase() {
  console.log('🚀 Initialisation de la base de données...');
  
  // Vérifier que MONGODB_URI est chargée
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI non trouvée dans le fichier .env');
    console.log('📁 Vérifiez que le fichier .env existe à la racine du projet avec MONGODB_URI');
    process.exit(1);
  }
  
  console.log('✅ Variables d\'environnement chargées');
  
  try {
    await ensureIndexes();
    console.log('✅ Base de données initialisée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
