import axios from 'axios';

const PUBLIC_BASE_URL = 'http://localhost:8080/api/public';
const API_BASE_URL = 'http://localhost:8080/api';

export const getDemandesByPasseport = (numero) =>
    axios.get(`${PUBLIC_BASE_URL}/passeport/${numero}`).then(r => r.data);

export const getDemandeById = (id) =>
    axios.get(`${PUBLIC_BASE_URL}/demande/${id}`).then(r => r.data);

export const saveDemandeMedia = (id, formData) =>
    axios.post(`${PUBLIC_BASE_URL}/demande/${id}/media`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(r => r.data);

export const getHistoriqueByDemandeId = (id) =>
    axios.get(`${PUBLIC_BASE_URL}/demande/${id}/historique`).then(r => r.data);

export const getFormData = () =>
    axios.get(`${PUBLIC_BASE_URL}/form-data`).then(r => r.data);

export const getPiecesByTypeVisa = (idTypeVisa) =>
    axios.get(`${PUBLIC_BASE_URL}/form-data/pieces/${idTypeVisa}`).then(r => r.data);

export const submitDemande = (formData) =>
    axios.post(`${API_BASE_URL}/demandes`, formData).then(r => r.data);

export const uploadPiecesJustificatives = (demandeId, formData) =>
    axios.post(`${API_BASE_URL}/demandes/${demandeId}/pieces`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(r => r.data);
