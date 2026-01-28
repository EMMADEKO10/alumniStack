# Système de Typographie Professionnel

## Problème Identifié

### Pourquoi Tailwind CSS ne fonctionne pas ?

1. **Tailwind CSS v4.1.18** ne reconnaît pas les variables `--font-size-*` dans `@theme`
2. Les règles CSS globales (`*`, `body`, `h1-h6`) ont une **spécificité CSS plus élevée** que les classes utilitaires Tailwind
3. L'ordre de chargement CSS : Tailwind → Styles globaux = Les styles globaux gagnent toujours

### Spécificité CSS
```
Inline styles (style="")         → Spécificité: 1000
IDs (#id)                         → Spécificité: 100
Classes (.class), [attr]          → Spécificité: 10
Éléments (h1, div, p)            → Spécificité: 1
```

Quand on écrit `h1 { font-size: 2rem; }`, cela a une spécificité de **1**
Quand Tailwind génère `.text-xl { font-size: 1.25rem; }`, cela a une spécificité de **10**

**MAIS** si les deux s'appliquent au même `<h1>`, le dernier dans l'ordre CSS gagne !

## Solution Professionnelle

### Option 1 : Utiliser `!important` dans Tailwind (Non recommandé)
### Option 2 : Augmenter la spécificité avec des classes composées
### Option 3 : Utiliser des styles inline (Recommandé pour override)
### Option 4 : Supprimer tous les styles globaux d'éléments HTML

## Système Responsive Professionnel

### Mobile First (320px - 640px)
- Titres principaux : clamp(1.5rem, 4vw, 2rem)
- Titres secondaires : clamp(1.25rem, 3.5vw, 1.5rem)
- Titres cards : clamp(1rem, 2.5vw, 1.125rem)
- Texte body : clamp(0.875rem, 2vw, 1rem)
- Petits textes : clamp(0.75rem, 1.5vw, 0.875rem)

### Tablet (641px - 1024px)
- Titres principaux : clamp(2rem, 3vw, 2.5rem)
- Titres secondaires : clamp(1.5rem, 2.5vw, 1.875rem)
- Titres cards : clamp(1.0625rem, 2vw, 1.1875rem)
- Texte body : 1rem
- Petits textes : 0.875rem

### Desktop (1025px+)
- Titres principaux : clamp(2.5rem, 2.5vw, 3rem)
- Titres secondaires : clamp(1.875rem, 2vw, 2.25rem)
- Titres cards : 1.125rem (fixe)
- Texte body : 1rem
- Petits textes : 0.875rem
