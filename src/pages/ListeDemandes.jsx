import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifierNumero } from '../api/visaApi'

const s = {
  root: {
    fontFamily: "'DM Sans', Arial, sans-serif",
    background: '#eef3f8',
    minHeight: '100vh',
    padding: '2rem 1rem 4rem',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '900px',
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
    flex: 1,
  },
  topBarTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f2d52',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  numeroBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '14px',
    background: '#dbeafe',
    color: '#1a4580',
    padding: '2px 10px',
    borderRadius: '100px',
    fontWeight: 500,
  },
  topBarSub: {
    fontSize: '13px',
    color: '#4b6278',
    marginTop: '2px',
  },
  btnRetour: {
    marginLeft: 'auto',
    padding: '8px 16px',
    fontFamily: "'DM Sans', Arial, sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f2d52',
    background: '#ffffff',
    border: '1px solid #d1dce8',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.15s',
    flexShrink: 0,
  },

  /* ── États ── */
  etatBox: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2.5rem',
    background: '#ffffff',
    border: '1px dashed #d1dce8',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#4b6278',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  erreurBox: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '1rem 1.25rem',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '10px',
    color: '#b91c1c',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #d1dce8',
    borderTop: '3px solid #1d6fbf',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  /* ── Cards ── */
  card: {
    background: '#ffffff',
    border: '1px solid #d1dce8',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 1.25rem',
    background: '#f0f6ff',
    borderBottom: '1px solid #d1dce8',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardHeaderDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0f2d52',
  },
  cardHeaderTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f2d52',
    margin: 0,
  },
  statutBadge: {
    fontSize: '12px',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: '100px',
    background: '#dbeafe',
    color: '#1a4580',
  },
  cardBody: {
    padding: '1rem 1.25rem',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#7a95ab',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: '#d1dce8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px 16px',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#7a95ab',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 500,
  },
  fieldValue: {
    fontSize: '14px',
    color: '#1a2535',
    fontWeight: 400,
  },
  fieldValueMono: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '13px',
    letterSpacing: '0.04em',
    color: '#0f2d52',
  },
}

function Field({ label, value, mono }) {
  return (
    <div style={s.fieldItem}>
      <span style={s.fieldLabel}>{label}</span>
      <span style={mono ? { ...s.fieldValue, ...s.fieldValueMono } : s.fieldValue}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export default function ListeDemandes() {
  const { numero } = useParams()
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    if (!numero) return

    let cancelled = false

    async function loadDemandes() {
      setChargement(true)
      setErreur(null)

      try {
        const data = await verifierNumero(numero)
        if (!cancelled) {
          setDemandes(data)
        }
      } catch (error) {
        if (!cancelled) {
          setErreur(error instanceof Error ? error.message : 'Erreur inconnue')
        }
      } finally {
        if (!cancelled) {
          setChargement(false)
        }
      }
    }

    loadDemandes()

    return () => {
      cancelled = true
    }
  }, [numero])

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.root}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.topBarIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </div>
          <div style={s.topBarText}>
            <p style={s.topBarTitle}>
              Résultats pour
              <span style={s.numeroBadge}>{numero}</span>
            </p>
            <p style={s.topBarSub}>Demandes associées au numéro saisi</p>
          </div>
          <button
            style={s.btnRetour}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#eef3f8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour
          </button>
        </div>

        {/* Chargement */}
        {chargement && (
          <div style={s.etatBox}>
            <div style={s.spinner} />
            <p>Chargement en cours…</p>
          </div>
        )}

        {/* Erreur */}
        {erreur && (
          <div style={s.erreurBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p style={{ margin: 0 }}>{erreur}</p>
          </div>
        )}

        {/* Aucun résultat */}
        {!chargement && !erreur && demandes.length === 0 && (
          <div style={s.etatBox}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7a95ab" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
            <p>Aucune demande trouvée pour ce numéro.</p>
          </div>
        )}

        {/* Liste des demandes */}
        {!chargement && !erreur && demandes.length > 0 && demandes.map((d, index) => (
          <div style={s.card} key={d.id ?? index}>

            <div style={s.cardHeader}>
              <div style={s.cardHeaderLeft}>
                <div style={s.cardHeaderDot} />
                <h2 style={s.cardHeaderTitle}>Demande #{index + 1}</h2>
              </div>
              <span style={s.statutBadge}>{d.statutDemandeLibelle ?? 'En attente'}</span>
            </div>

            <div style={s.cardBody}>
              {/* Informations demande */}
              <div style={s.sectionTitle}>
                Informations de la demande
                <span style={s.sectionLine} />
              </div>
              <div style={{ ...s.grid, marginBottom: '1rem' }}>
                <Field label="ID Demande" value={d.id} mono />
                <Field label="Type de visa" value={d.typeVisaLibelle} />
                <Field label="Type de demande" value={d.typeDemandeLibelle} />
                <Field label="Date de demande" value={d.dateDemande} mono />
                <Field label="Date de traitement" value={d.dateTraitement} mono />
              </div>

              {/* Demandeur */}
              <div style={s.sectionTitle}>
                Demandeur
                <span style={s.sectionLine} />
              </div>
              <div style={s.grid}>
                <Field label="Nom" value={d.nomDemandeur} />
              </div>
            </div>

          </div>
        ))}

      </div>
    </>
  )
}