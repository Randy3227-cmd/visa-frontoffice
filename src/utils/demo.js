/**
 * Fichier de Démonstration - Utilisation du Formulaire d'Insertion
 * 
 * Ce fichier montre comment utiliser les nouveaux composants
 * et comment tester le formulaire d'insertion.
 */

// ====================================
// 1. IMPORTS NÉCESSAIRES
// ====================================

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
// import { submitDemande, getFormOptions } from '../api/insertionApi'

// ====================================
// 2. DONNÉES DE TEST
// ====================================

const demandeeTest = {
  nom: 'RAKOTO',
  prenom: 'Jean',
  dateNaissance: '1990-05-15',
  lieuNaissance: 'Antananarivo',
  telephone: '+261 XX XXX XX XX',
  email: 'jean.rakoto@example.com',
  adresse: '42 Rue de la Paix, 101 Antananarivo',
  situationFamiliale: 'celibataire',
  nationalite: 'madagascar',
  numeroPasseport: 'AB1234567',
  dateDelivrance: '2020-01-15',
  dateExpiration: '2030-01-15',
  paysDelivrance: 'Madagascar',
  typeVisa: 'tourisme',
  typeDeuxDemande: 'premiere',
}

const demandeTest2 = {
  nom: 'DUPONT',
  prenom: 'Marie',
  dateNaissance: '1995-08-22',
  lieuNaissance: 'Paris',
  telephone: '+33 6 12 34 56 78',
  email: 'marie.dupont@example.com',
  adresse: '123 Avenue de la République, 75001 Paris',
  situationFamiliale: 'marie',
  nationalite: 'france',
  numeroPasseport: 'CD9876543',
  dateDelivrance: '2021-06-10',
  dateExpiration: '2031-06-10',
  paysDelivrance: 'France',
  typeVisa: 'affaires',
  typeDeuxDemande: 'renouvellement',
}

// ====================================
// 3. FONCTIONS DE TEST
// ====================================

/**
 * Remplir le formulaire avec des données de test
 * À utiliser dans le navigateur via console
 */
