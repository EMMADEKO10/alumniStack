# Configuration des Variables d'Environnement en Production

## ⚠️ Problèmes Identifiés

### 1. Erreur d'hydratation React
**Symptôme**: Message d'erreur "A tree hydrated but some attributes of the server rendered HTML didn't match"

**Cause**: Les composants `framer-motion` ajoutaient des `data-has-listeners` côté client qui créaient un mismatch avec le rendu serveur.

**Solution appliquée**: 
- ✅ Suppression de `framer-motion` de la page d'inscription
- ✅ Utilisation de divs simples au lieu de `motion.div`

---

### 2. URL invalide dans les emails de vérification (0.0.0.0:3000)
**Symptôme**: Lors du clic sur "Confirmer mon inscription", redirection vers `https://0.0.0.0:3000/login?error=invalid_or_expired`

**Cause**: La variable `NEXT_PUBLIC_APP_URL` n'était pas correctement configurée en production

**Solution appliquée**:
- ✅ Amélioration de la logique de détection d'URL dans `/api/auth/register`
- ✅ Priorisation de `NEXT_PUBLIC_APP_URL` sur `origin`
- ✅ Correction automatique de `0.0.0.0` vers `localhost` en développement
- ✅ Utilisation cohérente de `NEXT_PUBLIC_APP_URL` dans `/api/auth/verify`

---

## 🔧 Configuration Requise sur Hostinger

### Fichier `.env` en production

Créez ou modifiez le fichier `.env` sur votre serveur Hostinger avec les variables suivantes :

```bash
# ========================================
# CONFIGURATION MONGODB
# ========================================
MONGODB_URI=mongodb+srv://admin:k8E3oyHBD8UgIRha@cluster0.bhckvli.mongodb.net/alumni?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=alumniprod

# ========================================
# CONFIGURATION NEXTAUTH & URL
# ========================================
# ⚠️ CRITIQUE : Variable pour les routes API côté serveur
APP_URL=https://alumni-launiversity.cd

# ⚠️ IMPORTANT : URL NextAuth (même valeur que APP_URL)
NEXTAUTH_URL=https://alumni-launiversity.cd

# ⚠️ IMPORTANT : URL publique (intégrée au build)
NEXT_PUBLIC_APP_URL=https://alumni-launiversity.cd

# Secrets de sécurité (à générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET=a5d9f7c2e1b3a8f6d4c7e9b2a5f8c1d3
JWT_SECRET=b2c4f6a8d1e3c5b7a9f2d4e6c8a1b3d5

# Environnement
NODE_ENV=production

# ========================================
# CONFIGURATION CLOUDINARY
# ========================================
CLOUDINARY_CLOUD_NAME=dzhpaf2vw
CLOUDINARY_API_KEY=774968294321134
CLOUDINARY_API_SECRET=3M2Ak3_5IPmYHdqlCTulI8G-gmE

# ========================================
# CONFIGURATION ARAKA PAY
# ========================================
ARAKA_EMAIL=contact@mabele-coop.com
ARAKA_PASSWORD=contact@mabele-coop.com
ARAKA_API_URL=https://araka-api-uat.azurewebsites.net/api
ARAKA_PAYMENT_PAGE_ID=ADC699C3-4099-4363-AFF7-D475BD076621
# ⚠️ IMPORTANT : Remplacez par votre URL de production + /checkout/payment
ARAKA_CALLBACK_URL=https://votre-domaine.com/checkout/payment

# ========================================
# CONFIGURATION EMAIL (Si utilisé)
# ========================================
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=votre-email@gmail.com
# SMTP_PASS=votre-mot-de-passe-application
```

---

## 📋 Étapes de Déploiement sur Hostinger

### 1. Accéder au serveur
```bash
ssh utilisateur@votre-serveur-hostinger.com
```

### 2. Naviguer vers le répertoire de l'application
```bash
cd /home/utilisateur/public_html/alumniPlatform
# ou selon votre installation
```

