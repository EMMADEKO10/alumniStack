# 🚨 SOLUTION : Variables d'environnement non détectées sur Hostinger

## Problème Identifié

Les variables d'environnement sont configurées dans le panneau Hostinger mais **ne sont pas accessibles par Next.js**. Cela affecte :
- `/api/health` - Montre "❌ Manquante" pour toutes les variables
- `/api/events` - Erreur MONGODB_URI manquante
- `/api/opportunities` - Erreur MONGODB_URI manquante

## ✅ Solution 1 : Créer un fichier .env sur le serveur (RECOMMANDÉ)

### Via SSH (si vous avez accès)

1. **Connectez-vous en SSH** à votre serveur Hostinger

2. **Allez dans le répertoire de l'application** :
```bash
cd ~/domains/alumni-launiversity.cd/public_html
```

3. **Créez le fichier .env** :
```bash
nano .env
```

4. **Copiez-collez ce contenu** (remplacez les valeurs) :
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:k8E3oyHBD8UglRha@cluster0.bhckvli.mongodb.net/alumniprod?retryWrites=true&w=majority
MONGODB_DB_NAME=alumniprod

# NextAuth Configuration
NEXTAUTH_URL=https://alumni-launiversity.cd
NEXTAUTH_SECRET=a5d9f7c2e1b3a8f6d4c7e9b2a5f8c1d3

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dzhpaf2vw
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=3M2Ak3_5IPmYHdqlCTulI8G-gmE

# Email Configuration (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe

# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://alumni-launiversity.cd
```

5. **Sauvegardez** (CTRL+O, ENTER, CTRL+X)

6. **Redémarrez l'application** :
```bash
pm2 restart all
# OU
touch tmp/restart.txt
```

### Via File Manager Hostinger (si pas d'accès SSH)

1. **Allez dans Hostinger** : Fichiers > File Manager
2. **Naviguez vers** : `domains/alumni-launiversity.cd/public_html`
3. **Créez un nouveau fichier** nommé `.env`
4. **Collez le contenu** ci-dessus avec vos vraies valeurs
5. **Sauvegardez**
6. **Redémarrez** l'application depuis Sites web > Redémarrer

## ✅ Solution 2 : Utiliser .htaccess pour injecter les variables

Si le fichier `.env` ne fonctionne pas, créez un fichier `.htaccess` :

```apache
<IfModule mod_env.c>
  SetEnv MONGODB_URI "mongodb+srv://admin:k8E3oyHBD8UglRha@cluster0.bhckvli.mongodb.net/alumniprod"
  SetEnv NEXTAUTH_SECRET "a5d9f7c2e1b3a8f6d4c7e9b2a5f8c1d3"
  SetEnv NEXTAUTH_URL "https://alumni-launiversity.cd"
  SetEnv NODE_ENV "production"
  SetEnv CLOUDINARY_CLOUD_NAME "dzhpaf2vw"
  SetEnv CLOUDINARY_API_SECRET "3M2Ak3_5IPmYHdqlCTulI8G-gmE"
</IfModule>
```

## ✅ Solution 3 : Vérifier la configuration Hostinger Node.js

1. **Panneau Hostinger** > Sites web > alumni-launiversity.cd
2. **Configuration avancée** > **Node.js**
3. Vérifiez que :
   - Version Node.js : **20.x ou supérieur**
   - Point d'entrée : `server.js` ou `npm start`
   - Répertoire de l'application : `public_html`

## 🔍 Vérification

Après avoir appliqué une solution, testez :

```bash
curl https://alumni-launiversity.cd/api/health
```

Vous devriez voir :
```json
{
  "status": "OK",
  "env_check": {
    "MONGODB_URI": "✅ Définie",
    "NEXTAUTH_SECRET": "✅ Définie",
    "NEXTAUTH_URL": "✅ Définie"
  },
  "database": {
    "status": "✅ Connectée"
  }
}
```

## 🐛 Dépannage

### Les variables sont toujours manquantes

1. **Vérifiez le fichier .env existe** :
```bash
cd ~/domains/alumni-launiversity.cd/public_html
ls -la .env
cat .env
```

2. **Vérifiez les permissions** :
```bash
chmod 644 .env
```

3. **Forcez le redémarrage** :
```bash
pm2 restart all --update-env
# OU depuis Hostinger
killall node
```

### L'application ne démarre pas

1. **Consultez les logs** :
```bash
pm2 logs
# OU sur Hostinger
Sites web > Logs > Logs d'erreur
```

2. **Vérifiez que Node.js est bien configuré** :
```bash
node --version  # Doit être >= 20.0.0
npm --version
```

## 📝 Checklist Finale

- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Valeurs correctes (pas d'espaces, guillemets corrects)
- [ ] Application redémarrée
- [ ] `/api/health` retourne "✅ Définie" pour toutes les variables
- [ ] `/api/events` fonctionne sans erreur
- [ ] `/api/opportunities` fonctionne sans erreur
- [ ] MongoDB Atlas autorise les connexions (0.0.0.0/0)

## ⚡ Commande Rapide (avec vos vraies valeurs)

```bash
cd ~/domains/alumni-launiversity.cd/public_html && \
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://admin:k8E3oyHBD8UglRha@cluster0.bhckvli.mongodb.net/alumniprod?retryWrites=true&w=majority
MONGODB_DB_NAME=alumniprod
NEXTAUTH_URL=https://alumni-launiversity.cd
NEXTAUTH_SECRET=a5d9f7c2e1b3a8f6d4c7e9b2a5f8c1d3
CLOUDINARY_CLOUD_NAME=dzhpaf2vw
CLOUDINARY_API_SECRET=3M2Ak3_5IPmYHdqlCTulI8G-gmE
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://alumni-launiversity.cd
EOF
pm2 restart all
```

---

**Note Importante** : Ne committez JAMAIS le fichier `.env` avec de vraies valeurs dans Git !