export function remplirFormulaireTest(testNumber = 1) {
  const formData = testNumber === 1 ? demandeTest : demandeTest2

  // Trouver tous les inputs et les remplir
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea')
  inputs.forEach((input) => {
    if (formData[input.name]) {
      input.value = formData[input.name]
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  // Remplir les selects
  const selects = document.querySelectorAll('select')
  selects.forEach((select) => {
    if (formData[select.name]) {
      select.value = formData[select.name]
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  console.log(`✅ Formulaire rempli avec les données de test ${testNumber}`)
}

/**
 * Afficher les données actuelles du formulaire
 */
export function afficherDonneesFormulaire() {
  const formData = {}
  const inputs = document.querySelectorAll('input, select, textarea')
  inputs.forEach((input) => {
    if (input.name) {
      formData[input.name] = input.value
    }
  })
  console.table(formData)
  return formData
}

/**
 * Soumettre le formulaire programmatiquement
 */
export function soumettreFormulaire() {
  const form = document.querySelector('form')
  if (form) {
    form.dispatchEvent(new Event('submit', { bubbles: true }))
    console.log('✅ Formulaire soumis')
  } else {
    console.error('❌ Formulaire non trouvé')
  }
}

/**
 * Vérifier les champs obligatoires
 */
export function verifierChampsObligatoires() {
  const champsObligatoires = [
    'nom',
    'prenom',
    'dateNaissance',
    'lieuNaissance',
    'telephone',
    'email',
    'adresse',
    'situationFamiliale',
    'nationalite',
    'numeroPasseport',
    'dateDelivrance',
    'dateExpiration',
    'paysDelivrance',
    'typeVisa',
    'typeDeuxDemande',
  ]

  const resultats = {}
  const inputs = document.querySelectorAll('input, select, textarea')

  inputs.forEach((input) => {
    if (champsObligatoires.includes(input.name)) {
      resultats[input.name] = {
        valeur: input.value,
        rempli: !!input.value && input.value.trim() !== '',
      }
    }
  })

  console.table(resultats)

  const champsMains = Object.values(resultats).filter((r) => !r.rempli)
  console.log(`ℹ️ Champs manquants : ${champsMains.length}`)

  return Object.values(resultats).every((r) => r.rempli)
}

/**
 * Simuler la validation du formulaire
 */
export function validerFormulaire() {
  const isValid = verifierChampsObligatoires()
  if (isValid) {
    console.log('✅ Formulaire valide')
  } else {
    console.error('❌ Formulaire invalide - Des champs sont manquants')
  }
  return isValid
}

/**
 * Obtenir l'ID de la demande créée
 */
export function obtenirIdDemande() {
  const url = window.location.pathname
  const match = url.match(/\/insertion\/result\/(.+)/)
  if (match) {
    return match[1]
  }
  return null
}

/**
 * Télécharger le QR code
 */
export function telechargerQRCode() {
  const canvas = document.querySelector('canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `QR-Code-${obtenirIdDemande()}.png`
    link.click()
    console.log('✅ QR Code téléchargé')
  } else {
    console.error('❌ QR Code canvas non trouvé')
  }
}

/**
 * Afficher le contenu du QR code
 */
export function afficherInfosQRCode() {
  const url = window.location.pathname
  const id = url.match(/\/insertion\/result\/(.+)/)?.[1]
  if (id) {
    const qrUrl = `${window.location.origin}/demandes/${id}`
    console.log('📱 URL encodée dans le QR Code:', qrUrl)
    return qrUrl
  }
  return null
}

/**
 * Scanner le QR code (simulation)
 */
export function simulerScanQRCode() {
  const qrUrl = afficherInfosQRCode()
  if (qrUrl) {
    console.log(`🔗 Navigation vers: ${qrUrl}`)
    window.location.href = qrUrl
  }
}

// ====================================
// 4. COMPOSANT DE TEST (OPTIONNEL)
// ====================================

export function FormTestHelper() {
  const [showHelpers, setShowHelpers] = useState(false)

  if (!showHelpers) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0f2d52',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 999,
        }}
        onClick={() => setShowHelpers(true)}
      >
        🧪 Test
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff',
        border: '2px solid #0f2d52',
        borderRadius: '10px',
        padding: '15px',
        maxWidth: '250px',
        zIndex: 999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#0f2d52' }}>
        🧪 Outils de Test
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => remplirFormulaireTest(1)}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#f0f6ff', border: '1px solid #d1dce8', borderRadius: '4px' }}
        >
          Remplir Test 1
        </button>

        <button
          onClick={() => remplirFormulaireTest(2)}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#f0f6ff', border: '1px solid #d1dce8', borderRadius: '4px' }}
        >
          Remplir Test 2
        </button>

        <button
          onClick={() => afficherDonneesFormulaire()}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '4px' }}
        >
          Afficher données
        </button>

        <button
          onClick={() => verifierChampsObligatoires()}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '4px' }}
        >
          Vérifier champs
        </button>

        <button
          onClick={() => soumettreFormulaire()}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '4px' }}
        >
          Soumettre
        </button>

        <button
          onClick={() => telechargerQRCode()}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '4px' }}
        >
          Télécharger QR
        </button>

        <button
          onClick={() => setShowHelpers(false)}
          style={{ padding: '6px', fontSize: '11px', cursor: 'pointer', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px' }}
        >
          Fermer
        </button>
      </div>
    </div>
  )
}

// ====================================
// 5. UTILISATION EN CONSOLE
// ====================================

/**
 * Pour utiliser dans la console du navigateur:
 * 
 * 1. Importer les fonctions:
 *    import { remplirFormulaireTest, soumettreFormulaire, ... } from './demo'
 * 
 * 2. Remplir le formulaire:
 *    remplirFormulaireTest(1)
 * 
 * 3. Vérifier les données:
 *    afficherDonneesFormulaire()
 * 
 * 4. Soumettre:
 *    soumettreFormulaire()
 * 
 * 5. Télécharger le QR:
 *    telechargerQRCode()
 * 
 * 6. Simuler un scan:
 *    simulerScanQRCode()
 */

// ====================================
// 6. EXPORT GLOBAL (DEBUG MODE)
// ====================================

if (process.env.NODE_ENV === 'development') {
  window.visa = {
    remplirFormulaireTest,
    afficherDonneesFormulaire,
    soumettreFormulaire,
    verifierChampsObligatoires,
    validerFormulaire,
    obtenirIdDemande,
    telechargerQRCode,
    afficherInfosQRCode,
    simulerScanQRCode,
  }
  console.log('🧪 Outils de test disponibles: window.visa')
}
