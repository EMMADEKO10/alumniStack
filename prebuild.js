#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Prebuild: Nettoyage et installation des dépendances...');

// Supprimer node_modules complet pour forcer une installation propre
const nodeModules = path.join(__dirname, 'node_modules');
try {
  if (fs.existsSync(nodeModules)) {
    console.log('🗑️  Suppression de node_modules...');
    fs.rmSync(nodeModules, { recursive: true, force: true });
    console.log('✓ node_modules supprimé');
  }
} catch (err) {
  console.warn('⚠ Erreur lors de la suppression:', err.message);
}

// Installer toutes les dépendances avec les versions exactes
try {
  console.log('📦 Installation de toutes les dépendances...');
  execSync('npm install --legacy-peer-deps --force', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✓ Dépendances installées avec succès');
} catch (err) {
  console.error('❌ Erreur lors de l\'installation:', err.message);
  process.exit(1);
}
