import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = {
  root: {
    fontFamily: "'DM Sans', Arial, sans-serif",
    background: '#eef3f8',
    minHeight: '100vh',
    padding: '2rem 1rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '2rem',
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
  topBarTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f2d52',
    margin: 0,
  },
  topBarSub: {
    fontSize: '13px',
    color: '#4b6278',
    marginTop: '2px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #d1dce8',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '900px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.85rem 1.25rem',
    background: '#f0f6ff',
    borderBottom: '1px solid #d1dce8',
  },
  cardHeaderDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0f2d52',
    flexShrink: 0,
  },
  cardHeaderTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f2d52',
    margin: 0,
  },
  cardSection: {
    padding: '1.25rem 1.25rem',
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
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 500,
    color: '#7a95ab',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.04em',
    color: '#0f2d52',
    background: '#eef3f8',
    border: '1px solid #d1dce8',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#1d6fbf',
    boxShadow: '0 0 0 3px rgba(29,111,191,0.12)',
    background: '#ffffff',
  },
  inputDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  erreur: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#b91c1c',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    padding: '8px 12px',
  },
  footer: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid #d1dce8',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btnSubmit: {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'DM Sans', Arial, sans-serif",
    color: '#ffffff',
    background: '#0f2d52',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnDisabled: {
    background: '#7a95ab',
    cursor: 'not-allowed',
  },
}

export default function Form() {
  const [numero, setNumero] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!numero.trim()) {
      setErreur('Veuillez entrer un numéro')
      return
    }
    setChargement(true)
    setErreur(null)
    try {
      navigate(`/demandes/${numero}`)
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={styles.root}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5l4 4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p style={styles.topBarTitle}>Recherche de demande</p>
          <p style={styles.topBarSub}>Retrouver une demande par numéro de passeport ou de dossier</p>
        </div>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderDot} />
          <h2 style={styles.cardHeaderTitle}>Rechercher</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.cardSection}>
            {/* Section label */}
            <div style={styles.sectionTitle}>
              Identifiant
              <span style={styles.sectionLine} />
            </div>

            <label htmlFor="numero" style={styles.label}>
              Numéro de passeport ou de demande
            </label>
            <input
              id="numero"
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ex : P-12345 ou D-2025-001"
              disabled={chargement}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={{
                ...styles.input,
                ...(inputFocused ? styles.inputFocus : {}),
                ...(chargement ? styles.inputDisabled : {}),
              }}
            />

            {erreur && (
              <p style={styles.erreur}>{erreur}</p>
            )}
          </div>

          <div style={styles.footer}>
            <button
              type="submit"
              disabled={chargement}
              style={{
                ...styles.btnSubmit,
                ...(chargement ? styles.btnDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!chargement) e.currentTarget.style.background = '#1a4580'
              }}
              onMouseLeave={(e) => {
                if (!chargement) e.currentTarget.style.background = '#0f2d52'
              }}
            >
              {chargement ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                  Vérification...
                </>
              ) : (
                <>
                  Valider
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}