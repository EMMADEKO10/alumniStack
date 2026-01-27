#!/bin/bash
# Script de build pour Hostinger - Force les bonnes versions de types React

echo "🔧 Nettoyage des types React existants..."
rm -rf node_modules/@types/react node_modules/@types/react-dom 2>/dev/null || true

echo "📦 Installation des types React 18.3.12..."
npm install @types/react@18.3.12 @types/react-dom@18.3.1 --save-exact --legacy-peer-deps --no-save

echo "🏗️ Build Next.js..."
next build
