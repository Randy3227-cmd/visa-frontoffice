# 🚀 QUICK START - Démarrage Rapide

## ⏱️ 2 minutes pour commencer

### 1️⃣ Démarrer le serveur de développement
```bash
npm run dev
```

Vous verrez:
```
  VITE v8.0.10  ready in 123 ms

  ➜  Local:    http://localhost:5173/
  ➜  press h + enter to show help
```

### 2️⃣ Ouvrir dans le navigateur
Allez à: **http://localhost:5173**

### 3️⃣ Cliquer sur "Créer une demande"
Vous verrez le nouveau formulaire d'insertion.

### 4️⃣ Remplir le formulaire

**Option A: Faire rapidement avec données de test**
```javascript
// Ouvrir console (F12 → Console tab)
window.visa.remplirFormulaireTest(1)
window.visa.soumettreFormulaire()
```

**Option B: Remplir manuellement**
- Tout remplir avec des données quelconques
- Cliquer "Soumettre"

### 5️⃣ Voir votre QR Code
Vous verrez:
- ✅ Message de succès
- 📱 Votre QR Code unique
- 📋 Récapitulatif de la demande
- 💾 Bouton "Télécharger QR Code"
- 🔗 Boutons "Voir le détail" et "Accueil"

---

## 🎮 Commandes Utiles

```javascript
// Console du navigateur (F12)

// Remplir avec données test
window.visa.remplirFormulaireTest(1)  // Données 1
window.visa.remplirFormulaireTest(2)  // Données 2

// Voir les données actuelles
window.visa.afficherDonneesFormulaire()

// Valider le formulaire
window.visa.validerFormulaire()

// Soumettre
window.visa.soumettreFormulaire()

// Télécharger le QR code
window.visa.telechargerQRCode()

// Voir URL du QR
window.visa.afficherInfosQRCode()
```

---

## 🎯 Cas de Test

### Test 1: Remplissage Automatique
```javascript
window.visa.remplirFormulaireTest(1)
window.visa.afficherDonneesFormulaire()
// → Montre toutes les données remplies
```

### Test 2: Validation
```javascript
window.visa.remplirFormulaireTest(1)
window.visa.validerFormulaire()
// → Affiche "✅ Formulaire valide"
```

### Test 3: Soumission Complète
```javascript
window.visa.remplirFormulaireTest(1)
window.visa.soumettreFormulaire()
// → Redirige vers page résultat avec QR code
```

### Test 4: QR Code
```javascript
// Une fois sur la page résultat
window.visa.telechargerQRCode()
// → Télécharge QR-Code-D-{timestamp}-001.png

window.visa.afficherInfosQRCode()
// → Affiche l'URL encodée dans le QR
```

---

## 📁 Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `/src/pages/InsertionForm.jsx` | Formulaire d'insertion |
| `/src/pages/InsertionResultPage.jsx` | Page résultat + QR |
| `/src/api/insertionApi.js` | Appels API |
| `/src/utils/demo.js` | Outils de test |
| `/src/App.jsx` | Routes |

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module"
```bash
npm install
npm run dev
```

### QR code n'apparaît pas
Vérifiez que `qrcode.react` est installé:
```bash
npm list qrcode.react
```

Si absent:
```bash
npm install qrcode.react
```

### Port 5173 déjà utilisé
```bash
npm run dev -- --port 3000
```

---

## 📊 Premier Test Complet

**Temps estimé: 3 minutes**

1. Lancer: `npm run dev` (30s)
2. Ouvrir navigateur (10s)
3. Cliquer "Créer" → `/insertion` (10s)
4. Remplir formulaire: `window.visa.remplirFormulaireTest(1)` (5s)
5. Soumettre: `window.visa.soumettreFormulaire()` (5s)
6. Voir résultat + QR code (30s)
7. Télécharger: `window.visa.telechargerQRCode()` (10s)
8. ✅ Succès !

---

## 📚 Documentation

Pour aller plus loin:

- **[NEW_FEATURE_README.md](./NEW_FEATURE_README.md)** - Guide utilisateur
- **[INSERTION_FORM_README.md](./INSERTION_FORM_README.md)** - Vue d'ensemble technique  
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Intégration backend
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Structure complète

---

## ✨ Points Clés

- ✅ Pas de compte nécessaire
- ✅ Pas de backend API requise pour tester
- ✅ Données non persistées (brouillon)
- ✅ QR code généré localement
- ✅ Responsive (mobile/desktop)
- ✅ Tout gratuit et open source

---

## 🎉 C'est Prêt !

Tu peux maintenant:

1. **Créer une demande** → `/insertion`
2. **Générer un QR code** → Automatique
3. **Télécharger le QR** → PNG
4. **Suivre la demande** → Via QR code

Enjoy! 🚀

---

**Template rapide pour tester:**
```javascript
// Très rapide (30s)
window.visa.remplirFormulaireTest(1)
window.visa.soumettreFormulaire()
// Boom! QR code prêt! 📱
```
