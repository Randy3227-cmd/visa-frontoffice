// visaApi.js

const API_URL = 'http://localhost:8080/api'

async function verifierNumero(numero) {
    const url = `${API_URL}/demandes/verifier-numero/${encodeURIComponent(numero)}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Numéro introuvable ou invalide')
    }
    return response.json()
}

export { verifierNumero }
