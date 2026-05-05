/**
 * EXEMPLE COMPLET D'INTÉGRATION AVEC API BACKEND
 * 
 * Ce fichier montre comment adapter InsertionForm.jsx pour utiliser une vraie API
 */

// ==================================================
// VERSION ORIGINALE (ACTUELLEMENT EN PLACE)
// ==================================================

/*
// Dans InsertionForm.jsx (version actuelle)

async function handleSubmit(e) {
  e.preventDefault()

  // Validation basique
  const champsObligatoires = [...]
  const champsVides = champsObligatoires.filter((champ) => !form[champ] || !form[champ].trim())
  
  if (champsVides.length > 0) {
    setErreur(`Veuillez remplir tous les champs obligatoires`)
    return
  }

  setChargement(true)
  setErreur(null)

  try {
    // ⚠️ ACTUELLEMENT: Génération d'ID en FRONT
    const demandeId = `D-${Date.now()}`
    
    // Générer les données pour le QR code
    const demandeData = { ... }

    // Naviguer vers la page résultat
    navigate(`/insertion/result/${demandeId}`, { state: demandeData })
  } catch (err) {
    setErreur(err.message || 'Erreur lors de la soumission du formulaire')
  } finally {
    setChargement(false)
  }
}
*/

// ==================================================
// VERSION AVEC API BACKEND (À IMPLÉMENTER)
// ==================================================

/*
// Dans InsertionForm.jsx (version améliorée)

import { submitDemande, getFormOptions } from '../api/insertionApi.js'

export default function InsertionForm() {
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [focusedField, setFocusedField] = useState(null)
  const [formDataOptions, setFormDataOptions] = useState(null)
  const [loadingOptions, setLoadingOptions] = useState(true)

  // ✅ NOUVEAU: Charger les options du serveur
  useEffect(() => {
    getFormOptions()
      .then(data => setFormDataOptions(data))
      .catch(err => {
        console.error('Erreur lors du chargement des options:', err)
        setErreur('Erreur lors du chargement du formulaire')
      })
      .finally(() => setLoadingOptions(false))
  }, [])

  const [form, setForm] = useState({ ... })

  // ✅ NOUVEAU: Validation et soumission à l'API
  async function handleSubmit(e) {
    e.preventDefault()

    // Validation
    const champsObligatoires = [...]
    const champsVides = champsObligatoires.filter((champ) => !form[champ] || !form[champ].trim())
    
    if (champsVides.length > 0) {
      setErreur(`Veuillez remplir tous les champs obligatoires`)
      return
    }

    setChargement(true)
    setErreur(null)

    try {
      // ✅ NOUVEAU: Appeler l'API backend
      const result = await submitDemande(form)
      
      if (result.success) {
        // ✅ NOUVEAU: Utiliser l'ID du serveur
        const demandeId = result.demandeId
        
        // Générer les données pour le QR code
        const demandeData = {
          id: demandeId,
          demandeur: `${form.prenom} ${form.nom}`,
          dateCreation: new Date().toLocaleDateString('fr-FR'),
          passeport: form.numeroPasseport,
          typeVisa: form.typeVisa,
          email: form.email,
          telephone: form.telephone,
          ...form,
        }

        // Naviguer vers la page résultat
        navigate(`/insertion/result/${demandeId}`, { state: demandeData })
        
        // ✅ NOUVEAU: Optionnel - Envoyer le QR code par email
        // await sendQRCodeEmail(demandeId, form.email)
      } else {
        setErreur(result.message || 'Erreur lors de la création de la demande')
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors de la soumission du formulaire')
    } finally {
      setChargement(false)
    }
  }

  if (loadingOptions) {
    return <div>Chargement du formulaire...</div>
  }

  return (
    // Même JSX que avant, mais avec les select peuplés par les options
    <div style={styles.root}>
      {/* ... */}
      <select
        name="situationFamiliale"
        value={form.situationFamiliale}
        onChange={handleChange}
        // ...
      >
        <option value="">-- Sélectionner --</option>
        {formDataOptions?.situationFamiliales?.map(s => (
          <option key={s.id} value={s.id}>{s.libelle}</option>
        ))}
      </select>
      {/* ... */}
    </div>
  )
}
*/

// ==================================================
// FICHIER API À IMPLÉMENTER (insertionApi.js)
// ==================================================

