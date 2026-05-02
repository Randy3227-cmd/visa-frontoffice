import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  creerDemande,
  getNationalites,
  getPiecesComplementaires,
  getSituationsFamiliales,
  getTypesDemande,
  getTypesVisa,
} from '../api/visaApi'

const initialForm = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  telephone: '',
  email: '',
  adresse: '',
  idSituationFamiliale: '',
  idNationalite: '',
  numeroPasseport: '',
  dateDelivrance: '',
  dateExpiration: '',
  paysDelivrance: '',
  numeroReference: '',
  typeVisaId: '',
  typeDemandeId: '',
}

const styles = {
  root: {
    fontFamily: "'DM Sans', Arial, sans-serif",
    background: 'linear-gradient(180deg, #eef3f8 0%, #f6f9fc 100%)',
    minHeight: '100vh',
    padding: '2rem 1rem 4rem',
    color: '#1a2535',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '760px',
    margin: '0 auto 2rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid #d1dce8',
  },
  topBarIcon: {
    width: '44px',
    height: '44px',
    background: '#0f2d52',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  topBarText: {
    minWidth: 0,
  },
  topBarTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f2d52',
    lineHeight: 1.2,
    margin: 0,
  },
  topBarSub: {
    fontSize: '13px',
    color: '#4b6278',
    marginTop: '2px',
  },
  backLink: {
    marginLeft: 'auto',
    fontSize: '13px',
    color: '#1d6fbf',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
  },
  steps: {
    display: 'flex',
    maxWidth: '760px',
    margin: '0 auto 1.75rem',
    gap: 0,
  },
  step: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#7a95ab',
    position: 'relative',
    minWidth: 0,
  },
  stepActive: {
    color: '#0f2d52',
    fontWeight: 500,
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1.5px solid #d1dce8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 500,
    flexShrink: 0,
    background: '#ffffff',
    color: '#7a95ab',
    marginRight: '6px',
  },
  stepNumActive: {
    background: '#0f2d52',
    borderColor: '#0f2d52',
    color: '#ffffff',
  },
  stepLine: {
    flex: 1,
    height: '1px',
    background: '#d1dce8',
    margin: '0 8px',
    alignSelf: 'center',
  },
  form: {
    maxWidth: '760px',
    margin: '0 auto',
  },
  fieldset: {
    background: '#ffffff',
    border: '1px solid #d1dce8',
    borderRadius: '10px',
    padding: 0,
    marginBottom: '1.25rem',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(15, 45, 82, 0.04)',
  },
  legend: {
    display: 'block',
    width: '100%',
    padding: '0.85rem 1.25rem',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f2d52',
    background: '#f0f6ff',
    borderBottom: '1px solid #d1dce8',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem 1.25rem',
    padding: '1.25rem',
  },
  fieldFull: {
    gridColumn: '1 / -1',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#4b6278',
  },
  control: {
    width: '100%',
    padding: '9px 12px',
    fontFamily: 'inherit',
    fontSize: '14px',
    color: '#1a2535',
    background: '#ffffff',
    border: '1px solid #d1dce8',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    appearance: 'none',
    WebkitAppearance: 'none',
    boxSizing: 'border-box',
  },
  monoControl: {
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.05em',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
  },
  select: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234b6278' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  },
  helper: {
    fontSize: '13px',
    color: '#4b6278',
    padding: '0.75rem 1.25rem 0',
  },
  piecesFieldset: {
    borderLeft: '3px solid #c49a28',
  },
  piecesLegend: {
    background: '#fef9ec',
    color: '#7a5a00',
  },
  piecesContainer: {
    padding: '0.75rem 1.25rem 1rem',
  },
  pieceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #d1dce8',
    marginBottom: '8px',
    background: '#fafcff',
  },
  pieceLabel: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#1a2535',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#0f2d52',
    cursor: 'pointer',
    flexShrink: 0,
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '760px',
    margin: '0 auto',
  },
  secondaryButton: {
    padding: '10px 20px',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
    color: '#4b6278',
    background: 'transparent',
    border: '1px solid #d1dce8',
    borderRadius: '6px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.15s',
  },
  submitButton: {
    padding: '10px 24px',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    background: '#0f2d52',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s',
  },
  status: {
    maxWidth: '760px',
    margin: '0 auto 1rem',
    padding: '0.9rem 1rem',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid transparent',
  },
  statusError: {
    background: '#fee2e2',
    borderColor: '#fca5a5',
    color: '#b91c1c',
  },
  statusSuccess: {
    background: '#dcfce7',
    borderColor: '#86efac',
    color: '#166534',
  },
  statusInfo: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
    color: '#1a4580',
  },
  loadingBox: {
    padding: '0.75rem 1.25rem 1rem',
    fontSize: '13px',
    color: '#4b6278',
  },
}

