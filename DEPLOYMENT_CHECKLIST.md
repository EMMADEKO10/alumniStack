# Checklist de Déploiement - Alumni Platform

## Configuration MongoDB en Production

### 1. Variables d'Environnement Requises

Assurez-vous que ces variables sont définies dans votre environnement de production :

```bash
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.bhckvli.mongodb.net/alumni?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=alumni
NODE_ENV=production
```

### 2. MongoDB Atlas - Configuration Réseau

**IMPORTANT**: Vérifiez que l'adresse IP de votre serveur de production est autorisée dans MongoDB Atlas :

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com)
2. Allez dans **Network Access** (Accès réseau)
3. Ajoutez l'adresse IP de votre serveur de production
   - Pour les hébergeurs avec IP dynamique, vous pouvez temporairement autoriser `0.0.0.0/0` (toutes les IP)
   - **⚠️ ATTENTION**: Autoriser toutes les IP est un risque de sécurité. Utilisez uniquement pour le diagnostic.

### 3. Test de Connexion

Une fois déployé, testez la connexion avec :

```
https://alumni-launiversity.cd/api/test-db
```

Cette route retournera :
- ✅ Le statut de connexion
- ✅ La liste des collections disponibles
- ❌ Les erreurs de connexion détaillées

### 4. Vérification des Logs

Après le déploiement, vérifiez les logs de votre serveur pour voir :

```
🔄 Nouvelle connexion MongoDB initialisée
🔌 Tentative de connexion à MongoDB...
✅ Connexion MongoDB établie
📊 Utilisation de la base de données: alumni
```

Si vous voyez des erreurs, elles seront préfixées par ❌

### 5. Erreurs Courantes et Solutions

#### Erreur 503 - Service Unavailable

**Causes possibles:**
- L'IP du serveur n'est pas autorisée dans MongoDB Atlas
- La chaîne de connexion MONGODB_URI est incorrecte
- Le mot de passe contient des caractères spéciaux non encodés
- Le cluster MongoDB est en pause ou inaccessible

**Solutions:**
1. Vérifiez l'accès réseau dans MongoDB Atlas
2. Encodez les caractères spéciaux du mot de passe (utilisez `encodeURIComponent()`)
3. Vérifiez que le cluster est actif dans MongoDB Atlas
4. Testez la connexion avec `/api/test-db`

#### Timeout de Connexion

**Solutions:**
- Les timeouts sont maintenant configurés à 30 secondes
- Vérifiez que votre serveur peut accéder à Internet
- Testez la connexion manuellement avec mongosh

### 6. Monitoring

Pour surveiller les performances :

```bash
# Nombre de connexions actives
# Temps de réponse des requêtes
# Erreurs 503 dans les logs
```

### 7. Variables d'Environnement Complètes

Voici toutes les variables nécessaires pour la production :

```bash
# MongoDB
MONGODB_URI=votre_uri_mongodb_atlas
MONGODB_DB_NAME=alumni

# NextAuth
NEXTAUTH_URL=https://alumni-launiversity.cd
NEXTAUTH_SECRET=votre_secret_aleatoire_tres_long

# Email (Nodemailer)
EMAIL_SERVER_HOST=smtp.votre-service.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre_email
EMAIL_SERVER_PASSWORD=votre_password
EMAIL_FROM=noreply@alumni-launiversity.cd

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Application
NODE_ENV=production
```

## Commandes de Déploiement

```bash
# 1. Construire l'application
npm run build

# 2. Démarrer en production
npm start

# Ou via PM2 (recommandé)
pm2 start npm --name "alumni-platform" -- start
pm2 save
pm2 startup
```

## Résolution de Problèmes

### Si l'API /api/alumni retourne toujours 503

1. **Vérifiez les logs du serveur** pour voir les messages de diagnostic
2. **Testez la route** `/api/test-db` pour isoler le problème MongoDB
3. **Vérifiez l'accès réseau** dans MongoDB Atlas
4. **Vérifiez la variable** `MONGODB_URI` dans l'environnement de production
5. **Redémarrez le serveur** après avoir modifié les variables d'environnement

### Contact Support

Si le problème persiste, collectez ces informations :
- Logs complets du serveur
- Réponse de `/api/test-db`
- Configuration réseau MongoDB Atlas (sans les credentials)
- Messages d'erreur exacts du navigateur
