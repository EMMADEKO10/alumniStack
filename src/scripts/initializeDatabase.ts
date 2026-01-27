import { ensureIndexes } from '../lib/mongodb';

/**
 * Script pour initialiser les index de la base de données
 * Exécuter ce script après le déploiement ou lors du premier démarrage
 */
async function initializeDatabase() {
  console.log('🚀 Initialisation de la base de données...');
  
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