### 3. Créer/Modifier le fichier .env
```bash
nano .env
```

### 4. Copier la configuration ci-dessus et MODIFIER :
- ✏️ **NEXT_PUBLIC_APP_URL** : Votre URL de production (ex: `https://alumni.lau.edu`)
- ✏️ **NEXTAUTH_URL** : Même URL que ci-dessus
- ✏️ **ARAKA_CALLBACK_URL** : Votre URL + `/checkout/payment`
- ✏️ **NODE_ENV** : Mettre `production`

### 5. Sauvegarder et quitter
- Appuyez sur `Ctrl + X`
- Tapez `Y` pour confirmer
- Appuyez sur `Entrée`

### 6. Rebuild l'application
```bash
npm run build
```

### 7. Redémarrer le serveur Node.js
```bash
# Si vous utilisez PM2
pm2 restart all

# Ou
pm2 restart alumni-platform

# Si vous utilisez un autre gestionnaire de processus, ajustez en conséquence
```

---

## ✅ Vérification

### 1. Tester l'inscription
1. Allez sur `https://votre-domaine.com/register`
2. Créez un nouveau compte
3. Vérifiez votre email
4. Le lien doit pointer vers `https://votre-domaine.com/api/auth/verify?token=...`
5. ⚠️ **Le lien ne doit PAS contenir `0.0.0.0` ou `localhost`**

### 2. Vérifier les logs
```bash
# Si vous utilisez PM2
pm2 logs

# Rechercher des erreurs liées à l'URL
```

### 3. Tester la vérification d'email
1. Cliquez sur le lien dans l'email
2. Vous devriez être redirigé vers `/login?verified=1&next=/profile/complete`
3. Connectez-vous et vous devriez aller sur la page de complétion de profil

---

## 🚨 Dépannage

### Le lien contient toujours `0.0.0.0` ou `localhost`
**Solution** : 
1. Vérifiez que `NEXT_PUBLIC_APP_URL` est bien défini dans `.env`
2. Rebuild l'application : `npm run build`
3. Redémarrez le serveur : `pm2 restart all`
4. Videz le cache du navigateur

### L'erreur "invalid_or_expired" persiste
**Causes possibles** :
1. Le token a expiré (validité : 24h)
2. L'utilisateur a déjà été vérifié
3. Problème de connexion à MongoDB

**Solutions** :
1. Demandez à renvoyer un nouvel email de vérification
2. Vérifiez les logs du serveur : `pm2 logs`
3. Vérifiez la connexion MongoDB

### L'erreur d'hydratation React persiste
**Causes possibles** :
1. Extensions de navigateur (React DevTools, etc.)
2. Cache du navigateur

**Solutions** :
1. Testez en mode navigation privée
2. Désactivez temporairement les extensions
3. Videz le cache : `Ctrl + F5`

---

## 📝 Notes Importantes

1. **Ne JAMAIS commit le fichier .env** dans Git
2. **Générer de nouveaux secrets** pour la production (voir commande ci-dessus)
3. **Utilisez HTTPS en production** - requis pour NextAuth
4. **Vérifiez que l'URL ne se termine PAS par `/`**
   - ✅ Correct : `https://alumni.lau.edu`
   - ❌ Incorrect : `https://alumni.lau.edu/`

---

## 🔐 Génération de Secrets Sécurisés

Pour générer de nouveaux secrets pour la production :

```bash
# Générer NEXTAUTH_SECRET
openssl rand -base64 32

# Générer JWT_SECRET
openssl rand -base64 32
```

Copiez les résultats dans votre fichier `.env` de production.

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs : `pm2 logs`
2. Vérifiez la configuration : `cat .env` (⚠️ ne partagez JAMAIS le contenu publiquement)
3. Testez la connexion MongoDB
4. Vérifiez que le port est bien ouvert et accessible

---

**Dernière mise à jour** : 13 février 2026
