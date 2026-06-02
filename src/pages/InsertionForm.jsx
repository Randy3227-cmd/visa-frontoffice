import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFormData, submitDemande, getPiecesByTypeVisa, uploadPiecesJustificatives } from '../api/insertionApi';
import '../App-light.css';

export default function DemandeFormPage() {
    const navigate = useNavigate();
    const [formDataOptions, setFormDataOptions] = useState(null);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nom: '', prenom: '', dateNaissance: '', lieuNaissance: '',
        telephone: '', email: '', adresse: '', idSituationFamiliale: '', idNationalite: '',
        numeroPasseport: '', dateDelivrance: '', dateExpiration: '', paysDelivrance: '', numeroReference: '',
        typeVisaId: '', typeDemandeId: ''
    });

    const [piecesList, setPiecesList] = useState([]);
    const [pieces, setPieces] = useState({});
    const [pieceFiles, setPieceFiles] = useState({});

    const selectedPiecesCount = piecesList.filter(p => pieces[`pieceStatut_${p.id}`]).length;

    useEffect(() => {
        getFormData().then(data => {
            setFormDataOptions(data);
        }).catch(err => {
            setError(err.message);
        }).finally(() => {
            setLoadingOptions(false);
        });
    }, []);

    // Load pieces dynamically based on selected visa type
    useEffect(() => {
        if (!form.typeVisaId) {
            setPiecesList([]);
            setPieces({});
            setPieceFiles({});
            return;
        }
        getPiecesByTypeVisa(form.typeVisaId).then(piecesData => {
            setPiecesList(piecesData);
            const p = {};
            piecesData.forEach(pc => { p[`pieceStatut_${pc.id}`] = false; });
            setPieces(p);
            setPieceFiles({});
        }).catch(err => {
            setError(err.message || 'Impossible de charger les pièces justificatives');
            console.error("Error loading pieces", err);
        });
    }, [form.typeVisaId]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handlePieceChange = (e) => setPieces({ ...pieces, [e.target.name]: e.target.checked });
    const handlePieceFileChange = (pieceId, file) => {
        const key = `pieceStatut_${pieceId}`;
        setPieceFiles(prev => ({ ...prev, [pieceId]: file || null }));
        setPieces(prev => ({ ...prev, [key]: Boolean(file) || prev[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const payload = { ...form };
            Object.keys(pieces).forEach(k => {
                payload[k] = pieces[k].toString();
            });

            const res = await submitDemande(payload);

            console.log("Resultat");
            console.log(res);
            
            if (res.success && res.demandeId) {
                const filesToUpload = Object.entries(pieceFiles).filter(([, file]) => file instanceof File);
                if (filesToUpload.length > 0) {
                    const piecesFormData = new FormData();
                    filesToUpload.forEach(([pieceId, file]) => {
                        piecesFormData.append(`pieceFile_${pieceId}`, file, file.name);
                    });

                    await uploadPiecesJustificatives(res.demandeId, piecesFormData);
                }
                navigate(`/form/success/${res.demandeId}`);
            } else {
                setError(res.message || 'Erreur inconnue');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingOptions) return <div className="page-light"><div className="spinner-light"></div></div>;

    return (
        <div className="page-light">
            {/* Top bar */}
            <div className="top-bar">
                <div className="top-bar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="2" width="18" height="20" rx="3" />
                        <circle cx="12" cy="10" r="3.5" />
                        <path d="M7 17.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
                    </svg>
                </div>
                <div className="top-bar-text">
                    <h1>Demande de transformation de visa</h1>
                    <p>Remplissez tous les champs obligatoires (*)</p>
                </div>
                <Link to="/" className="back-link">&#8592; Accueil</Link>
            </div>

            {/* Steps */}
            <div className="steps">
                <div className="step active"><div className="step-num">1</div> Demandeur</div>
                <div className="step-line"></div>
                <div className="step active"><div className="step-num">2</div> Passeport</div>
                <div className="step-line"></div>
                <div className="step active"><div className="step-num">3</div> Visa &amp; Type</div>
                <div className="step-line"></div>
                <div className={`step ${piecesList.length > 0 ? 'active' : ''}`}><div className="step-num">4</div> Pièces</div>
            </div>

            {error && <div style={{ maxWidth: 760, margin: '0 auto 1.25rem', color: '#ff5252', background: '#ffebee', padding: 12, borderRadius: 6 }}>{error}</div>}

            <form onSubmit={handleSubmit} className="form-light">

                {/* Informations du demandeur */}
                <fieldset>
                    <legend>&#128100;&nbsp; Informations du demandeur</legend>
                    <div className="fields">
                        <div className="field"><label>Nom *</label><input required name="nom" type="text" maxLength="50" placeholder="Ex: RAKOTO" value={form.nom} onChange={handleChange} /></div>
                        <div className="field"><label>Prénom *</label><input required name="prenom" type="text" maxLength="50" placeholder="Ex: Jean" value={form.prenom} onChange={handleChange} /></div>
                        <div className="field"><label>Date de naissance *</label><input required name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} /></div>
                        <div className="field"><label>Lieu de naissance *</label><input required name="lieuNaissance" type="text" maxLength="100" placeholder="Ex: Antananarivo" value={form.lieuNaissance} onChange={handleChange} /></div>
                        <div className="field"><label>Téléphone *</label><input required name="telephone" type="text" maxLength="20" placeholder="+261 XX XXX XX XX" value={form.telephone} onChange={handleChange} /></div>
                        <div className="field"><label>Email *</label><input required name="email" type="email" maxLength="100" placeholder="exemple@email.com" value={form.email} onChange={handleChange} /></div>
                        <div className="field field-full"><label>Adresse *</label><textarea required name="adresse" rows="3" placeholder="Rue, quartier, ville..." value={form.adresse} onChange={handleChange}></textarea></div>
                        <div className="field">
                            <label>Situation familiale *</label>
                            <select name="idSituationFamiliale" required value={form.idSituationFamiliale} onChange={handleChange}>
                                <option value="">-- Sélectionner --</option>
                                {formDataOptions?.situationFamiliales?.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Nationalité *</label>
                            <select name="idNationalite" required value={form.idNationalite} onChange={handleChange}>
                                <option value="">-- Sélectionner --</option>
                                {formDataOptions?.nationalites?.map(n => <option key={n.id} value={n.id}>{n.libelle}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>

                {/* Informations du passeport */}
                <fieldset>
                    <legend>&#128215;&nbsp; Informations du passeport</legend>
                    <div className="fields">
                        <div className="field field-full">
                            <label>Numéro de passeport *</label>
                            <input required name="numeroPasseport" type="text" maxLength="50" placeholder="Ex: AB1234567" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} value={form.numeroPasseport} onChange={handleChange} />
                        </div>
                        <div className="field"><label>Date de délivrance *</label><input required name="dateDelivrance" type="date" value={form.dateDelivrance} onChange={handleChange} /></div>
                        <div className="field"><label>Date d'expiration *</label><input required name="dateExpiration" type="date" value={form.dateExpiration} onChange={handleChange} /></div>
                        <div className="field"><label>Pays de délivrance</label><input required name="paysDelivrance" type="text" maxLength="100" placeholder="Ex: Madagascar" value={form.paysDelivrance} onChange={handleChange} /></div>
                    </div>
                </fieldset>

                {/* Visa transformable */}
                <fieldset>
                    <legend>&#128196;&nbsp; Visa transformable</legend>
                    <div className="fields">
                        <div className="field">
                            <label>Numéro de référence *</label>
                            <input required name="numeroReference" type="text" maxLength="50" placeholder="Ex: REF-2024-00001" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} value={form.numeroReference} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                {/* Type de demande */}
                <fieldset>
                    <legend>&#128203;&nbsp; Type de demande</legend>
                    <div className="fields">
                        <div className="field">
                            <label>Type de visa *</label>
                            <select name="typeVisaId" required value={form.typeVisaId} onChange={handleChange}>
                                <option value="">-- Sélectionner un type de visa --</option>
                                {formDataOptions?.typeVisas?.map(t => <option key={t.id} value={t.id}>{t.libelle}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Type de demande *</label>
                            <select name="typeDemandeId" required value={form.typeDemandeId} onChange={handleChange}>
                                <option value="">-- Sélectionner un type de demande --</option>
                                {formDataOptions?.typeDemandes?.map(t => <option key={t.id} value={t.id}>{t.libelle}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>

                {/* Pièces justificatives */}
                {piecesList.length > 0 && (
                    <fieldset id="piecesFieldset">
                        <legend>&#128206;&nbsp; Pièces justificatives</legend>
                        <div className="pieces-summary">
                            <div>
                                <strong>Documents à déclarer</strong>
                                <p id="piecesHint">Cochez uniquement les pièces déjà fournies pour cette demande.</p>
                            </div>
                            <div className="pieces-counter">
                                {selectedPiecesCount} / {piecesList.length} sélectionnée{selectedPiecesCount > 1 ? 's' : ''}
                            </div>
                        </div>
                        <div id="piecesContainer">
                            {piecesList.map(p => (
                                <label className={`piece-card ${pieces[`pieceStatut_${p.id}`] ? 'selected' : ''}`} key={p.id}>
                                    <div className="piece-card-main">
                                        <input
                                            type="checkbox"
                                            name={`pieceStatut_${p.id}`}
                                            checked={pieces[`pieceStatut_${p.id}`] || false}
                                            onChange={handlePieceChange}
                                        />
                                        <div className="piece-card-content">
                                            <span className="piece-card-title">{p.libelle}</span>
                                            <span className="piece-card-desc">Document justificatif demandé pour le type de visa sélectionné.</span>
                                            <input
                                                className="piece-file-input"
                                                type="file"
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                onChange={(e) => handlePieceFileChange(p.id, e.target.files?.[0] || null)}
                                                disabled={!pieces[`pieceStatut_${p.id}`]}
                                            />
                                            <span className="piece-file-name">
                                                {pieceFiles[p.id]?.name || 'Aucun fichier sélectionné'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="piece-card-status">{pieces[`pieceStatut_${p.id}`] ? 'Fourni' : 'À fournir'}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                )}

                {form.typeVisaId && piecesList.length === 0 && (
                    <fieldset id="piecesFieldset">
                        <legend>&#128206;&nbsp; Pièces justificatives</legend>
                        <div className="pieces-empty">
                            Aucune pièce n’est associée à ce type de visa pour le moment.
                        </div>
                    </fieldset>
                )}

                {/* Footer */}
                <div className="form-footer">
                    <Link to="/" className="btn-secondary-light">Annuler</Link>
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
                    </button>
                </div>

            </form>
        </div>
    );
}
