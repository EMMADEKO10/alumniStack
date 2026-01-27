#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Prebuild: Installation des bonnes versions de types React...');

// Chemins des types à supprimer
const typesReact = path.join(__dirname, 'node_modules', '@types', 'react');
const typesReactDom = path.join(__dirname, 'node_modules', '@types', 'react-dom');

// Supprimer les types React existants
try {
  if (fs.existsSync(typesReact)) {
    fs.rmSync(typesReact, { recursive: true, force: true });
    console.log('✓ @types/react supprimé');
  }
  if (fs.existsSync(typesReactDom)) {
    fs.rmSync(typesReactDom, { recursive: true, force: true });
    console.log('✓ @types/react-dom supprimé');
  }
} catch (err) {
  console.warn('⚠ Erreur lors de la suppression des types:', err.message);
}

// Installer les bonnes versions
try {
  console.log('📦 Installation de @types/react@18.3.12 et @types/react-dom@18.3.1...');
  execSync('npm install @types/react@18.3.12 @types/react-dom@18.3.1 --save-exact --legacy-peer-deps --no-save', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✓ Types React 18 installés avec succès');
} catch (err) {
  console.error('❌ Erreur lors de l\'installation des types:', err.message);
  process.exit(1);
}