/*
// src/api/insertionApi.js

const BASE_URL = process.env.REACT_APP_API_URL || '/api'

export async function submitDemande(formData) {
  try {
    const response = await fetch(`${BASE_URL}/demandes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      demandeId: data.id,
      message: data.message || 'Demande créée avec succès',
    }
  } catch (error) {
    console.error('Erreur submitDemande:', error)
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function getFormOptions() {
  try {
    const response = await fetch(`${BASE_URL}/form-options`)
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les options')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur getFormOptions:', error)
    // Retourner les options par défaut
    return getDefaultFormOptions()
  }
}

// ... autres fonctions
*/

// ==================================================
// FORMAT DE REQUÊTE HTTP (Backend)
// ==================================================

/*
POST /api/demandes
Content-Type: application/json

{
  "nom": "RAKOTO",
  "prenom": "Jean",
  "dateNaissance": "1990-05-15",
  "lieuNaissance": "Antananarivo",
  "telephone": "+261 XX XXX XX XX",
  "email": "jean@example.com",
  "adresse": "42 Rue de la Paix",
  "situationFamiliale": "celibataire",
  "nationalite": "madagascar",
  "numeroPasseport": "AB1234567",
  "dateDelivrance": "2020-01-15",
  "dateExpiration": "2030-01-15",
  "paysDelivrance": "Madagascar",
  "typeVisa": "tourisme",
  "typeDeuxDemande": "premiere"
}

RESPONSE: 200 OK
{
  "id": "D-20260503-001",
  "success": true,
  "message": "Demande créée avec succès",
  "dateCreation": "2026-05-03T10:00:00Z",
  "statut": "EN_ATTENTE"
}
*/

// ==================================================
// EXEMPLE DE SERVEUR NODEJS/EXPRESS (Backend)
// ==================================================

/*
// backend/routes/demandes.js

const express = require('express')
const router = express.Router()
const Demande = require('../models/Demande')
const { validateDemande } = require('../middleware/validation')
const { sendQRCodeEmail } = require('../services/email')

// POST /api/demandes
router.post('/demandes', validateDemande, async (req, res) => {
  try {
    // Générer un ID unique
    const demandeId = await Demande.generateId()

    // Créer la demande
    const demande = new Demande({
      id: demandeId,
      ...req.body,
      dateCreation: new Date(),
      statut: 'EN_ATTENTE',
    })

    // Sauvegarder en base de données
    await demande.save()

    // Envoyez optionnel du QR code par email
    // await sendQRCodeEmail(demandeId, req.body.email)

    res.json({
      id: demandeId,
      success: true,
      message: 'Demande créée avec succès',
      dateCreation: demande.dateCreation,
      statut: demande.statut,
    })
  } catch (error) {
    console.error('Erreur création demande:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la demande',
    })
  }
})

// GET /api/form-options
router.get('/form-options', async (req, res) => {
  try {
    const options = {
      situationFamiliales: await SituationFamiliale.findAll(),
      nationalites: await Nationalite.findAll(),
      typeVisas: await TypeVisa.findAll(),
      typeDemandes: await TypeDemande.findAll(),
    }
    res.json(options)
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors du chargement des options',
    })
  }
})

module.exports = router
*/

// ==================================================
// MODÈLE MONGODB (Exemple)
// ==================================================

/*
// backend/models/Demande.js

const mongoose = require('mongoose')

const demandeSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  nom: String,
  prenom: String,
  dateNaissance: Date,
  lieuNaissance: String,
  telephone: String,
  email: String,
  adresse: String,
  situationFamiliale: String,
  nationalite: String,
  numeroPasseport: String,
  dateDelivrance: Date,
  dateExpiration: Date,
  paysDelivrance: String,
  typeVisa: String,
  typeDeuxDemande: String,
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  statut: {
    type: String,
    enum: ['EN_ATTENTE', 'EN_COURS', 'APPROUVÉE', 'REJETÉE'],
    default: 'EN_ATTENTE',
  },
})

// Générer un ID unique
demandeSchema.statics.generateId = async function() {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
  const count = await this.countDocuments({
    dateCreation: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  })
  return `D-${dateStr}-${String(count + 1).padStart(3, '0')}`
}

module.exports = mongoose.model('Demande', demandeSchema)
*/

// ==================================================
// CONFIGURATION ENVIRONNEMENT (.env)
// ==================================================

/*
# .env

REACT_APP_API_URL=http://localhost:3001/api
# ou en production:
REACT_APP_API_URL=https://api.example.com/api
*/

