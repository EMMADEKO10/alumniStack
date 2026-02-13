# 🎓 Système d'Incitation à Compléter le Profil Alumni

## Vue d'ensemble

Système complet pour encourager les utilisateurs avec le rôle 'user' à créer et compléter leur profil alumni après connexion. Ce système améliore l'UX/UI en guidant les utilisateurs à travers le processus de complétion de profil.

---

## 📦 Composants Créés

### 1. **Hook personnalisé** : `useAlumniProfile`
📁 `src/hooks/useAlumniProfile.ts`

**Fonction** : Hook React qui gère l'état du profil alumni de l'utilisateur connecté

**Retourne** :
```typescript
{
  profile: AlumniProfile | null,      // Données du profil
  loading: boolean,                     // État de chargement
  error: string | null,                 // Message d'erreur
  isComplete: boolean,                  // Profil complet ?
  completionPercentage: number,         // % de complétion (0-100)
  hasProfile: boolean,                  // Utilisateur a un profil ?
  refetch: () => Promise<void>          // Recharger le profil
}
```

**Utilisation** :
```typescript
import { useAlumniProfile } from '@/hooks/useAlumniProfile';

function MonComposant() {
  const { profile, isComplete, completionPercentage } = useAlumniProfile();
  // ...
}
```

---

### 2. **Bannière persistante** : `CompleteProfileBanner`
📁 `src/components/ui/CompleteProfileBanner.tsx`

**Fonction** : Bannière fixe en haut de page qui rappelle de compléter le profil

**Caractéristiques** :
- ✅ S'affiche sur toutes les pages (sauf pages exclues)
- ✅ Se ferme pour la session courante (sessionStorage)
- ✅ Affiche le pourcentage de complétion
- ✅ Animation d'apparition fluide
- ✅ Barre de progression visuelle
- ✅ Messages adaptés selon l'état du profil

**États d'affichage** :
1. **Pas de profil** : Message rouge "Bienvenue dans la communauté LAU Alumni !"
2. **Profil incomplet** : Message bleu avec pourcentage de complétion

**Pages exclues** :
- `/profile/complete`
- `/login`
- `/register`
- `/verify-email`

---

### 3. **Modale d'onboarding** : `CompleteProfileModal`
📁 `src/components/ui/CompleteProfileModal.tsx`

**Fonction** : Modale immersive affichée UNE SEULE FOIS après la première connexion

**Caractéristiques** :
- ✅ Affichage unique (localStorage)
- ✅ Délai d'apparition de 1.5s pour meilleure UX
- ✅ Design attractif avec dégradés
- ✅ Liste des 4 avantages principaux
- ✅ Badge "Nouveau Membre"
- ✅ Animation d'entrée fluide
- ✅ Overlay avec flou d'arrière-plan

**Avantages présentés** :
1. 🤝 **Rejoignez le réseau** - 10 000+ alumni
2. 💼 **Opportunités exclusives** - Emplois et stages
3. 📅 **Événements privilégiés** - Networking et formations
4. 🤝 **Mentorat & Collaboration** - Entraide communautaire

---

### 4. **Card de complétion** : `ProfileCompletionCard`
📁 `src/components/ui/ProfileCompletionCard.tsx`

**Fonction** : Card détaillée affichant la progression section par section

**Caractéristiques** :
- ✅ Barre de progression visuelle avec %
- ✅ 4 sections détaillées avec état (complété ou non)
- ✅ Messages d'encouragement adaptatifs
- ✅ Codage couleur selon progression
- ✅ Bouton CTA pour compléter le profil

**Sections suivies** :
1. 👤 **Informations personnelles** - Nom, prénom, email, téléphone
2. 🎓 **Formation académique** - Faculté, diplôme, année
3. 💼 **Parcours professionnel** - Poste actuel, expériences
4. 📍 **Coordonnées** - Adresse, localisation

**Messages selon progression** :
- `0-49%` : 🚀 "Commencez maintenant !" (rouge)
- `50-74%` : 👍 "Bon début !" (orange)
- `75-99%` : 💪 "Presque terminé !" (bleu)
- `100%` : 🎉 "Profil complet !" (vert)

---

## 🔧 Intégration

### Layout principal
📁 `src/app/layout.tsx`

