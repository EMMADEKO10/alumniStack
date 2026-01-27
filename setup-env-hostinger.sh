#!/bin/bash

# Script pour configurer les variables d'environnement sur Hostinger
# À exécuter en SSH sur le serveur

echo "🔧 Configuration des variables d'environnement pour Hostinger"
echo ""

# Demander à l'utilisateur de fournir les valeurs
echo "Veuillez fournir les valeurs suivantes :"
echo ""

read -p "MONGODB_URI (ex: mongodb+srv://...): " MONGODB_URI
read -p "NEXTAUTH_SECRET (générer avec: openssl rand -base64 32): " NEXTAUTH_SECRET
read -p "EMAIL_USER (optionnel): " EMAIL_USER
read -sp "EMAIL_PASSWORD (optionnel): " EMAIL_PASSWORD
echo ""

# Créer le fichier .env dans le répertoire de l'application
cat > .env << EOF
# Variables d'environnement - Générées le $(date)

# MongoDB Configuration
MONGODB_URI=$MONGODB_URI
MONGODB_DB_NAME=alumniprod

# NextAuth Configuration
NEXTAUTH_URL=https://alumni-launiversity.cd
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=$EMAIL_USER
EMAIL_PASSWORD=$EMAIL_PASSWORD

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME:-}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY:-}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET:-}

# Application URL
NEXT_PUBLIC_APP_URL=https://alumni-launiversity.cd

# Environment
NODE_ENV=production
EOF

echo ""
echo "✅ Fichier .env créé avec succès!"
echo ""
echo "🔄 Redémarrage de l'application..."
echo "   Exécutez: pm2 restart all"
echo "   Ou redémarrez depuis le panneau Hostinger"
echo ""
echo "🧪 Testez ensuite: https://alumni-launiversity.cd/api/health"
