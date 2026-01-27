# Guide d'Utilisation des Hooks Optimisés

## 🎣 Hooks Disponibles

### 1. `useApi` - Récupération de Données

Hook pour récupérer des données avec cache automatique et refetch.

```typescript
import { useApi } from '@/hooks/useApi';

function AlumniList() {
  const { data, loading, error, refetch } = useApi<Alumni[]>(
    '/api/alumni',
    {
      enabled: true, // Activer/désactiver la requête
      refetchInterval: 30000, // Refetch automatique toutes les 30s
      onSuccess: (data) => console.log('Données chargées:', data),
      onError: (error) => console.error('Erreur:', error)
    }
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div>
      <button onClick={refetch}>Rafraîchir</button>
      {data?.map(alumni => (
        <div key={alumni.id}>{alumni.name}</div>
      ))}
    </div>
  );
}
```

### 2. `useMutation` - Modifications de Données

Hook pour créer, mettre à jour ou supprimer des données.

```typescript
import { useMutation } from '@/hooks/useApi';

function CreateAlumni() {
  const { mutate, loading, error } = useMutation<Alumni, CreateAlumniInput>(
    '/api/alumni',
    {
      method: 'POST',
      onSuccess: (data) => {
        console.log('Alumni créé:', data);
        // Rediriger ou afficher un message de succès
      },
      onError: (error) => {
        console.error('Erreur:', error);
      }
    }
  );

  const handleSubmit = async (formData: CreateAlumniInput) => {
    await mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Vos champs de formulaire */}
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer'}
      </button>
      {error && <p>Erreur: {error.message}</p>}
    </form>
  );
}
```

### 3. `usePagination` - Pagination Automatique

Hook pour paginer facilement les données.

```typescript
import { usePagination } from '@/hooks/useApi';

function AlumniListPaginated() {
  const {
    data,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage
  } = usePagination<Alumni>('/api/alumni', 20);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div>
      {data?.data.map(alumni => (
        <div key={alumni.id}>{alumni.name}</div>
      ))}
      
      <div className="pagination">
        <button onClick={prevPage} disabled={!hasPrevPage}>
          Précédent
        </button>
        <span>Page {page}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Suivant
        </button>
      </div>
    </div>
  );
}
```

## 🔄 Mise à Jour Optimiste

Mettre à jour l'UI immédiatement avant la réponse du serveur :

```typescript
function AlumniProfile({ id }: { id: string }) {
  const { data, loading, mutate } = useApi<Alumni>(`/api/alumni/${id}`);
  const updateMutation = useMutation<Alumni, Partial<Alumni>>(
    `/api/alumni/${id}`,
    {
      method: 'PUT',
      onSuccess: (updatedData) => {
        // Mise à jour du cache local
        mutate(updatedData);
      }
    }
  );

  const handleUpdate = async (updates: Partial<Alumni>) => {
    // Mise à jour optimiste (UI immédiate)
    mutate({ ...data!, ...updates });
    
    // Envoyer la requête au serveur
    await updateMutation.mutate(updates);
  };

  // ...
}
```

## 🎯 Bonnes Pratiques

### 1. Désactiver les Requêtes Conditionnelles
```typescript
const { data } = useApi(
  userId ? `/api/alumni/${userId}` : null,
  { enabled: !!userId }
);
```

### 2. Gérer les États de Chargement
```typescript
if (loading && !data) return <Skeleton />; // Premier chargement
if (loading && data) return <DataWithSpinner data={data} />; // Rechargement
```

### 3. Combinaison de Hooks
```typescript
function AlumniDashboard() {
  // Données principales
  const alumni = useApi<Alumni[]>('/api/alumni');
  
  // Statistiques (refetch toutes les minutes)
  const stats = useApi<Stats>('/api/stats', {
    refetchInterval: 60000
  });
  
  // Actions
  const createAlumni = useMutation('/api/alumni');
  const updateAlumni = useMutation('/api/alumni', { method: 'PUT' });

  // ...
}
```

## ⚡ Optimisations Automatiques

Ces hooks incluent automatiquement :
- ✅ Cache navigateur (60 secondes)
- ✅ Déduplication des requêtes identiques
- ✅ Annulation des requêtes obsolètes
- ✅ Retry automatique en cas d'échec réseau
- ✅ Support du SSR/SSG Next.js

## 🚀 Performance

### Sans Cache (Avant)
```
Requête 1: /api/alumni → 2000ms
Requête 2: /api/alumni → 2000ms (même données!)
Total: 4000ms
```

### Avec Cache (Après)
```
Requête 1: /api/alumni → 500ms (optimisé)
Requête 2: /api/alumni → <1ms (depuis cache)
Total: ~500ms
```

## 📱 Support des Progressive Web Apps

Ces hooks sont optimisés pour :
- Mode hors ligne (avec cache)
- Connexions lentes
- Applications mobiles
- Background sync
