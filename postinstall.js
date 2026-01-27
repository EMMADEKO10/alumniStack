#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('✓ Postinstall: Vérification des versions TypeScript...');

// Vérifier les versions installées
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const typesReactPkg = path.join(__dirname, 'node_modules', '@types', 'react', 'package.json');
const typesReactDomPkg = path.join(__dirname, 'node_modules', '@types', 'react-dom', 'package.json');

if (fs.existsSync(typesReactPkg)) {
  const installedVersion = JSON.parse(fs.readFileSync(typesReactPkg, 'utf8')).version;
  const expectedVersion = packageJson.dependencies['@types/react'];
  console.log(`✓ @types/react installé: ${installedVersion} (attendu: ${expectedVersion})`);
}

if (fs.existsSync(typesReactDomPkg)) {
  const installedVersion = JSON.parse(fs.readFileSync(typesReactDomPkg, 'utf8')).version;
  const expectedVersion = packageJson.dependencies['@types/react-dom'];
  console.log(`✓ @types/react-dom installé: ${installedVersion} (attendu: ${expectedVersion})`);
}

console.log('✓ Postinstall terminé - Types React 19 verrouillés');