Les composants sont intégrés dans le layout principal pour s'afficher automatiquement :

```tsx
<NextAuthProvider>
  <Header />
  <CompleteProfileBanner />      {/* Bannière persistante */}
  <CompleteProfileModal />        {/* Modale d'onboarding */}
  <main className="min-h-screen">
    {children}
  </main>
  <Footer />
</NextAuthProvider>
```

---

## 🎨 Comportement UX

### Flux utilisateur complet

#### 1️⃣ **Première connexion** (nouvel utilisateur)
```
Connexion réussie
    ↓
Délai 1.5s
    ↓
Modale d'onboarding s'affiche 
    ↓
Utilisateur clique "Compléter maintenant" OU "Plus tard"
    ↓
Si "Plus tard" → Bannière s'affiche en haut
    ↓
Utilisateur navigue sur la plateforme
    ↓
Bannière reste visible jusqu'à ce qu'il la ferme
    ↓
Page /profile → Affiche ProfileCompletionCard détaillée
```

#### 2️⃣ **Connexions suivantes** (modale déjà vue)
```
Connexion réussie
    ↓
Vérification du profil
    ↓
Si profil incomplet → Bannière s'affiche automatiquement
    ↓
Utilisateur peut naviguer librement
    ↓
Bannière reste visible sur toutes les pages (sauf exclues)
    ↓
Page /profile → ProfileCompletionCard détaillée
```

#### 3️⃣ **Profil complet**
```
Connexion réussie
    ↓
Vérification du profil
    ↓
Profil à 100% → Aucune bannière, aucune modale
    ↓
Page /profile → ProfileCompletionCard affiche "Profil complet !"
```

---

## 🎯 Logique de Stockage

### SessionStorage (bannière)
```javascript
sessionStorage.setItem('profileBannerDismissed', 'true')
```
- **Durée** : Session de navigation courante
- **Effet** : Bannière cachée jusqu'à fermeture du navigateur
- **Reset** : Nouvelle fenêtre/onglet = bannière réapparaît

