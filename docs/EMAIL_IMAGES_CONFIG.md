# Configuration des Images dans les Emails

## Problème
Les images (logo et icônes) ne s'affichent pas dans les emails car les clients email (Gmail, Outlook, etc.) **ne peuvent pas accéder aux fichiers locaux**. Ils ont besoin d'URLs absolues HTTPS.

## Solutions

### Option 1 : Héberger les images publiquement (RECOMMANDÉ)

1. **Déployez votre application** sur un serveur avec HTTPS (Vercel, Netlify, etc.)

2. **Configurez l'URL** dans `.env.local` :
   ```env
   NEXT_PUBLIC_APP_URL=https://votre-domaine.com
   ```

3. Les images seront automatiquement chargées depuis :
   - Logo: `https://votre-domaine.com/lau/imgi_1_Logo%20LAU-03.png`
   - Icônes: `https://votre-domaine.com/icon_reseaux_sociaux/svg/icons8-*.svg`

### Option 2 : Utiliser un service d'hébergement d'images

Uploadez vos images sur :
- **Cloudinary** (gratuit jusqu'à 25GB)
- **ImgBB**
- **GitHub** (raw.githubusercontent.com)
- **AWS S3**

Puis modifiez les URLs dans `src/utils/emailTemplates.js`.

### Option 3 : Version actuelle (Fallback)

Si `NEXT_PUBLIC_APP_URL` n'est pas en HTTPS :
- **Logo** : Affiche "LAU" dans un cercle blanc
- **Icônes sociales** : Affiche des emojis (📘 💼 ✖️ 📸)

## Configuration en Développement

Créez `.env.local` :
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note** : En développement (localhost), les images ne s'afficheront pas dans les emails. C'est normal.

## Configuration en Production

Dans votre plateforme de déploiement, configurez :
```env
NEXT_PUBLIC_APP_URL=https://alumni-lau.com
```

Les images s'afficheront automatiquement ! ✅

## Test Local

Pour tester les emails en local avec images :

1. Utilisez **ngrok** pour exposer votre localhost :
   ```bash
   ngrok http 3000
   ```

2. Copiez l'URL HTTPS fournie (ex: `https://abc123.ngrok.io`)

3. Mettez à jour `.env.local` :
   ```env
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
   ```

4. Redémarrez Next.js

## Vérification

Envoyez un email de test et vérifiez dans le code source de l'email :
- ✅ URLs commencent par `https://`
- ❌ URLs commencent par `http://localhost`

## Alternative : Images en Base64

Si vous voulez que les images fonctionnent partout sans dépendance externe, convertissez-les en Base64 et intégrez-les directement dans le HTML. **Attention** : cela augmente la taille de l'email.
