# Configuration Hostinger - Node.js 20

## 🎯 Étapes pour configurer Node.js 20 sur Hostinger

### 1. Accéder aux paramètres Node.js

Dans votre panneau Hostinger :
1. Allez dans **Sites web** > Sélectionnez `alumni-launiversity.cd`
2. Cliquez sur **Paramètres et redéploiement** (⚙️)
3. Cherchez **"Version Node.js"** dans les paramètres de compilation

### 2. Changer la version Node.js

**Option A : Via l'interface Hostinger**
- Dans "Paramètres de compilation et de sortie", trouvez **"Version Node.js"**
- Changez de `18.x` à `20.x` ou `20`
- Cliquez sur **Enregistrer les paramètres**

**Option B : Via variables d'environnement**
- Ajoutez une variable d'environnement :
  - Nom : `NODE_VERSION`
  - Valeur : `20`

### 3. Fichiers créés pour auto-détection

J'ai créé deux fichiers à la racine de votre projet :
- `.nvmrc` → contient `20`
- `.node-version` → contient `20`

Ces fichiers permettent à Hostinger de détecter automatiquement la version Node requise.

### 4. Redéployer

Après avoir changé la version :
1. Cliquez sur **"Redéployer"** (bouton rouge dans votre capture d'écran)
2. Hostinger va :
   - Réinstaller les dépendances avec Node 20
   - Rebuild le projet
   - Déployer avec la bonne version

### 5. Vérification

Après le redéploiement, vous devriez voir dans les détails :
```
Version Node.js : 20.x
```

au lieu de `18.x`

## 🔧 Si le problème persiste

### Option 1 : Contacter le support Hostinger
Si l'interface ne propose pas Node.js 20, contactez le support Hostinger pour :
- Activer Node.js 20 sur votre plan d'hébergement
- Vérifier la compatibilité avec votre formule

### Option 2 : Utiliser un buildpack personnalisé
Certains hébergeurs Hostinger permettent de spécifier un buildpack Node.js personnalisé.

### Option 3 : Migration vers Vercel/Netlify (Recommandé)
Si Hostinger ne supporte pas Node.js 20 :
- **Vercel** : Support natif Node 20, déploiement Git automatique, gratuit pour projets perso
- **Netlify** : Même chose, gratuit avec détection auto de `.nvmrc`

## 📋 Checklist avant redéploiement

- ✅ Fichiers `.nvmrc` et `.node-version` créés
- ⏳ Version Node.js changée à 20 dans Hostinger
- ⏳ Cliquer sur "Redéployer"
- ⏳ Vérifier que la compilation réussit

## 🚨 Si Node 20 n'est pas disponible sur Hostinger

Hostinger Business/Premium supporte généralement Node 20+. Si votre plan ne le supporte pas :

**Solution temporaire : Downgrade des dépendances**
(Non recommandé, car Next.js 15 et React 19 sont optimisés pour Node 20)

**Solution recommandée : Changer d'hébergeur**
Vercel et Netlify sont spécialisés pour Next.js et offrent :
- Node.js 20+ par défaut
- Déploiement automatique depuis Git
- CDN global
- Plan gratuit suffisant pour votre usage
