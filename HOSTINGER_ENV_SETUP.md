# 🚨 Configuration des Variables d'Environnement sur Hostinger

## Erreurs actuelles (500/503)
Vos APIs retournent des erreurs 500 car les variables d'environnement ne sont pas configurées sur Hostinger.

## 📋 Variables OBLIGATOIRES à configurer

### 1. Dans le panneau Hostinger

Allez dans : **Sites web** > **alumni-launiversity.cd** > **Paramètres** > **Variables d'environnement**

Ajoutez ces variables :

#### MongoDB (CRITIQUE)
```
MONGODB_URI = mongodb+srv://votre-user:votre-password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
⚠️ Remplacez par votre vraie URI MongoDB Atlas

#### NextAuth (CRITIQUE)
```
NEXTAUTH_URL = https://alumni-launiversity.cd
NEXTAUTH_SECRET = [générez avec: openssl rand -base64 32]
```

Pour générer le secret :
```powershell
# Sur Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

#### Node Environment
```
NODE_ENV = production
```

### 2. Variables OPTIONNELLES (si vous utilisez ces services)

#### Cloudinary (Upload d'images)
```
CLOUDINARY_CLOUD_NAME = votre-cloud-name
CLOUDINARY_API_KEY = votre-api-key
CLOUDINARY_API_SECRET = votre-api-secret
```

#### Email (Nodemailer)
```
EMAIL_SERVER_HOST = smtp.gmail.com
EMAIL_SERVER_PORT = 587
EMAIL_SERVER_USER = votre-email@gmail.com
EMAIL_SERVER_PASSWORD = votre-mot-de-passe-app
EMAIL_FROM = noreply@alumni-launiversity.cd
```

## 🔍 Vérifier MongoDB

1. **MongoDB Atlas** : https://cloud.mongodb.com
2. Cliquez sur **Connect** > **Drivers**
3. Copiez l'URI et remplacez `<password>` par votre vrai mot de passe
4. Ajoutez l'IP de Hostinger à la whitelist (ou `0.0.0.0/0` pour autoriser toutes les IPs)

## 🔄 Après configuration

1. Sauvegardez toutes les variables dans Hostinger
2. Cliquez sur **Redéployer**
3. Vérifiez les logs : les erreurs 500 devraient disparaître

## 🛠️ Déboguer

Si les erreurs persistent après configuration :

1. Vérifiez les logs de build Hostinger
2. Testez votre URI MongoDB :
```powershell
# Localement
$env:MONGODB_URI="votre-uri"
npm run dev
```

3. Vérifiez que Hostinger peut accéder à MongoDB Atlas (whitelist IP)
