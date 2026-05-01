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