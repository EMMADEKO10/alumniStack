# Exigences de Déploiement - Node.js

## ⚠️ Version Node.js Requise

Ce projet nécessite **Node.js version 20.0.0 ou supérieure**.

### Vérifier votre version actuelle

```powershell
node --version
```

### Problème actuel en production

Votre environnement de production utilise actuellement **Node.js v18.20.8**, ce qui cause des avertissements et potentiellement des erreurs avec :
- AWS SDK v3 (requiert Node >= 20)
- Next.js 15.x (optimisé pour Node >= 20)
- Dépendances modernes du projet

### Solutions

#### Option 1 : Mettre à jour Node.js (Recommandé)

**Sur Windows :**
1. Téléchargez Node.js 20 LTS depuis [nodejs.org](https://nodejs.org)
2. Installez la nouvelle version
3. Vérifiez : `node --version`

**Avec nvm (Node Version Manager) :**
```powershell
nvm install 20
nvm use 20
```

#### Option 2 : Configurer votre plateforme de déploiement

**Vercel :**
- Aucune action requise (utilise Node 20+ par défaut)

**Netlify :**
- Créez un fichier `.nvmrc` à la racine avec `20` dedans
- Ou ajoutez `NODE_VERSION=20` dans les variables d'environnement

**Render / Railway / autres :**
- Configurez `NODE_VERSION=20` dans les variables d'environnement
- Ou spécifiez la version dans les paramètres de build

**GitHub Actions / CI/CD :**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

### Après mise à jour de Node.js

```powershell
# Nettoyer et réinstaller les dépendances
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

# Nettoyer le cache Next.js
Remove-Item .next -Recurse -Force

# Rebuild
npm run build
```

### Erreur TypeScript corrigée

L'erreur `Type '[boolean, Dispatch>]' must have a '[Symbol.iterator]()' method` était causée par :
- Cache TypeScript/Next.js corrompu après installation partielle des types
- Résolu en nettoyant `.next/` et en réinstallant avec Node.js 20+

### Vérification finale

```powershell
node --version    # Doit afficher v20.x.x ou supérieur
npm run build     # Doit compiler sans erreur
```
