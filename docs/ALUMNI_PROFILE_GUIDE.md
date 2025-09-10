# Guide du Profil Alumni - Unikin Platform

## 🎯 Vue d'ensemble

Le système de profil Alumni permet aux diplômés de Unikin de :
- **Compléter** leurs informations académiques et professionnelles
- **Rejoindre automatiquement** les communautés appropriées
- **Se connecter** avec d'autres alumni
- **Contrôler** leur visibilité et confidentialité

## 🚀 Comment compléter son profil Alumni

### 1. **Accès au formulaire**
- Connectez-vous à votre compte
- Allez sur `/profile` 
- Cliquez sur "Compléter mon profil Alumni"
- Ou accédez directement à `/profile/complete`

### 2. **Étapes du formulaire**

#### **Étape 1 : Informations Personnelles**
- ✅ Prénom, Nom (obligatoires)
- ✅ Email, Téléphone
- ✅ Genre, Nationalité
- ✅ Profil LinkedIn
- ✅ Biographie personnelle

#### **Étape 2 : Informations Académiques**
- ✅ **Faculté** (obligatoire) - choix parmi les 8 facultés
- ✅ **Département** (ex: Informatique, Médecine Générale)
- ✅ **Niveau de diplôme** (Licence, Master, Doctorat)
- ✅ **Année de fin** (obligatoire) - de 2012 à aujourd'hui
- ✅ **Titre du diplôme** (obligatoire)
- ✅ Spécialisation, Mentions, Numéro d'étudiant

#### **Étape 3 : Coordonnées** (À venir)
- Adresse actuelle et d'origine
- Contact d'urgence

#### **Étape 4 : Informations Professionnelles** (À venir)
- Poste actuel
- Historique professionnel
- Compétences et certifications
- Langues parlées

#### **Étape 5 : Préférences et Confidentialité** (À venir)
- Types de communautés d'intérêt
- Paramètres d'adhésion automatique
- Préférences de confidentialité

## 📊 Calcul de Complétion du Profil

Le pourcentage de complétion est calculé ainsi :
- **80%** pour les champs obligatoires
- **20%** pour les champs optionnels

### Champs Obligatoires (80%)
- Prénom, Nom, Email
- Faculté, Diplôme, Année de fin
- Adresse (ville, province, pays)

### Champs Optionnels (20%)
- Téléphone, Bio, LinkedIn
- Département, Spécialisation
- Poste actuel, Compétences
- Préférences de communauté

**Seuil de complétion :** 80% minimum pour un profil "complet"

## 🔒 Niveaux de Confidentialité

### **🌐 Public**
- Visible par tous (y compris non-connectés)
- Informations de base visibles
- Adapté pour le networking externe

### **👥 Alumni seulement**
- Visible uniquement par les autres alumni connectés
- Niveau recommandé par défaut
- Équilibre entre visibilité et confidentialité

### **🔒 Privé**
- Visible uniquement par vous
- Aucune visibilité externe
- Pour les profils très confidentiels

## 🤖 Adhésion Automatique aux Communautés

Une fois votre profil complété, vous pourrez rejoindre automatiquement :

### **🎓 Par Promotion**
- Communauté de votre année de fin d'études
- Ex: "Promotion 2020"

### **🏛️ Par Faculté**
- Communauté de votre faculté
- Ex: "Alumni Faculté de Médecine"

### **📚 Par Département**
- Communauté de votre spécialisation
- Ex: "Informaticiens Legacy University"

### **🌍 Par Région**
- Communauté de votre région actuelle
- Ex: "Alumni Kinshasa"

### **💼 Par Profession**
- Communauté de votre secteur professionnel
- Ex: "Professionnels - Ingénierie et Technologie"

## 🔧 API Endpoints Disponibles

### **Créer un profil**
```http
POST /api/alumni
Content-Type: application/json

{
  "personalInfo": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com"
  },
  "academicInfo": {
    "facultyId": "fac_medecine",
    "degreeTitle": "Licence en Médecine",
    "graduationYear": 2020
  }
}
```

### **Récupérer un profil**
```http
GET /api/alumni/[userId]
```

### **Mettre à jour un profil**
```http
PUT /api/alumni
Content-Type: application/json

{
  "professionalInfo": {
    "currentPosition": {
      "jobTitle": "Médecin",
      "company": "Hôpital Général",
      "industry": "Santé et Médecine"
    }
  }
}
```

### **Rechercher des profils**
```http
GET /api/alumni?search=Jean&facultyId=fac_medecine&graduationYear=2020
```

## 📱 Interface Utilisateur

### **Page de Profil** (`/profile`)
- **Vue d'ensemble** des informations personnelles
- **Statut Alumni** avec pourcentage de complétion
- **Informations académiques et professionnelles**
- **Actions rapides** (modifier, explorer communautés)

### **Formulaire de Complétion** (`/profile/complete`)
- **Formulaire multi-étapes** guidé
- **Validation en temps réel**
- **Sauvegarde automatique** des étapes
- **Prévisualisation** du profil

### **Explorer les Alumni** (`/communities`)
- **Recherche avancée** par faculté, promotion, région
- **Filtres multiples** pour trouver des alumni
- **Profils publics** avec informations de contact

## ⚡ Intégration avec les Communautés

Le profil Alumni s'intègre automatiquement avec le système de communautés :

1. **Détection automatique** des communautés appropriées
2. **Suggestion d'adhésion** basée sur le profil
3. **Joining automatique** selon les préférences
4. **Notifications** de nouvelles communautés

## 🎯 Cas d'Usage Typiques

### **Nouvel Utilisateur**
1. S'inscrit sur la plateforme
2. Va sur `/profile` → voit le call-to-action Alumni
3. Clique "Compléter mon profil Alumni"
4. Remplit le formulaire en 5 étapes
5. Rejoint automatiquement ses communautés
6. Explore les autres alumni

### **Alumni Existant**
1. Se connecte à son compte
2. Va sur `/profile` → voit ses informations
3. Clique "Modifier" pour mettre à jour
4. Ajoute de nouvelles compétences/expériences
5. Ajuste ses préférences de confidentialité

### **Recruteur/Réseau**
1. Accède à `/communities` 
2. Filtre par faculté + année + région
3. Consulte les profils publics
4. Contacte les alumni selon leurs préférences

## 🔍 Validation et Vérification

### **Validation Automatique**
- ✅ Format email valide
- ✅ Année de fin entre 2012 et année actuelle + 1
- ✅ Faculté dans la liste officielle Legacy University
- ✅ Champs obligatoires remplis

### **Vérification Manuel (Admin)**
- 👤 Vérification par l'administration
- 📋 Validation des diplômes
- ✅ Statut "Vérifié" affiché sur le profil
- 🏆 Badge de confiance pour les alumni vérifiés

## 🚀 Prochaines Fonctionnalités

- [ ] **Upload de photo** de profil
- [ ] **Import LinkedIn** automatique
- [ ] **Matching intelligent** d'alumni
- [ ] **Recommandations** de connexions
- [ ] **Timeline** d'activités alumni
- [ ] **Statistiques** de profil avancées
- [ ] **Export PDF** du profil
- [ ] **API publique** pour intégrations

---

**🎓 Unikin Alumni Platform**  
*Connecter les diplômés, construire l'avenir* 