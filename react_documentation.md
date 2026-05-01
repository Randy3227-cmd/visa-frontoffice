# 📘 Documentation React — Projet `visa-frontoffice`

> Stack : **React 19 + Vite 8** — Vanilla CSS — Sans librairie UI externe  
> Sprint actif : **Sprint 4** (Liste de demandes + QR Code)

---

## Table des matières

1. [Structure du projet](#1-structure-du-projet)
2. [Démarrage](#2-démarrage)
3. [Concepts fondamentaux React](#3-concepts-fondamentaux-react)
4. [Les Hooks essentiels](#4-les-hooks-essentiels)
5. [Routing (navigation entre pages)](#5-routing-navigation-entre-pages)
6. [Appels API vers le backend](#6-appels-api-vers-le-backend)
7. [Gestion de formulaires](#7-gestion-de-formulaires)
8. [Implémentation Sprint 4](#8-implémentation-sprint-4)
9. [QR Code](#9-qr-code)
10. [Patterns & bonnes pratiques](#10-patterns--bonnes-pratiques)

---

## 1. Structure du projet

```
visa-frontoffice/
├── index.html              ← Point d'entrée HTML
├── vite.config.js          ← Config Vite (proxy API ici)
├── package.json
└── src/
    ├── main.jsx            ← Montage React dans le DOM
    ├── App.jsx             ← Composant racine + routes
    ├── App.css
    ├── index.css
    ├── api/                ← Fonctions fetch vers le backend
    │   └── visaApi.js
    ├── components/         ← Composants réutilisables
    │   └── Form.jsx
    └── pages/              ← Une page = une "vue" complète
        ├── SearchPage.jsx
        ├── ListeDemandes.jsx
        ├── DetailDemande.jsx
        └── QRCodePage.jsx
```

**Règle simple :**
- `pages/` → une page entière (correspond à une URL)
- `components/` → un morceau d'interface réutilisable dans plusieurs pages

---

## 2. Démarrage

```bash
# Installer les dépendances (une seule fois)
npm install

# Lancer le serveur de développement
npm run dev
# → Ouvre http://localhost:5173
```

Pour connecter le front au backend Spring Boot sur le port 8080, ajouter un **proxy** dans `vite.config.js` :

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

Ainsi, un appel à `/api/demandes` dans le code React sera redirigé vers `http://localhost:8080/api/demandes`.

---

## 3. Concepts fondamentaux React

### Composant

Un composant = une fonction qui retourne du **JSX** (HTML + JS mélangés).

```jsx
// src/components/MonComposant.jsx
export default function MonComposant() {
  return (
    <div className="carte">
      <h2>Titre</h2>
      <p>Contenu</p>
    </div>
  )
}
```

### Props

Les props sont des **paramètres** passés au composant depuis son parent.

```jsx
// Définition
function CarteDemandeProps({ numeroDemande, statut, date }) {
  return (
    <div>
      <p>Demande n° {numeroDemande}</p>
      <p>Statut : {statut}</p>
      <p>Date : {date}</p>
    </div>
  )
}

// Utilisation
<CarteDemande numeroDemande="D-2025-001" statut="En cours" date="01/05/2026" />
```

### JSX — règles importantes

```jsx
// ✅ Un seul élément racine (ou fragment <>)
return (
  <>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </>
)

// ✅ className au lieu de class
<div className="container">

// ✅ Les expressions JS dans {}
<p>{numeroDemande.toUpperCase()}</p>

// ✅ Affichage conditionnel
{estCharge && <p>Chargement...</p>}
{erreur ? <p>Erreur</p> : <p>OK</p>}

// ✅ Afficher une liste
{demandes.map(d => (
  <div key={d.id}>{d.numeroDemande}</div>
))}
```

> ⚠️ Chaque élément d'une liste **doit avoir un `key` unique**.

---

## 4. Les Hooks essentiels

### `useState` — stocker une valeur qui change

```jsx
import { useState } from 'react'

function Exemple() {
  const [valeur, setValeur] = useState('')  // '' = valeur initiale

  return (
    <input
      value={valeur}
      onChange={(e) => setValeur(e.target.value)}
    />
  )
}
```

| Concept | Explication |
|---|---|
| `valeur` | La valeur actuelle |
| `setValeur(...)` | Fonction pour la modifier |
| Re-render | React re-affiche le composant quand `setValeur` est appelé |

### `useEffect` — déclencher du code au bon moment

```jsx
import { useState, useEffect } from 'react'

function Exemple() {
  const [demandes, setDemandes] = useState([])

  // S'exécute une seule fois au montage du composant
  useEffect(() => {
    fetch('/api/demandes')
      .then(res => res.json())
      .then(data => setDemandes(data))
  }, [])  // ← tableau vide = une seule fois

  return <div>{demandes.length} demandes</div>
}
```

**Le tableau de dépendances `[]` :**

```jsx
useEffect(() => { ... }, [])          // Au montage seulement
useEffect(() => { ... }, [id])        // Quand `id` change
useEffect(() => { ... })              // À chaque render (rare)
```

---

## 5. Routing (navigation entre pages)

Installer react-router-dom :

```bash
npm install react-router-dom
```

### Configuration dans `main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

### Définir les routes dans `App.jsx`

```jsx
import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage.jsx'
import ListeDemandes from './pages/ListeDemandes.jsx'
import DetailDemande from './pages/DetailDemande.jsx'
import QRCodePage from './pages/QRCodePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/"                  element={<SearchPage />} />
      <Route path="/demandes"          element={<ListeDemandes />} />
      <Route path="/demandes/:id"      element={<DetailDemande />} />
      <Route path="/qrcode/:idDemande" element={<QRCodePage />} />
    </Routes>
  )
}

export default App
```

### Navigation dans le code

```jsx
import { useNavigate, useParams, Link } from 'react-router-dom'

// Naviguer programmatiquement (après un submit par ex.)
const navigate = useNavigate()
navigate('/demandes')
navigate(`/demandes/${id}`)
navigate(-1)  // retour en arrière

// Lien cliquable
<Link to="/demandes">Voir les demandes</Link>

// Récupérer un paramètre d'URL (:id, :idDemande...)
const { id } = useParams()
```

---

## 6. Appels API vers le backend

### Fichier centralisé `src/api/visaApi.js`

```js
// src/api/visaApi.js
const BASE_URL = '/api'

// Vérifier si un numéro est un passeport ou une demande
export async function verifierNumero(numero) {
  const res = await fetch(`${BASE_URL}/verifier/${numero}`)
  if (!res.ok) throw new Error('Numéro non trouvé')
  return res.json()  // { type: 'PASSEPORT' | 'DEMANDE', id: ... }
}

// Récupérer les demandes liées à un passeport
export async function getDemandesParPasseport(numeroPasseport) {
  const res = await fetch(`${BASE_URL}/demandes?passeport=${numeroPasseport}`)
  if (!res.ok) throw new Error('Erreur serveur')
  return res.json()
}

// Récupérer le détail d'une demande
export async function getDetailDemande(id) {
  const res = await fetch(`${BASE_URL}/demandes/${id}`)
  if (!res.ok) throw new Error('Demande introuvable')
  return res.json()
}
```

### Utilisation dans un composant avec gestion d'erreur

```jsx
import { useState, useEffect } from 'react'
import { getDemandesParPasseport } from '../api/visaApi'

function ListeDemandes({ numeroPasseport }) {
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    setChargement(true)
    getDemandesParPasseport(numeroPasseport)
      .then(data => setDemandes(data))
      .catch(err => setErreur(err.message))
      .finally(() => setChargement(false))
  }, [numeroPasseport])

  if (chargement) return <p>Chargement...</p>
  if (erreur)    return <p>Erreur : {erreur}</p>

  return (
    <ul>
      {demandes.map(d => (
        <li key={d.id}>{d.numeroDemande} — {d.statut}</li>
      ))}
    </ul>
  )
}
```

---

## 7. Gestion de formulaires

### Formulaire contrôlé (recommandé)

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifierNumero } from '../api/visaApi'

export default function Form() {
  const [numero, setNumero] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()  // ← IMPORTANT : empêche le rechargement de la page

    if (!numero.trim()) {
      setErreur('Veuillez entrer un numéro')
      return
    }

    setChargement(true)
    setErreur(null)

    try {
      const result = await verifierNumero(numero)

      if (result.type === 'PASSEPORT') {
        navigate(`/demandes?passeport=${numero}`)
      } else {
        navigate(`/demandes?demande=${numero}&passeport=${result.numeroPasseport}`)
      }
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="numero">Numéro de passeport ou de demande</label>
        <input
          id="numero"
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ex: P-12345 ou D-2025-001"
          disabled={chargement}
        />
        {erreur && <p className="erreur">{erreur}</p>}
        <button type="submit" disabled={chargement}>
          {chargement ? 'Vérification...' : 'Valider'}
        </button>
      </form>
    </div>
  )
}
```

---

## 8. Implémentation Sprint 4

### Page de recherche — `src/pages/SearchPage.jsx`

```jsx
import Form from '../components/Form.jsx'

export default function SearchPage() {
  return (
    <main>
      <h1>Suivi de demande de visa</h1>
      <Form />
    </main>
  )
}
```

### Page liste des demandes — `src/pages/ListeDemandes.jsx`

```jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { getDemandesParPasseport } from '../api/visaApi'

export default function ListeDemandes() {
  const [searchParams] = useSearchParams()
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const navigate = useNavigate()

  const numeroPasseport = searchParams.get('passeport')
  const numeroDemandePrioritaire = searchParams.get('demande')

  useEffect(() => {
    if (!numeroPasseport) {
      navigate('/')
      return
    }
    getDemandesParPasseport(numeroPasseport)
      .then(data => {
        // Si recherche par numéro demande : mettre la demande prioritaire en premier
        if (numeroDemandePrioritaire) {
          const prioritaire = data.find(d => d.numeroDemande === numeroDemandePrioritaire)
          const reste = data.filter(d => d.numeroDemande !== numeroDemandePrioritaire)
          setDemandes(prioritaire ? [prioritaire, ...reste] : data)
        } else {
          setDemandes(data)  // Déjà trié par date desc côté backend
        }
      })
      .catch(err => setErreur(err.message))
      .finally(() => setChargement(false))
  }, [numeroPasseport, numeroDemandePrioritaire, navigate])

  if (chargement) return <p>Chargement...</p>
  if (erreur)    return <p>Erreur : {erreur}</p>

  return (
    <main>
      <h1>Demandes pour le passeport {numeroPasseport}</h1>
      <Link to="/">← Nouvelle recherche</Link>
      <ul className="liste-demandes">
        {demandes.map((d, index) => (
          <li
            key={d.id}
            className={index === 0 && numeroDemandePrioritaire ? 'prioritaire' : ''}
          >
            <span>N° {d.numeroDemande}</span>
            <span>{d.statut}</span>
            <span>{new Date(d.dateCreation).toLocaleDateString('fr-FR')}</span>
            <Link to={`/demandes/${d.id}`}>Voir le détail</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

### Page QR Code — `src/pages/QRCodePage.jsx`

```jsx
import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'  // npm install qrcode

export default function QRCodePage() {
  const { idDemande } = useParams()
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  // Exemple de contenu du QR code — à adapter avec les vraies données
  const contenuQR = `Demande: ${idDemande}\n01/05/2026: Dossier créé`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, contenuQR, { width: 250 })
    }
  }, [contenuQR])

  function allerVersListe() {
    navigate('/demandes')
  }

  return (
    <main>
      <h1>Votre QR Code</h1>
      <p>Conservez ce QR code pour suivre l'état de votre demande.</p>
      <canvas ref={canvasRef}></canvas>
      <button onClick={allerVersListe}>
        Voir la liste des demandes
      </button>
    </main>
  )
}
```

---

## 9. QR Code

### Installation

```bash
npm install qrcode
```

### Deux façons de générer un QR code

**Option A — canvas (meilleur rendu)**

```jsx
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

function QRCanvas({ texte }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, texte, { width: 250 })
  }, [texte])

  return <canvas ref={canvasRef} />
}
```

**Option B — image base64 (facile à télécharger)**

```jsx
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

function QRImage({ texte }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    QRCode.toDataURL(texte).then(url => setSrc(url))
  }, [texte])

  return <img src={src} alt="QR Code de la demande" />
}
```

### Contenu suggéré du QR code (Sprint 4)

```js
const contenu = [
  `Demande : ${demande.numeroDemande}`,
  `Passeport : ${demande.numeroPasseport}`,
  ...demande.historique.map(h =>
    `${new Date(h.date).toLocaleDateString('fr-FR')} : ${h.statut}`
  )
].join('\n')
```

---

## 10. Patterns & bonnes pratiques

### Séparer les appels API du composant

```
src/api/visaApi.js     ← toute la logique fetch ici
src/pages/MaPage.jsx   ← importe et utilise les fonctions
```

### Nommer clairement les états

```jsx
// ✅ Clair
const [chargement, setChargement] = useState(false)
const [erreur, setErreur] = useState(null)
const [demandes, setDemandes] = useState([])

// ❌ Vague
const [data, setData] = useState(null)
const [flag, setFlag] = useState(false)
```

### Pattern chargement / erreur / données

```jsx
if (chargement) return <p>Chargement...</p>
if (erreur)     return <p className="erreur">Erreur : {erreur}</p>
if (!demandes.length) return <p>Aucune demande trouvée.</p>

return (
  // afficher les données
)
```

### `useRef` pour accéder au DOM (canvas QR code)

```jsx
const canvasRef = useRef(null)
// Plus tard dans useEffect :
canvasRef.current  // ← l'élément DOM réel
```

### Résumé des imports courants

```jsx
// React de base
import { useState, useEffect, useRef } from 'react'

// Routing
import { Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

// Ses propres fichiers
import Form from '../components/Form.jsx'
import { verifierNumero } from '../api/visaApi.js'
```

---

## Commandes utiles

| Commande | Action |
|---|---|
| `npm install` | Installer les dépendances |
| `npm run dev` | Lancer en développement |
| `npm install react-router-dom` | Ajouter le routing |
| `npm install qrcode` | Ajouter la génération de QR code |
| `npm run build` | Build de production |

---

*Documentation générée pour le projet `visa-frontoffice` — Sprint 4 — Mai 2026*
