# 🚨 Erreurs 500 en Production - Solution Rapide

## Problème
Vous obtenez des erreurs 500 sur :
- `/api/events`
- `/api/opportunities`  
- `/api/auth/session`

## ✅ Solution en 5 Minutes

### Étape 1 : Configurer MongoDB URI sur Hostinger

1. Allez sur https://hpanel.hostinger.com
2. **Sites Web** → **alumni-launiversity.cd** → **Paramètres avancés**
3. **Variables d'environnement** → **+ Ajouter**

Ajoutez ces 3 variables **OBLIGATOIRES** :

```
MONGODB_URI = mongodb+srv://votre-username:votre-password@cluster.mongodb.net/alumniprod
NEXTAUTH_SECRET = [générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"]
NEXTAUTH_URL = https://alumni-launiversity.cd
```

### Étape 2 : Autoriser les Connexions MongoDB

1. Allez sur https://cloud.mongodb.com
2. **Network Access** → **Add IP Address**
3. Cliquez sur **Allow Access from Anywhere**
4. IP Address: `0.0.0.0/0`
5. Cliquez sur **Confirm**

### Étape 3 : Redémarrer l'Application

1. Retournez sur Hostinger
2. **Sites Web** → **alumni-launiversity.cd**
3. Cliquez sur le bouton **Redémarrer** (en haut à droite)
4. Attendez 30 secondes

### Étape 4 : Tester

Ouvrez dans votre navigateur :
```
https://alumni-launiversity.cd/api/health
```

Vous devriez voir :
```json
{
  "status": "OK",
  "database": {
    "status": "✅ Connectée"
  }
}
```

## 🔍 Vérification Détaillée

Pour un diagnostic complet, consultez : [`PRODUCTION_SETUP.md`](./PRODUCTION_SETUP.md)

## ⚡ Commandes Utiles

### Générer NEXTAUTH_SECRET (local)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Initialiser les Index MongoDB (si vous avez SSH)
```bash
cd ~/domains/alumni-launiversity.cd/public_html
npm run db:init
```

## 📞 Si ça ne marche toujours pas

1. Vérifiez les **Logs d'erreur** sur Hostinger (Sites Web → Logs)
2. Ouvrez la console du navigateur (F12) et regardez les erreurs
3. Vérifiez que `MONGODB_URI` ne contient pas d'espaces ni de caractères spéciaux non encodés

---

**Important** : Après avoir ajouté les variables, **redémarrez toujours** l'application !
