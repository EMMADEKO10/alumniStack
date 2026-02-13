# 🚨 FIX URGENT - URL 0.0.0.0:3000 en Production

## Problème
Les emails de vérification contiennent `https://0.0.0.0:3000` au lieu de `https://alumni-launiversity.cd`

## ✅ Solution Appliquée

### Modifications du Code
1. ✅ Ajout de logs de debug détaillés dans `/api/auth/register`
2. ✅ Ajout de logs de debug dans `/api/auth/verify`
3. ✅ Utilisation de `APP_URL` (variable serveur) au lieu de `NEXT_PUBLIC_APP_URL`
4. ✅ Amélioration de la détection des headers (`x-forwarded-host`, `x-forwarded-proto`)
5. ✅ Logique de fallback robuste

---

## 📋 ACTIONS REQUISES SUR HOSTINGER

### Étape 1 : Ajouter laVariable `APP_URL`

**Sur l'interface de Hostinger Web Site**, ajoutez cette nouvelle variable :

```
Variable: APP_URL
Valeur: https://alumni-launiversity.cd
```

⚠️ **IMPORTANT** : Pas de `/` à la fin de l'URL !

### Étape 2 : Vérifier les Variables Existantes

Assurez-vous que ces variables sont correctement définies :

```
NODE_ENV=production
NEXTAUTH_URL=https://alumni-launiversity.cd
NEXT_PUBLIC_APP_URL=https://alumni-launiversity.cd
APP_URL=https://alumni-launiversity.cd
```

### Étape 3 : Redéployer l'Application

**CRITIQUE** : Vous devez redéployer pour que les changements de code prennent effet.

#### Option A : Via Git (Recommandé)
```bash
# Sur votre machine locale
git add .
git commit -m "Fix: Correction URL 0.0.0.0 en production"
git push origin main

# Sur Hostinger, pull les changements
cd /home/votre-user/public_html/alumniPlatform
git pull origin main
npm install
npm run build
pm2 restart all
```

#### Option B : Upload Manuel
1. Uploadez les fichiers modifiés via FTP/SFTP
2. Connectez-vous en SSH
3. Executez :
```bash
cd /home/votre-user/public_html/alumniPlatform
npm install
npm run build
pm2 restart all
```

### Étape 4 : Vérifier les Logs

Après redémarrage, testez une inscription et vérifiez les logs :

```bash
pm2 logs --lines 100
```

Vous devriez voir :
```
📧 Construction URL de vérification:
  - APP_URL: https://alumni-launiversity.cd
  - NEXTAUTH_URL: https://alumni-launiversity.cd
  - NEXT_PUBLIC_APP_URL: https://alumni-launiversity.cd
  - NODE_ENV: production
✅ URL finale de vérification: https://alumni-launiversity.cd/api/auth/verify?token=...
```

### Étape 5 : Tester

1. Créez un nouveau compte avec un email test
2. Vérifiez l'email reçu
3. Le lien doit être : `https://alumni-launiversity.cd/api/auth/verify?token=...`
4. **PAS** : `https://0.0.0.0:3000/...`

---

## 🔍 Diagnostic des Problèmes

### Si vous voyez toujours `0.0.0.0` dans les logs

**Vérifiez** :
1. ✅ La variable `APP_URL` est bien définie sur Hostinger
2. ✅ Vous avez bien fait `npm run build` après l'ajout de la variable
3. ✅ Vous avez bien redémarré l'application : `pm2 restart all`
4. ✅ Les logs montrent bien la valeur de `APP_URL`

### Si `APP_URL` est `undefined` dans les logs

**Solutions** :
```bash
# Vérifier que la variable est dans l'environnement
pm2 restart all --update-env

# Ou redémarrer complètement PM2
pm2 delete all
pm2 start ecosystem.config.js

# Ou relancer manuellement
pm2 start npm --name "alumni" -- start
```

### Si le problème persiste

**Procédure de Debug** :

1. Arrêtez PM2 :
```bash
pm2 stop all
```

2. Lancez l'application en mode direct pour voir les logs :
```bash
cd /home/votre-user/public_html/alumniPlatform
NODE_ENV=production APP_URL=https://alumni-launiversity.cd npm start
```

3. Dans un autre terminal, testez une inscription

4. Vérifiez les logs qui s'affichent

5. Une fois confirmé que ça fonctionne, relancez avec PM2 :
```bash
# Ctrl+C pour arrêter
pm2 start npm --name "alumni" -- start
```

---

## 📊 Variables à Définir sur Hostinger

Récapitulatif complet des variables à définir dans l'interface Hostinger :

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `NODE_ENV` | `production` | ✅ OUI |
| `APP_URL` | `https://alumni-launiversity.cd` | ✅ OUI |
| `NEXTAUTH_URL` | `https://alumni-launiversity.cd` | ✅ OUI |
| `NEXT_PUBLIC_APP_URL` | `https://alumni-launiversity.cd` | ✅ OUI |
| `NEXTAUTH_SECRET` | `votre-secret-unique` | ✅ OUI |
| `JWT_SECRET` | `votre-jwt-secret` | ✅ OUI |
| `MONGODB_URI` | `mongodb+srv://...` | ✅ OUI |
| `ARAKA_CALLBACK_URL` | `https://alumni-launiversity.cd/checkout/payment` | ✅ OUI |

---

## 🎯 Checklist de Vérification

- [ ] Variable `APP_URL` ajoutée sur Hostinger
- [ ] Code modifié déployé sur le serveur
- [ ] `npm run build` exécuté
- [ ] `pm2 restart all` exécuté
- [ ] Logs vérifiés : `pm2 logs`
- [ ] Test d'inscription effectué
- [ ] Email reçu vérifié
- [ ] URL dans l'email est correcte (pas de 0.0.0.0)
- [ ] Lien de vérification fonctionne

---

## 💡 Pourquoi `APP_URL` au lieu de `NEXT_PUBLIC_APP_URL` ?

1. **`NEXT_PUBLIC_*`** : Variables intégrées au **build** (côté client)
   - Si changées après le build, pas prises en compte
   - Nécessite un rebuild complet

2. **`APP_URL`** : Variable **serveur** (runtime)
   - Lue à chaque requête API
   - Peut être changée sans rebuild
   - Plus flexible pour les routes API

3. **Ordre de priorité dans le code** :
   ```typescript
   APP_URL → NEXTAUTH_URL → NEXT_PUBLIC_APP_URL → Headers
   ```

---

## 📞 Support

Si après toutes ces étapes le problème persiste :

1. Copiez les logs : `pm2 logs --lines 200 > debug.log`
2. Vérifiez les variables : `pm2 env 0`
3. Contactez le support avec ces informations

---

**Date de création** : 13 février 2026  
**Dernière mise à jour** : 13 février 2026
