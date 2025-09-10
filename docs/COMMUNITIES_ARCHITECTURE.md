# Architecture des Communautés - Université de Kinshasa Alumni Platform

## Vue d'ensemble

La plateforme Alumni Unikin organise ses communautés selon **5 axes principaux** pour faciliter les connexions et le networking entre les diplômés de l'université, fondée en 2012.

## 🏗️ Architecture Communautaire

### 1. 🎓 **Par Promotion** 
Groupes par année de diplôme pour maintenir les liens de cohorte

- **Exemple**: Promotion 2020, Promotion 2021, etc.
- **Période couverte**: 2012 (fondation) à année actuelle
- **Objectif**: Retrouvailles, maintien des liens d'amitié, évolution de carrière
- **Type**: `CommunityType.PROMOTION`

### 2. 🏛️ **Par Faculté**
8 communautés principales correspondant aux facultés de l'université

Les 8 facultés de Université de Kinshasa:
- **Médecine** (MED) - Formation en sciences médicales et santé
- **Ingénierie** (ING) - Formation en sciences de l'ingénieur  
- **Économie** (ECO) - Formation en sciences économiques et gestion
- **Droit** (DROIT) - Formation en sciences juridiques
- **Lettres et Sciences Humaines** (LSHS) - Formation en lettres et sciences humaines
- **Sciences** (SCI) - Formation en sciences pures
- **Agriculture** (AGRI) - Formation en sciences agricoles  
- **Sciences de l'Éducation** (EDU) - Formation pédagogique et éducative

**Type**: `CommunityType.FACULTY`

### 3. 📚 **Par Département**
Sous-groupes plus spécialisés au sein de chaque faculté

- **Exemples**: 
  - Informatique (Faculté d'Ingénierie)
  - Médecine Générale (Faculté de Médecine)
  - Finance (Faculté d'Économie)
- **Objectif**: Expertise technique spécialisée, discussions pointues
- **Type**: `CommunityType.DEPARTMENT`

### 4. 🌍 **Par Région Géographique**
Pour faciliter les rencontres physiques

**Régions principales en RDC**:
- Kinshasa, Gombe, Lubumbashi, Haut-Katanga
- Kikwit, Matadi, Mbandaka, Kananga
- Mbuji-Mayi, Bukavu, Goma, Autre

**Type**: `CommunityType.REGION`

### 5. 💼 **Par Secteur Professionnel** 
Regroupements par domaine d'activité actuelle

**Secteurs principaux**:
- Santé et Médecine
- Ingénierie et Technologie
- Finance et Banque
- Éducation et Formation
- Droit et Justice
- Agriculture et Environnement
- Commerce et Industrie
- Administration Publique
- ONG et Développement
- Recherche et Innovation

**Type**: `CommunityType.PROFESSION`

## 🔧 Implémentation Technique

### Structure des Données

```typescript
interface Community {
  _id?: ObjectId;
  name: string;
  description: string;
  type: CommunityType;
  
  // Champs spécifiques selon le type
  promotionYear?: number;     // Pour PROMOTION
  facultyId?: string;         // Pour FACULTY
  departmentId?: string;      // Pour DEPARTMENT  
  region?: string;            // Pour REGION
  profession?: string;        // Pour PROFESSION
  
  // Métadonnées
  memberCount: number;
  isActive: boolean;
  privacy: 'public' | 'private' | 'restricted';
  moderators: string[];
  rules?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### API Endpoints

#### GET `/api/communities`
Récupère les communautés avec filtrage optionnel

**Paramètres de requête**:
- `type`: Filtrer par type de communauté
- `facultyId`: Filtrer par faculté
- `region`: Filtrer par région
- `promotionYear`: Filtrer par année de promotion
- `isActive`: Filtrer par statut actif

#### POST `/api/communities`
Crée une nouvelle communauté

**Corps de la requête**:
```json
{
  "name": "Nom de la communauté",
  "description": "Description détaillée",
  "type": "promotion|faculty|department|region|profession",
  "promotionYear": 2020, // Si type = promotion
  "facultyId": "fac_medecine", // Si type = faculty
  "privacy": "public|private|restricted"
}
```

#### POST `/api/communities/initialize`
Initialise les communautés de base

**Corps de la requête**:
```json
{
  "action": "initialize" // ou "reset"
}
```

## 🚀 Déploiement et Initialisation

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de la base de données
Assurez-vous que MongoDB est configuré dans votre fichier `.env` :
```env
MONGODB_URI=mongodb://localhost:27017/alumni-platform
```

### 3. Initialisation des communautés de base
```bash
# Créer les communautés de base
npm run init-communities

# Ou réinitialiser toutes les communautés (ATTENTION: destructif)
npm run reset-communities
```

### 4. Via l'interface d'administration
Accédez à `/admin/communities` pour gérer les communautés via l'interface web.

## 📱 Interface Utilisateur

### Page d'Exploration `/communities`
- **Filtrage avancé** par type, faculté, région, promotion
- **Recherche textuelle** dans les noms et descriptions
- **Statistiques** par type de communauté
- **Cartes visuelles** avec informations clés

### Page d'Administration `/admin/communities`
- **Création** de nouvelles communautés
- **Gestion** des communautés existantes  
- **Initialisation** en masse des communautés de base
- **Statistiques** et monitoring

## 🎯 Règles de Gestion

### Validation des Communautés

1. **Promotion**: Année entre 2012 et année actuelle
2. **Faculté**: Doit correspondre à une des 8 facultés définies
3. **Département**: Doit avoir une faculté parent valide
4. **Région**: Doit être dans la liste des régions autorisées
5. **Profession**: Doit être dans la liste des secteurs définis

### Prévention des Doublons

Le système vérifie automatiquement l'existence de communautés similaires :
- Une seule communauté par promotion/année
- Une seule communauté par faculté
- Une seule communauté par département
- Une seule communauté par région
- Une seule communauté par secteur professionnel

### Niveaux de Confidentialité

- **🌐 Public**: Visible par tous, adhésion libre
- **👥 Restreint**: Visible par tous, adhésion sur invitation
- **🔒 Privé**: Visible aux membres, adhésion sur approbation

## 📊 Statistiques Attendues

Après initialisation complète :
- **8 communautés** de facultés
- **5+ communautés** régionales principales
- **12+ communautés** de promotion (2012 à aujourd'hui)
- **5+ communautés** professionnelles principales
- **3+ communautés** de département

**Total estimé**: 35+ communautés de base

## 🔄 Évolution et Maintenance

### Ajout de Nouvelles Communautés
- Les promotions futures sont automatiquement supportées
- Nouvelles régions peuvent être ajoutées dans `REGIONS`
- Nouveaux secteurs dans `PROFESSIONAL_SECTORS`
- Nouvelles facultés nécessitent mise à jour de `LEGACY_FACULTIES`

### Migration et Backup
- Scripts de migration inclus pour évolution du schéma
- Backup recommandé avant reset complet
- Logs détaillés pour traçabilité

## 🆘 Support et Dépannage

### Erreurs Communes

1. **"Communauté similaire existe déjà"**
   - Vérifiez les paramètres de création
   - Une communauté du même type avec les mêmes critères existe

2. **"Faculté non trouvée"**
   - Vérifiez que `facultyId` correspond à `LEGACY_FACULTIES`

3. **"Année de promotion invalide"**
   - L'année doit être entre 2012 et l'année actuelle

### Réinitialisation Complète
```bash
# ATTENTION: Supprime TOUTES les communautés
npm run reset-communities
npm run init-communities
```

---

**🎓Université de Kinshasa Alumni Platform**  
*Connecter les diplômés, construire l'avenir* 