function getItems(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

function getItemValue(item) {
  if (item == null) return ''
  if (typeof item === 'object') {
    return item.id ?? item.value ?? item.code ?? item.uuid ?? ''
  }

  return item
}

function getItemLabel(item) {
  if (item == null) return ''
  if (typeof item === 'object') {
    return item.libelle ?? item.label ?? item.nom ?? item.name ?? String(item.id ?? '')
  }

  return String(item)
}

function toOptions(data) {
  return getItems(data).map((item) => ({
    value: String(getItemValue(item)),
    label: getItemLabel(item),
  }))
}

function createFormBody(form, pieces, selectedPieces) {
  const body = new URLSearchParams()

  Object.entries(form).forEach(([key, value]) => {
    body.append(key, value)
  })

  pieces.forEach((piece) => {
    const pieceId = String(getItemValue(piece))
    body.append(`pieceStatut_${pieceId}`, selectedPieces[pieceId] ? 'true' : 'false')
  })

  return body
}

export default function Form() {
  const [form, setForm] = useState(initialForm)
  const [typesVisa, setTypesVisa] = useState([])
  const [typesDemande, setTypesDemande] = useState([])
  const [nationalites, setNationalites] = useState([])
  const [situationsFamiliales, setSituationsFamiliales] = useState([])
  const [pieces, setPieces] = useState([])
  const [selectedPieces, setSelectedPieces] = useState({})
  const [loadingLists, setLoadingLists] = useState(true)
  const [loadingPieces, setLoadingPieces] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: 'info', message: 'Chargement des listes déroulantes...' })

  useEffect(() => {
    let cancelled = false

    async function loadLists() {
      setLoadingLists(true)
      setStatus({ type: 'info', message: 'Chargement des listes déroulantes...' })

      try {
        const [typesVisaData, typesDemandeData, nationalitesData, situationsFamilialesData] = await Promise.all([
          getTypesVisa(),
          getTypesDemande(),
          getNationalites(),
          getSituationsFamiliales(),
        ])

        if (cancelled) return

        setTypesVisa(toOptions(typesVisaData))
        setTypesDemande(toOptions(typesDemandeData))
        setNationalites(toOptions(nationalitesData))
        setSituationsFamiliales(toOptions(situationsFamilialesData))
        setStatus({ type: 'info', message: 'Formulaire prêt à être rempli.' })
      } catch (error) {
        if (!cancelled) {
          setStatus({
            type: 'error',
            message: error instanceof Error ? error.message : 'Impossible de charger les données du formulaire',
          })
        }
      } finally {
        if (!cancelled) {
          setLoadingLists(false)
        }
      }
    }

    loadLists()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadPieces() {
      const typeVisaId = form.typeVisaId

      if (!typeVisaId) {
        setPieces([])
        setSelectedPieces({})
        return
      }

      setLoadingPieces(true)

      try {
        const piecesData = await getPiecesComplementaires(typeVisaId)

        if (cancelled) return

        const normalizedPieces = getItems(piecesData)
        setPieces(normalizedPieces)
        setSelectedPieces({})
      } catch (error) {
        if (!cancelled) {
          setPieces([])
          setSelectedPieces({})
          setStatus({
            type: 'error',
            message: error instanceof Error ? error.message : 'Impossible de charger les pièces complémentaires',
          })
        }
      } finally {
        if (!cancelled) {
          setLoadingPieces(false)
        }
      }
    }

    loadPieces()

    return () => {
      cancelled = true
    }
  }, [form.typeVisaId])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handlePieceToggle(pieceId) {
    setSelectedPieces((current) => ({
      ...current,
      [pieceId]: !current[pieceId],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setStatus({ type: 'info', message: 'Envoi de la demande en cours...' })

    try {
      const body = createFormBody(form, pieces, selectedPieces)
      const response = await creerDemande(body)
      const confirmation = typeof response === 'string'
        ? response
        : response?.message ?? response?.numeroDemande ?? 'Demande envoyée avec succès.'

      setStatus({ type: 'success', message: confirmation })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue pendant l\'envoi',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const showPieces = Boolean(form.typeVisaId)
  const statusStyle =
    status.type === 'error'
      ? styles.statusError
      : status.type === 'success'
        ? styles.statusSuccess
        : styles.statusInfo

  return (
    <div style={styles.root}>
      <div style={styles.topBar}>
        <div style={styles.topBarIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="2" width="18" height="20" rx="3" />
            <circle cx="12" cy="10" r="3.5" />
            <path d="M7 17.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
          </svg>
        </div>
        <div style={styles.topBarText}>
          <h1 style={styles.topBarTitle}>Demande de transformation de visa</h1>
          <p style={styles.topBarSub}>Remplissez tous les champs obligatoires (*)</p>
        </div>
        <Link to="/" style={styles.backLink}>
          ← Accueil
        </Link>
      </div>

      <div style={styles.steps} aria-label="Progression du formulaire">
        <div style={{ ...styles.step, ...styles.stepActive }}>
          <div style={{ ...styles.stepNum, ...styles.stepNumActive }}>1</div>
          Demandeur
        </div>
        <div style={styles.stepLine} />
        <div style={{ ...styles.step, ...styles.stepActive }}>
          <div style={{ ...styles.stepNum, ...styles.stepNumActive }}>2</div>
          Passeport
        </div>
        <div style={styles.stepLine} />
        <div style={{ ...styles.step, ...styles.stepActive }}>
          <div style={{ ...styles.stepNum, ...styles.stepNumActive }}>3</div>
          Visa &amp; Type
        </div>
        <div style={styles.stepLine} />
        <div style={styles.step}>
          <div style={styles.stepNum}>4</div>
          Pièces
        </div>
      </div>

      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        <div style={{ ...styles.status, ...statusStyle }} role="status" aria-live="polite">
          {status.message}
        </div>

        <fieldset style={styles.fieldset} disabled={submitting || loadingLists}>
          <legend style={styles.legend}>Informations du demandeur</legend>
          <div style={styles.fields}>
            <div style={styles.field}>
              <label htmlFor="nom" style={styles.label}>Nom *</label>
              <input id="nom" name="nom" type="text" maxLength={50} required placeholder="Ex: RAKOTO" value={form.nom} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="prenom" style={styles.label}>Prénom *</label>
              <input id="prenom" name="prenom" type="text" maxLength={50} required placeholder="Ex: Jean" value={form.prenom} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="dateNaissance" style={styles.label}>Date de naissance *</label>
              <input id="dateNaissance" name="dateNaissance" type="date" required value={form.dateNaissance} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="lieuNaissance" style={styles.label}>Lieu de naissance *</label>
              <input id="lieuNaissance" name="lieuNaissance" type="text" maxLength={100} required placeholder="Ex: Antananarivo" value={form.lieuNaissance} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="telephone" style={styles.label}>Téléphone *</label>
              <input id="telephone" name="telephone" type="text" maxLength={20} required placeholder="+261 XX XXX XX XX" value={form.telephone} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>Email *</label>
              <input id="email" name="email" type="email" maxLength={100} required placeholder="exemple@email.com" value={form.email} onChange={handleChange} style={styles.control} />
            </div>
            <div style={{ ...styles.field, ...styles.fieldFull }}>
              <label htmlFor="adresse" style={styles.label}>Adresse *</label>
              <textarea id="adresse" name="adresse" rows={3} required placeholder="Rue, quartier, ville..." value={form.adresse} onChange={handleChange} style={{ ...styles.control, ...styles.textarea }} />
            </div>
            <div style={styles.field}>
              <label htmlFor="idSituationFamiliale" style={styles.label}>Situation familiale *</label>
              <select id="idSituationFamiliale" name="idSituationFamiliale" required value={form.idSituationFamiliale} onChange={handleChange} style={{ ...styles.control, ...styles.select }}>
                <option value="">-- Sélectionner --</option>
                {situationsFamiliales.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label htmlFor="idNationalite" style={styles.label}>Nationalité *</label>
              <select id="idNationalite" name="idNationalite" required value={form.idNationalite} onChange={handleChange} style={{ ...styles.control, ...styles.select }}>
                <option value="">-- Sélectionner --</option>
                {nationalites.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset style={styles.fieldset} disabled={submitting || loadingLists}>
          <legend style={styles.legend}>Informations du passeport</legend>
          <div style={styles.fields}>
            <div style={{ ...styles.field, ...styles.fieldFull }}>
              <label htmlFor="numeroPasseport" style={styles.label}>Numéro de passeport *</label>
              <input
                id="numeroPasseport"
                name="numeroPasseport"
                type="text"
                maxLength={50}
                required
                placeholder="Ex: AB1234567"
                value={form.numeroPasseport}
                onChange={handleChange}
                style={{ ...styles.control, ...styles.monoControl }}
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="dateDelivrance" style={styles.label}>Date de délivrance *</label>
              <input id="dateDelivrance" name="dateDelivrance" type="date" required value={form.dateDelivrance} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="dateExpiration" style={styles.label}>Date d'expiration *</label>
              <input id="dateExpiration" name="dateExpiration" type="date" required value={form.dateExpiration} onChange={handleChange} style={styles.control} />
            </div>
            <div style={styles.field}>
              <label htmlFor="paysDelivrance" style={styles.label}>Pays de délivrance</label>
              <input id="paysDelivrance" name="paysDelivrance" type="text" maxLength={100} placeholder="Ex: Madagascar" value={form.paysDelivrance} onChange={handleChange} style={styles.control} />
            </div>
          </div>
        </fieldset>

        <fieldset style={styles.fieldset} disabled={submitting || loadingLists}>
          <legend style={styles.legend}>Visa transformable</legend>
          <div style={styles.fields}>
            <div style={styles.field}>
              <label htmlFor="numeroReference" style={styles.label}>Numéro de référence *</label>
              <input
                id="numeroReference"
                name="numeroReference"
                type="text"
                maxLength={50}
                required
                placeholder="Ex: REF-2024-00001"
                value={form.numeroReference}
                onChange={handleChange}
                style={{ ...styles.control, ...styles.monoControl }}
              />
            </div>
          </div>
        </fieldset>

        <fieldset style={styles.fieldset} disabled={submitting || loadingLists}>
          <legend style={styles.legend}>Type de demande</legend>
          <div style={styles.fields}>
            <div style={styles.field}>
              <label htmlFor="typeVisaId" style={styles.label}>Type de visa *</label>
              <select id="typeVisaId" name="typeVisaId" required value={form.typeVisaId} onChange={handleChange} style={{ ...styles.control, ...styles.select }}>
                <option value="">-- Sélectionner un type de visa --</option>
                {typesVisa.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label htmlFor="typeDemandeId" style={styles.label}>Type de demande *</label>
              <select id="typeDemandeId" name="typeDemandeId" required value={form.typeDemandeId} onChange={handleChange} style={{ ...styles.control, ...styles.select }}>
                <option value="">-- Sélectionner un type de demande --</option>
                {typesDemande.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {showPieces && (
          <fieldset style={{ ...styles.fieldset, ...styles.piecesFieldset }} disabled={submitting || loadingLists || loadingPieces}>
            <legend style={{ ...styles.legend, ...styles.piecesLegend }}>Pièces justificatives</legend>
            <p style={styles.helper}>Cochez les pièces fournies.</p>
            <div style={styles.piecesContainer}>
              {loadingPieces ? (
                <div style={styles.loadingBox}>Chargement des pièces...</div>
              ) : pieces.length === 0 ? (
                <div style={styles.loadingBox}>Aucune pièce complémentaire requise pour ce type de visa.</div>
              ) : (
                pieces.map((piece) => {
                  const pieceId = String(getItemValue(piece))

                  return (
                    <div key={pieceId} style={styles.pieceItem}>
                      <label style={styles.pieceLabel}>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedPieces[pieceId])}
                          onChange={() => handlePieceToggle(pieceId)}
                          style={styles.checkbox}
                        />
                        {getItemLabel(piece)}
                      </label>
                    </div>
                  )
                })
              )}
            </div>
          </fieldset>
        )}

        <div style={styles.formFooter}>
          <Link to="/" style={styles.secondaryButton}>
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting || loadingLists}
            style={{
              ...styles.submitButton,
              ...(submitting || loadingLists ? { background: '#7a95ab', cursor: 'not-allowed' } : {}),
            }}
            onMouseEnter={(event) => {
              if (!submitting && !loadingLists) {
                event.currentTarget.style.background = '#1a4580'
              }
            }}
            onMouseLeave={(event) => {
              if (!submitting && !loadingLists) {
                event.currentTarget.style.background = '#0f2d52'
              }
            }}
          >
            {submitting ? 'Envoi...' : 'Envoyer la demande'}
            {!submitting && <span aria-hidden="true">→</span>}
          </button>
        </div>
      </form>
    </div>
  )
}