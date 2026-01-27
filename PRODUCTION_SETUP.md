# Configuration de Production - Hostinger

## ⚠️ Erreurs 500 en Production

Si vous obtenez des erreurs 500 sur les routes API (`/api/events`, `/api/opportunities`, `/api/auth/session`), c'est que **les variables d'environnement ne sont pas configurées** sur le serveur Hostinger.

## 📋 Variables d'Environnement Requises

### 1. Accéder aux Variables d'Environnement sur Hostinger

1. Connectez-vous à votre panneau Hostinger : https://hpanel.hostinger.com
2. Allez dans **Sites Web** > **alumni-launiversity.cd**
3. Dans le menu latéral, cliquez sur **Paramètres avancés**
4. Trouvez la section **Variables d'environnement**
5. Cliquez sur **+ Ajouter une nouvelle variable**

### 2. Variables à Configurer

Ajoutez **toutes** ces variables une par une :

#### Base de données MongoDB (OBLIGATOIRE)
```
Nom: MONGODB_URI
Valeur: mongodb+srv://votre-username:votre-password@cluster.mongodb.net/alumniprod?retryWrites=true&w=majority
```

```
Nom: MONGODB_DB_NAME
Valeur: alumniprod
```

#### Configuration de l'Application
```
Nom: NEXT_PUBLIC_APP_URL
Valeur: https://alumni-launiversity.cd
```

```
Nom: NEXTAUTH_URL
Valeur: https://alumni-launiversity.cd
```

```
Nom: NEXTAUTH_SECRET
Valeur: [générer une clé secrète forte - voir ci-dessous]
```

#### Configuration Email (pour les notifications)
```
Nom: EMAIL_HOST
Valeur: smtp.gmail.com
```

```
Nom: EMAIL_PORT
Valeur: 587
```

```
Nom: EMAIL_USER
Valeur: votre-email@gmail.com
```

```
Nom: EMAIL_PASSWORD
Valeur: votre-mot-de-passe-app-gmail
```

```
Nom: NODE_ENV
Valeur: production
```

### 3. Générer NEXTAUTH_SECRET

Exécutez cette commande dans votre terminal local pour générer une clé secrète :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ou utilisez :
```bash
openssl rand -base64 32
```

Copiez le résultat et utilisez-le comme valeur pour `NEXTAUTH_SECRET`.

## 🔄 Après Configuration

### 1. Redémarrer l'Application

Après avoir ajouté toutes les variables :

1. Allez dans **Sites Web** > **alumni-launiversity.cd**
2. Cliquez sur **Redémarrer** en haut à droite
3. Attendez 30-60 secondes que le serveur redémarre

### 2. Vérifier les Logs

1. Dans Hostinger, allez dans **Sites Web** > **alumni-launiversity.cd**
2. Cliquez sur **Logs** dans le menu latéral
3. Consultez les **Logs d'erreur** pour voir s'il reste des problèmes

### 3. Tester les Endpoints

Ouvrez votre navigateur et testez ces URLs :

- ✅ https://alumni-launiversity.cd/api/health (doit retourner {"status": "ok"})
- ✅ https://alumni-launiversity.cd/api/events (doit retourner la liste des événements)
- ✅ https://alumni-launiversity.cd/api/opportunities (doit retourner les opportunités)

## 🔧 Initialiser les Index MongoDB (IMPORTANT)

Après avoir configuré les variables, connectez-vous en SSH à Hostinger et exécutez :

```bash
cd ~/domains/alumni-launiversity.cd/public_html
npm run db:init
```

Ou si vous n'avez pas accès SSH, ajoutez un appel à `ensureIndexes()` dans votre route API de santé.

## 🐛 Résolution des Problèmes Courants

### Erreur : "MONGODB_URI manquante"
- ✅ Vérifiez que vous avez bien ajouté `MONGODB_URI` dans les variables d'environnement Hostinger
- ✅ Redémarrez l'application après l'ajout
- ✅ Vérifiez que la chaîne de connexion MongoDB est correcte (pas d'espaces, mot de passe encodé)

### Erreur : "CLIENT_FETCH_ERROR" (NextAuth)
- ✅ Ajoutez `NEXTAUTH_URL` avec votre URL de production
- ✅ Ajoutez `NEXTAUTH_SECRET` avec une clé forte
- ✅ Redémarrez l'application

### Erreur : "Network timeout" ou "Connection refused"
- ✅ Vérifiez que votre cluster MongoDB Atlas autorise les connexions depuis n'importe quelle IP (0.0.0.0/0)
- ✅ Allez dans MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere

### Pages 404 (/conditions, /faq, etc.)
- Ces pages n'existent pas encore, ce n'est pas un problème critique
- Vous pouvez les créer plus tard ou retirer les liens du footer

## 📊 Monitoring

### Vérifier les Performances

Ajoutez cette route pour surveiller les performances :

```
https://alumni-launiversity.cd/api/health
```

Elle retournera :
- Status de la connexion MongoDB
- Temps de réponse
- État du cache
- Nombre d'index créés

## 🚀 Checklist de Déploiement

- [ ] Toutes les variables d'environnement ajoutées sur Hostinger
- [ ] `MONGODB_URI` correctement configurée
- [ ] `NEXTAUTH_SECRET` générée et ajoutée
- [ ] Application redémarrée sur Hostinger
- [ ] MongoDB Atlas autorise les connexions depuis 0.0.0.0/0
- [ ] Index MongoDB créés avec `npm run db:init`
- [ ] Tests des endpoints API (events, opportunities, health)
- [ ] Connexion NextAuth fonctionne
- [ ] Logs d'erreur vérifiés sur Hostinger

## 📞 Support

Si vous avez toujours des problèmes après avoir suivi ce guide :

1. Exportez les logs de Hostinger
2. Vérifiez la console du navigateur (F12) pour plus de détails
3. Testez la connexion MongoDB avec `mongosh` en local avec la même URI

---

**Note** : Ne commitez JAMAIS vos variables d'environnement dans Git. Le fichier `.env` doit rester dans `.gitignore`.
