# Nouveau Formulaire d'Insertion avec QR Code

## 📋 Vue d'ensemble

Le projet visa-frontoffice a été enrichi d'un **nouveau formulaire d'insertion** qui permet de créer directement une nouvelle demande de visa, avec intégration automatique d'un **QR code de suivi**.

## ✨ Nouvelles Fonctionnalités

### 1. **Formulaire d'Insertion Complet** (`/insertion`)
- **Route:** `/insertion`
- **Fichier:** `src/pages/InsertionForm.jsx`
- **Fonctionnalités:**
  - Collecte des informations du demandeur (nom, prénom, date de naissance, etc.)
  - Informations du passeport (numéro, dates, pays de délivrance)
  - Choix du type de visa et type de demande
  - Validation complète des champs obligatoires
  - UI consistante avec le style du projet

### 2. **Page de Résultat avec QR Code** (`/insertion/result/:id`)
- **Route:** `/insertion/result/:id`
- **Fichier:** `src/pages/InsertionResultPage.jsx`
- **Fonctionnalités:**
  - Affichage d'un QR code unique pour chaque demande
  - Le QR code encode l'URL de suivi : `/demandes/{id}`
  - Récapitulatif des informations de la demande
  - Option pour télécharger le QR code en PNG
  - Lien pour voir le détail de la demande
  - Instructions d'utilisation

### 3. **Interface Améliorée de Recherche**
- **Fichier modifié:** `src/pages/Form.jsx`
- **Ajout:** Bouton "Créer une demande" permettant de naviguer vers le formulaire d'insertion

## 🗂️ Structure des Fichiers

```
src/
├── pages/
│   ├── Form.jsx                    # Page de recherche (modifiée)
│   ├── InsertionForm.jsx           # Nouveau - Formulaire d'insertion
│   ├── InsertionResultPage.jsx     # Nouveau - Page résultat avec QR code
│   ├── ListeDemandes.jsx
│   └── ...
├── App.jsx                         # Modifié - Routes ajoutées
├── main.jsx
└── ...
```

## 🔄 Flux d'Utilisation

```
Accueil (/)
├── Rechercher une demande
│   └── Voir la liste des demandes
└── Créer une nouvelle demande
    └── /insertion (Formulaire)
        └── /insertion/result/:id (QR Code)
            ├── Télécharger QR Code
            ├── Voir le détail
            └── Retour à l'accueil
```

## 📦 Dépendances Ajoutées

- **qrcode.react** `^4.2.0` - Pour générer les QR codes en SVG

Installation effectuée:
```bash
npm install qrcode.react
```

## 🎨 Style et Design

- Utilisation du même système de styles que le projet existant
- Design responsive compatible avec tous les appareils
- Utilisation de la palette de couleurs du projet (#0f2d52, #10b981, etc.)
- Icons SVG inline pour une performance optimale

## 🔐 Données et Validation

### Champs Obligatoires du Formulaire:
- Nom et Prénom
- Date et Lieu de naissance
- Téléphone et Email
- Adresse complète
- Situation familiale et Nationalité
- Numéro de passeport
- Dates de délivrance et d'expiration
- Pays de délivrance
- Type de visa et Type de demande

### Validation Côté Client:
- Vérification que tous les champs obligatoires sont remplis
- Messages d'erreur clairs et informatifs

## 🚀 Prochaines Étapes

1. **Intégration Backend:**
   - Connecter le formulaire à une vraie API (`POST /api/demandes`)
   - Récupérer l'ID de la demande depuis la réponse du server
   - Implémenter la gestion des erreurs côté serveur

2. **Base de Données:**
   - Stocker les informations de la demande
   - Générer les numéros de demande uniques
   - Tracer la création et les modifications

3. **Fonctionnalités Additionnelles:**
   - Upload de fichiers/pièces justificatives
   - Confirmation par email avec pièce jointe du QR code
   - Suivi en temps réel de l'état de la demande
   - Historique des modifications

## 🧪 Test du Formulaire

1. Lancer le serveur de développement:
   ```bash
   npm run dev
   ```

2. Aller sur http://localhost:5173

3. Cliquer sur "Créer une demande"

4. Remplir le formulaire avec des données de test

5. Cliquer sur "Soumettre"

6. La page de résultat avec le QR code s'affichera

7. Vous pouvez télécharger le QR code en PNG

## 📝 Notes Importantes

- **QR Code URL:** Encode l'URL `/demandes/{id}` pour permettre le suivi de la demande
- **Generate ID:** Actuellement généré en front avec `Date.now()` - À remplacer par un ID vrai du serveur
- **State Management:** Utilise React Router `useLocation` et `useState` pour la gestion d'état
- **Responsive:** Le design s'adapte à tous les types d'écrans (mobile, tablet, desktop)

---

**Date de création:** 3 mai 2026  
**Intégration complète du QR Code depuis visa-backoffice/visa-form-app** ✅
