# Optimisations de la Base de Données

## 🚀 Améliorations Implémentées

### 1. **Connection Pooling Optimisé**
- Pool de connexions augmenté : 10 → 50 connexions simultanées
- Pool minimum maintenu : 10 connexions actives en permanence
- Timeout réduits pour détecter rapidement les problèmes
- Réutilisation intelligente des connexions avec cache global

### 2. **Système de Cache en Mémoire**
- Cache automatique des requêtes fréquentes
- TTL (Time To Live) configurable par requête
- Nettoyage automatique des entrées expirées
- Invalidation du cache après mutations

### 3. **Index de Base de Données**
Index créés automatiquement pour améliorer les performances :
- `users`: email (unique), createdAt, role
- `alumni`: userId (unique), isVerified, graduationYear, fieldOfStudy
- `formations`: startDate, level, createdAt
- `events`: date, createdAt
- `opportunities`: createdAt, type, deadline
- `stories`: createdAt, isPublished
- `donations`: createdAt, status, userId

### 4. **Pagination Optimisée**
- Limite par défaut: 20 résultats
- Skip/Limit pour éviter de charger toutes les données
- Support des paramètres `page` et `limit` dans les URLs

### 5. **Compression des Données**
- Compression zlib activée pour réduire la latence réseau
- Niveau de compression: 6 (équilibre performance/taille)

### 6. **Préférence de Lecture**
- `primaryPreferred`: lecture depuis le serveur principal d'abord
- Basculement automatique vers les secondaires si nécessaire

## 📋 Utilisation

### Initialiser les Index
```bash
npm run init-db
```

### Utiliser les Helpers Optimisés

#### Dans vos routes API :
```typescript
import { optimizedQuery, optimizedFindOne, apiHandler } from '@/lib/api-helpers';

export const GET = apiHandler(async (request: Request) => {
  // Requête avec cache automatique et pagination
  const users = await optimizedQuery(
    'users',
    { role: 'alumni' },
    {
      cache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      pagination: { page: 1, limit: 20 },
      sort: { createdAt: -1 }
    }
  );

  return NextResponse.json({ users });
});
```

#### Invalider le Cache après Mutation :
```typescript
import { invalidateCache } from '@/lib/api-helpers';

// Après une création/mise à jour
await db.collection('users').insertOne(newUser);

// Invalider le cache concerné
invalidateCache(['query:users:', 'findOne:users:']);
```

## 🔧 Configuration

### Variables d'Environnement
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DB_NAME=alumniprod
```

### Timeouts Recommandés (déjà configurés)
- `serverSelectionTimeoutMS`: 5000ms
- `connectTimeoutMS`: 10000ms
- `socketTimeoutMS`: 30000ms

## 📊 Monitoring

### Logs Disponibles
- ✅ Cache hit/miss pour chaque requête
- 🔄 Nouvelle connexion établie
- 🧹 Nettoyage automatique du cache (toutes les 10 min)
- ⚠️ Reconnexion en cas d'expiration

### Vérifier les Performances
```typescript
// Dans votre route API
console.time('query');
const result = await optimizedQuery('collection', filter);
console.timeEnd('query');
```

## 🎯 Résultats Attendus

### Avant Optimisation
- Temps de réponse: 2-5 secondes
- Connexions simultanées: ~10
- Pas de cache
- Requêtes répétées à la BD

### Après Optimisation
- Temps de réponse: 100-500ms (avec cache)
- Connexions simultanées: jusqu'à 50
- Cache actif pour 2-5 minutes
- Requêtes réduites de 70-90%

## 🚨 Important

### Sur Hostinger
1. Assurez-vous que `MONGODB_URI` est configurée dans les variables d'environnement
2. Exécutez `npm run init-db` après le premier déploiement
3. Les logs Vercel/Hostinger montreront les performances en temps réel

### Maintenance
- Le cache se nettoie automatiquement toutes les 10 minutes
- Les index sont créés en arrière-plan (non-bloquant)
- La reconnexion est automatique en cas de perte de connexion

## 📚 Documentation Complète

Pour plus d'informations sur les helpers:
- `src/lib/mongodb.ts` - Configuration de connexion
- `src/lib/cache.ts` - Système de cache
- `src/lib/api-helpers.ts` - Helpers de requêtes optimisées