// ==================================================
// TESTS UNITAIRES (Exemple avec Jest/Vitest)
// ==================================================

/*
// __tests__/insertionApi.test.js

import { submitDemande, getFormOptions } from '../api/insertionApi'

describe('InsertionApi', () => {
  
  test('submitDemande should create a new demand', async () => {
    const mockData = {
      nom: 'Test',
      prenom: 'User',
      // ... other fields
    }

    const result = await submitDemande(mockData)

    expect(result.success).toBe(true)
    expect(result.demandeId).toBeDefined()
    expect(result.demandeId).toMatch(/^D-\d{8}-\d{3}$/)
  })

  test('getFormOptions should return valid options', async () => {
    const options = await getFormOptions()

    expect(options.situationFamiliales).toBeDefined()
    expect(Array.isArray(options.situationFamiliales)).toBe(true)
  })

})
*/

// ==================================================
// UTILISATION DEPUIS LA CONSOLE
// ==================================================

/*
// Pour tester pendant le développement:

// 1. Ouvrir la console du navigateur (F12)

// 2. Importer les fonctions:
import { submitDemande, getFormOptions } from './api/insertionApi.js'

// 3. Tester la récupération des options:
await getFormOptions()

// 4. Tester la soumission:
const testData = {
  nom: 'RAKOTO',
  prenom: 'Jean',
  dateNaissance: '1990-05-15',
  lieuNaissance: 'Antananarivo',
  telephone: '+261 XX XXX XX XX',
  email: 'jean@example.com',
  adresse: '42 Rue de la Paix',
  situationFamiliale: 'celibataire',
  nationalite: 'madagascar',
  numeroPasseport: 'AB1234567',
  dateDelivrance: '2020-01-15',
  dateExpiration: '2030-01-15',
  paysDelivrance: 'Madagascar',
  typeVisa: 'tourisme',
  typeDeuxDemande: 'premiere'
}

const result = await submitDemande(testData)
console.log(result)
*/

// ==================================================
// CHECKLIST D'INTÉGRATION COMPLÈTE
// ==================================================

/*
□ Frontend
  □ Importer submitDemande et getFormOptions
  □ Charger les options au montage du composant
  □ Utiliser les options pour les selects
  □ Appeler submitDemande lors de la soumission
  □ Utiliser l'ID retourné du serveur
  □ Gérer les erreurs correctement

□ Backend
  □ Créer model/schema Demande
  □ Implémenter POST /api/demandes
  □ Implémenter GET /api/form-options
  □ Générer des IDs uniques
  □ Valider les données côté serveur
  □ Stocker en base de données

□ Email (Optionnel)
  □ Implémenter sendQRCodeEmail
  □ Créer template email avec QR code
  □ Envoyer après création de demande

□ Tests
  □ Tests unitaires API
  □ Tests d'intégration
  □ Tests E2E
  □ Tests de performance

□ Deployment
  □ Variables d'environnement configurées
  □ SSL/TLS activé
  □ Rate limiting configuré
  □ Logs activés
  □ Monitoring en place
*/

// ==================================================
// NOTES DE MIGRATION
// ==================================================

/*
1. Remplacer la génération d'ID en front par l'ID du serveur:
   AVANT: const demandeId = `D-${Date.now()}`
   APRÈS: const demandeId = result.demandeId

2. Charger les options du serveur:
   AVANT: Options en dur dans le composant
   APRÈS: Utiliser getFormOptions() via useEffect

3. Ajouter gestion d'erreurs réseau:
   - Retry automatique
   - Message d'erreur clair
   - Fallback options locale

4. Ajouter loader pendant l'envoi:
   - Désactiver le bouton
   - Afficher un spinner
   - Empêcher double-soumission

5. Optionnel: Sauvegarder en local storage:
   - Brouillon automatique
   - Récupération en cas d'erreur
   - Nettoyage après succès
*/

// ==================================================
// LIENS UTILES
// ==================================================

/*
- Documentation Fetch API: https://developer.mozilla.org/fr/docs/Web/API/Fetch_API
- documentation React Hooks: https://fr.react.dev/reference/react
- Documentation Express.js: https://expressjs.com/
- Documentation MongoDB: https://docs.mongodb.com/
- Documentation QRCode.react: https://www.npmjs.com/package/qrcode.react
*/

export default {
  message: 'Exemple complet d\'intégration avec API backend - À implémenter',
}
