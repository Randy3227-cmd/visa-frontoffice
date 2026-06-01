import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDemandeById } from '../api/insertionApi';
import '../App-light.css';

export default function DemandeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [demande, setDemande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getDemandeById(id)
            .then(data => {
                setDemande(data);
            })
            .catch(err => {
                setError(err.message || 'Erreur lors de la récupération des détails.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="page-light">
                <div className="spinner-light"></div>
            </div>
        );
    }

    if (error || !demande) {
        return (
            <div className="page-light">
                <div style={{ maxWidth: 760, margin: '2rem auto', textAlign: 'center' }}>
                    <div style={{ color: '#ff5252', background: '#ffebee', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
                        {error || 'Demande introuvable'}
                    </div>
                    <Link to="/" className="btn-secondary-light" style={{ display: 'inline-block' }}>Retour à l'accueil</Link>
                </div>
            </div>
        );
    }

    // Enforce business rule:
    // If demand status is other than "Dossier crée", the "photo et signature" button becomes disabled.
    const statut = demande.statutDemandeLibelle ? demande.statutDemandeLibelle.toLowerCase() : '';
    const isCaptureDisabled = statut !== 'dossier crée' && statut !== 'dossier cree';

    return (
        <div className="page-light">
            <div className="top-bar">
                <div className="top-bar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="2" width="18" height="20" rx="3" />
                        <circle cx="12" cy="10" r="3.5" />
                        <path d="M7 17.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
                    </svg>
                </div>
                <div className="top-bar-text">
                    <h1>Détails de la demande #{demande.id}</h1>
                    <p>Statut : <span style={{ fontWeight: 600, color: '#1d6fbf' }}>{demande.statutDemandeLibelle || 'En attente'}</span></p>
                </div>
                <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    &#8592; Retour
                </button>
            </div>

            <div className="form-light">
                {/* Informations du demandeur */}
                <fieldset>
                    <legend>👤 Informations du demandeur</legend>
                    <div className="fields">
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Nom & Prénom</label>
                            <span style={{ fontSize: '15px', color: '#1a2535', fontWeight: '500' }}>{demande.nomDemandeur} {demande.prenomDemandeur || ''}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Date & Lieu de naissance</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.dateNaissanceDemandeur || '—'} à {demande.lieuNaissanceDemandeur || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Téléphone</label>
                            <span style={{ fontSize: '14px', color: '#1a2535', fontFamily: 'monospace' }}>{demande.telephoneDemandeur || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Email</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.emailDemandeur || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Situation Familiale</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.situationFamilialeDemandeur || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Nationalité</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.nationaliteDemandeur || '—'}</span>
                        </div>
                        <div className="field field-full">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Adresse</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.adresseDemandeur || '—'}</span>
                        </div>
                    </div>
                </fieldset>

                {/* Photo & Signature */}
                <fieldset>
                    <legend>📸 Photo & Signature digitale</legend>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
                        {/* Photo Box */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #d1dce8', borderRadius: '8px', padding: '16px', background: '#fafcff' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#7a95ab', textTransform: 'uppercase', marginBottom: '12px' }}>Photo d'identité</span>
                            {demande.photoIdentite ? (
                                <img src={demande.photoIdentite} alt="Identité" style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #d1dce8' }} />
                            ) : (
                                <div style={{ width: '180px', height: '180px', borderRadius: '6px', border: '2px dashed #d1dce8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a95ab', fontSize: '13px', background: '#f5f7fa' }}>
                                    Photo manquante
                                </div>
                            )}
                        </div>

                        {/* Signature Box */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #d1dce8', borderRadius: '8px', padding: '16px', background: '#fafcff' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#7a95ab', textTransform: 'uppercase', marginBottom: '12px' }}>Signature Digitale</span>
                            {demande.signatureDigital ? (
                                <img src={demande.signatureDigital} alt="Signature" style={{ width: '220px', height: '120px', objectFit: 'contain', background: '#fff', borderRadius: '6px', border: '2px solid #d1dce8', margin: '30px 0' }} />
                            ) : (
                                <div style={{ width: '220px', height: '180px', borderRadius: '6px', border: '2px dashed #d1dce8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a95ab', fontSize: '13px', background: '#f5f7fa' }}>
                                    Signature manquante
                                </div>
                            )}
                        </div>
                    </div>
                </fieldset>

                {/* Passeport & Visa */}
                <fieldset>
                    <legend>🪪 Passeport & Référence Visa</legend>
                    <div className="fields">
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Numéro de passeport</label>
                            <span style={{ fontSize: '14px', color: '#1a2535', fontFamily: 'monospace', fontWeight: '500' }}>{demande.numeroPasseport || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Pays de délivrance</label>
                            <span style={{ fontSize: '14px', color: '#1a2535' }}>{demande.paysDelivrancePasseport || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Date de délivrance</label>
                            <span style={{ fontSize: '14px', color: '#1a2535', fontFamily: 'monospace' }}>{demande.dateDelivrancePasseport || '—'}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Date d'expiration</label>
                            <span style={{ fontSize: '14px', color: '#1a2535', fontFamily: 'monospace' }}>{demande.dateExpirationPasseport || '—'}</span>
                        </div>
                        <div className="field field-full">
                            <label style={{ fontSize: '11px', color: '#7a95ab', textTransform: 'uppercase' }}>Numéro de référence Visa transformable</label>
                            <span style={{ fontSize: '14px', color: '#1a2535', fontFamily: 'monospace', fontWeight: '500' }}>{demande.visaTransformableLibelle || '—'}</span>
                        </div>
                    </div>
                </fieldset>

                {/* Actions */}
                <div className="form-footer" style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => navigate(`/demande/${demande.id}/capture`)}
                        className="btn-submit"
                        disabled={isCaptureDisabled}
                        style={{
                            background: isCaptureDisabled ? '#7a95ab' : '#0f2d52',
                            cursor: isCaptureDisabled ? 'not-allowed' : 'pointer',
                            opacity: isCaptureDisabled ? 0.6 : 1,
                        }}
                    >
                        📸 Photo et signature
                    </button>
                </div>
            </div>
        </div>
    );
}
