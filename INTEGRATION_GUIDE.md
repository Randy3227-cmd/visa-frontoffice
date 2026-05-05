# Guide d'Intégration - Formulaire d'Insertion avec QR Code

## 🎯 Objectif

Ce guide vous aide à intégrer complètement le formulaire d'insertion avec un backend réel et les QR codes de suivi.

## 🔗 Routes Disponibles

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `Form.jsx` | Page d'accueil avec recherche |
| `/insertion` | `InsertionForm.jsx` | Formulaire de création de demande |
| `/insertion/result/:id` | `InsertionResultPage.jsx` | Page de succès avec QR code |
| `/demandes/:numero` | `ListeDemandes.jsx` | Liste des demandes |

## 📝 Étapes d'Intégration

### 1. Mettre à jour l'API

Modifiez `src/api/insertionApi.js` pour pointer vers votre vrai backend:

```javascript
// Remplacer:
const BASE_URL = '/api'

// Par:
const BASE_URL = 'https://votre-api-backend.com/api'
// ou
const BASE_URL = process.env.REACT_APP_API_URL || '/api'
```

### 2. Adapter le formulaire avec l'API réelle

Dans `src/pages/InsertionForm.jsx`, importez et utilisez l'API:

```jsx
import { submitDemande, getFormOptions } from '../api/insertionApi.js'

export default function InsertionForm() {
  const [formDataOptions, setFormDataOptions] = useState(null)
  const [loading, setLoading] = useState(true)

  // Charger les options au montage
  useEffect(() => {
    getFormOptions()
      .then(data => setFormDataOptions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Soumettre le formulaire
  async function handleSubmit(e) {
    e.preventDefault()
    setChargement(true)
    setErreur(null)

    try {
      const result = await submitDemande(form)
      if (result.success) {
        // Générer les données pour le QR code
        const demandeData = {
          id: result.demandeId,
          demandeur: `${form.prenom} ${form.nom}`,
          dateCreation: new Date().toLocaleDateString('fr-FR'),
          passeport: form.numeroPasseport,
          typeVisa: form.typeVisa,
          ...form,
        }
        navigate(`/insertion/result/${result.demandeId}`, { state: demandeData })
      } else {
        setErreur(result.message)
      }
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }
}
```

### 3. Format Attendu de la Réponse du Serveur

**Request:**
```json
POST /api/demandes
{
  "nom": "RAKOTO",
  "prenom": "Jean",
  "dateNaissance": "1990-05-15",
  "lieuNaissance": "Antananarivo",
  "telephone": "+261 XX XXX XX XX",
  "email": "jean@example.com",
  "adresse": "Rue Principal, Antananarivo",
  "situationFamiliale": "celibataire",
  "nationalite": "madagascar",
  "numeroPasseport": "AB1234567",
  "dateDelivrance": "2020-01-15",
  "dateExpiration": "2030-01-15",
  "paysDelivrance": "Madagascar",
  "typeVisa": "tourisme",
  "typeDeuxDemande": "premiere"
}
```

**Response:**
```json
200 OK
{
  "id": "D-20260503-001",
  "demandeId": "D-20260503-001",
  "message": "Demande créée avec succès",
  "success": true,
  "dateCreation": "2026-05-03T10:30:00Z",
  "statut": "EN_ATTENTE"
}
```

### 4. Générer les Numéros de Demande

Le serveur doit générer des IDs uniques, par exemple:
- Format: `D-{DATE}-{SEQUENCE}`
- Exemple: `D-20260503-001`, `D-20260503-002`, etc.

### 5. QR Code Encoding

Le QR code encode l'URL de suivi:
```
https://votre-domaine.com/demandes/{demandeId}
```

Quand un utilisateur scanne le QR code, il est redirigé vers cette URL pour suivre sa demande.

### 6. Email de Confirmation

Après la création, envoyez un email au demandeur avec:
- Numéro de demande
- QR code (image ou lien)
- Instructions de suivi
- Deadline si applicable

### 7. Stockage du QR Code

Deux approches:

**Option A: Générer à la demande**
```javascript
// URL: /api/demandes/{id}/qrcode
// Format: PNG ou SVG
```

**Option B: Générer et stocker**
```javascript
// Stocker en base de données lors de la création
// Récupérer depuis: /api/demandes/{id}/qrcode
```

## 🧪 Tests Manuels

### Test 1: Formulaire Complet
1. Aller à `http://localhost:5173/`
2. Cliquer sur "Créer une demande"
3. Remplir tous les champs
4. Cliquer sur "Soumettre"
5. Vérifier que le QR code s'affiche

### Test 2: Validation
1. Aller à `/insertion`
2. Laisser des champs vides
3. Cliquer sur "Soumettre"
4. Vérifier le message d'erreur

### Test 3: QR Code
1. Créer une demande complète
2. Voir la page de résultat avec QR code
3. Cliquer sur "Télécharger QR Code"
4. Vérifier que le PNG est téléchargé
5. Scanner le QR code pour vérifier qu'il pointe vers la bonne URL

## 📲 API Endpoints à Implémenter

```
POST /api/demandes
  → Créer une nouvelle demande
  
GET /api/demandes/{id}
  → Récupérer une demande
  
GET /api/demandes
  → Lister les demandes (avec filtres)
  
GET /api/demandes/{id}/qrcode
  → Récupérer l'image QR code
  
POST /api/demandes/{id}/send-qr
  → Renvoyer le QR code par email
  
GET /api/form-options
  → Récupérer les énumérations
```

## 🔒 Sécurité

- Valider **côté serveur** tous les champs
- Utiliser **HTTPS** en production
- Implémenter un **CSRF token** si nécessaire
- Rate limiting sur les endpoints
- Authentification pour certains endpoints

## 📊 Monitoring

Tracez:
- Nombre de demandes créées par jour
- Taux de succès/erreur
- Temps de réponse de l'API
- Temps de téléchargement du QR code

## 🚀 Performance

- Cache les options du formulaire (5 minutes)
- Compresser les images QR code
- Utiliser CDN pour les uploads de fichiers
- Pagination pour les listes de demandes

## 🐛 Debugging

Pour voir les logs de développement:

```javascript
// Dans le navigateur console
localStorage.setItem('debug', 'visa-app:*')

// Dans le code
console.log('Données soumises:', form)
console.log('QR Code URL:', getQRCodeUrl(demandeId))
```

## 📚 Fichiers Modifiés/Créés

- ✅ `src/pages/InsertionForm.jsx` - Nouveau formulaire
- ✅ `src/pages/InsertionResultPage.jsx` - Page résultat
- ✅ `src/api/insertionApi.js` - API client
- ✅ `src/App.jsx` - Routes ajoutées
- ✅ `src/pages/Form.jsx` - Bouton "Créer demande" ajouté
- ✅ `package.json` - `qrcode.react` ajouté

## ✅ Checklist d'Intégration

- [ ] API backend configurée et testée
- [ ] Format de réponse correspondant attendu
- [ ] Numéros de demande générés correctement
- [ ] QR codes générés et accessibles
- [ ] Emails de confirmation envoyés
- [ ] Tests unitaires écrits
- [ ] Tests d'intégration effectués
- [ ] Deploy en production
- [ ] Monitoring actif

---

**Pour toute question, consultez la documentation du projet ou les commentaires dans le code.**
