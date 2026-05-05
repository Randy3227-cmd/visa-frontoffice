import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/public';

export const getDemandesByPasseport = (numero) =>
    axios.get(`${BASE_URL}/passeport/${numero}`).then(r => r.data);

export const getDemandeById = (id) =>
    axios.get(`${BASE_URL}/demande/${id}`).then(r => r.data);

export const getHistoriqueByDemandeId = (id) =>
    axios.get(`${BASE_URL}/demande/${id}/historique`).then(r => r.data);

export const getFormData = () =>
    axios.get(`${BASE_URL}/form-data`).then(r => r.data);

export const getPiecesByTypeVisa = (idTypeVisa) =>
    axios.get(`${BASE_URL}/form-data/pieces/${idTypeVisa}`).then(r => r.data);

export const submitDemande = (formData) =>
    axios.post(`${BASE_URL}/demande/submit`, formData).then(r => r.data);