### LocalStorage (modale)
```javascript
localStorage.setItem('hasSeenProfileModal', 'true')
```
- **Durée** : Permanente (jusqu'à clear cache)
- **Effet** : Modale ne s'affiche plus jamais
- **Reset** : Clear cache navigateur OU console → `localStorage.clear()`

---

## 📊 Calcul de Complétion

Le pourcentage est calculé par la fonction `calculateProfileCompletion()` dans `src/types/alumni.ts` :

### Champs requis (80%) :
- Prénom, nom, email
- Faculté, diplôme, titre, année
- Ville, province, pays

### Champs optionnels (20%) :
- Téléphone, bio, LinkedIn
- Département, spécialisation
- Poste actuel, compétences
- Préférences communautaires

**Formule** :
```
score = (champs_requis_remplis / total_requis) × 80 +
        (champs_optionnels_remplis / total_optionnels) × 20
```

---

## 🎨 Design System

### Palette de couleurs

| État | Couleurs | Usage |
|------|----------|-------|
| **Nouveau** | Rouge (#ef4444 → #dc2626) | Pas de profil |
| **En cours** | Bleu (#2563eb → #06b6d4) | Profil incomplet |
| **Presque** | Orange (#f97316 → #f59e0b) | 50-74% |
| **Complet** | Vert (#16a34a → #059669) | 100% |

### Animations

```css
/* Apparition bannière */
translate-y: -100% → 0 (500ms)
opacity: 0 → 100

/* Apparition modale */
scale: 95% → 100% (300ms)
translate-y: 4px → 0

/* Hover effets */
hover:scale-110
hover:-translate-y-0.5
hover:shadow-xl
```

---

## 🚀 Guide d'utilisation

### Pour le développeur

#### Tester le système complet

1. **Reset complet** (console navigateur) :
```javascript
localStorage.clear();
sessionStorage.clear();
```

2. **Se connecter** avec un compte sans profil

3. **Observer la séquence** :
   - Modale apparaît après 1.5s
   - Cliquer "Plus tard"
   - Bannière apparaît en haut
   - Naviguer vers `/profile`
   - Voir la ProfileCompletionCard

#### Tester seulement la bannière

```javascript
localStorage.setItem('hasSeenProfileModal', 'true');
sessionStorage.removeItem('profileBannerDismissed');
```

#### Tester seulement la modale

```javascript
localStorage.removeItem('hasSeenProfileModal');
```

### Pour l'utilisateur

#### Comment compléter son profil ?

**Méthode 1** : Via la modale
1. Après connexion, cliquer "Compléter mon profil maintenant"

**Méthode 2** : Via la bannière
1. Cliquer sur le bouton "Compléter mon profil"

**Méthode 3** : Via la page profil
1. Aller sur `/profile`
2. Cliquer "Compléter mon profil" dans la card

**Méthode 4** : Via navigation
1. Menu utilisateur → "Compléter mon profil"

---

## 📱 Responsive Design

### Mobile (< 640px)
- ✅ Bannière compacte avec texte réduit
- ✅ Modale plein écran scrollable
- ✅ Card empilée verticalement
- ✅ Boutons adaptés à la taille tactile

### Tablet (640px - 1024px)
- ✅ Bannière étendue avec icônes
- ✅ Modale centrée avec padding
- ✅ Card en grille 1-2 colonnes

### Desktop (> 1024px)
- ✅ Bannière complète avec toutes infos
- ✅ Modale centrée (max 768px)
- ✅ Card en grille 2 colonnes complète

---

## ✅ Checklist de Test

### Tests fonctionnels

- [ ] Nouvel utilisateur voit la modale
- [ ] Modale s'affiche après 1.5s
- [ ] "Compléter maintenant" redirige vers `/profile/complete`
- [ ] "Plus tard" ferme et affiche la bannière
- [ ] Bannière persiste entre les pages
- [ ] Bannière se ferme pour la session
- [ ] Bannière ne s'affiche pas sur pages exclues
- [ ] ProfileCompletionCard affiche bon %
- [ ] Sections cochées correspondent au profil
- [ ] Profil à 100% cache bannière et modale
- [ ] Hook recharge profil correctement

### Tests UX

- [ ] Animations fluides
- [ ] Pas de clignotement au chargement
- [ ] Messages d'encouragement adaptés
- [ ] Couleurs cohérentes
- [ ] Responsive OK mobile/tablet/desktop
- [ ] Accessibilité (fermer avec Escape, focus)

### Tests de stockage

- [ ] LocalStorage persiste après refresh
- [ ] SessionStorage reset après fermeture
- [ ] Clear cache reactive modale

---

## 🐛 Dépannage

### La modale ne s'affiche pas

**Causes possibles** :
1. Déjà affichée (localStorage)
2. Page exclue
3. Profil déjà complet
4. Non authentifié

**Solutions** :
```javascript
// Console navigateur
localStorage.removeItem('hasSeenProfileModal');
```

### La bannière ne se cache pas

**Cause** : SessionStorage non supporté

**Solution** :
```javascript
// Vérifier support
if (typeof window !== 'undefined' && window.sessionStorage) {
  // OK
}
```

### Le pourcentage reste à 0%

**Causes** :
1. Profil pas encore créé
2. API ne retourne pas `status.completionPercentage`
3. Erreur de calcul

**Solution** :
Vérifier dans l'API `/api/alumni/route.ts` que le calcul est fait :
```typescript
alumniProfile.status.isComplete = isProfileComplete(alumniProfile);
```

---

## 🎯 Améliorations futures

### Court terme
- [ ] Ajouter animations Framer Motion
- [ ] Toast notifications sur complétion
- [ ] Confettis à 100%
- [ ] Gamification (badges, points)

### Moyen terme
- [ ] Système de rappels par email
- [ ] Dashboard admin pour tracking
- [ ] A/B testing messages
- [ ] Multi-langues

### Long terme
- [ ] IA suggérant contenu profil
- [ ] Import depuis LinkedIn
- [ ] Profil vidéo
- [ ] Certification profil vérifié

---

## 📞 Support

Pour questions ou bugs :
1. Vérifier cette documentation
2. Consulter les logs console
3. Tester en mode incognito
4. Contacter l'équipe dev

---

**Dernière mise à jour** : 13 février 2026  
**Version** : 1.0.0  
**Auteur** : GitHub Copilot & Al Legacy Team
