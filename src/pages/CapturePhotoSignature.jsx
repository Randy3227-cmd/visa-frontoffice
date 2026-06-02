import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { saveDemandeMedia } from '../api/insertionApi'
import '../App-light.css'

export default function CapturePhotoSignature() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const photoCanvasRef = useRef(null)
  const sigCanvasRef = useRef(null)
  const [streamError, setStreamError] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let stream
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        setStreamError(e.message || 'Impossible d\'accéder à la caméra')
      }
    }
    start()
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, [])

  useEffect(() => {
    const c = sigCanvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.lineWidth = 2
    ctx.strokeStyle = '#111'
  }, [])

  function takePhoto() {
    const v = videoRef.current
    const c = photoCanvasRef.current
    if (!v || !c) return
    c.width = 400
    c.height = 500
    const ctx = c.getContext('2d')
    ctx.drawImage(v, 0, 0, c.width, c.height)
  }

  function startDraw(e) {
    setIsDrawing(true)
    const rect = sigCanvasRef.current.getBoundingClientRect()
    const ctx = sigCanvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }
  function draw(e) {
    if (!isDrawing) return
    const rect = sigCanvasRef.current.getBoundingClientRect()
    const ctx = sigCanvasRef.current.getContext('2d')
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }
  function endDraw() { setIsDrawing(false) }

  function clearSignature() {
    const c = sigCanvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
  }

  async function canvasToBlob(canvas, type, quality) {
    if (!canvas) return null
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  }

  async function saveAndReturn() {
    const photoC = photoCanvasRef.current
    const sigC = sigCanvasRef.current
    const photoBlob = await canvasToBlob(photoC, 'image/jpeg', 0.9)
    const signatureBlob = await canvasToBlob(sigC, 'image/png')

    if (!photoBlob || !signatureBlob) {
      setSaveError('Impossible de préparer les médias.')
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const formData = new FormData()
      formData.append('photo', photoBlob, 'photo-identite.jpg')
      formData.append('signature', signatureBlob, 'signature.png')
      await saveDemandeMedia(id, formData)
      navigate(`/demande/${id}`)
    } catch (e) {
      setSaveError(e.message || 'Erreur lors de l’enregistrement')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-light">
      <div className="top-bar">
        <div className="top-bar-icon">📷</div>
        <div className="top-bar-text">
          <h1>Photo et signature - Demande {id}</h1>
          <p>Utilisez la caméra et le trackpad pour capturer la photo et la signature.</p>
        </div>
        <Link to={`/demande/${id}`} className="back-link">← Retour</Link>
      </div>

      <div className="card-light" style={{ maxWidth: 980, margin: '20px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <h3>Caméra</h3>
          {streamError && <div style={{ color: '#b91c1c' }}>{streamError}</div>}
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', background: '#000' }} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="btn-primary-light" onClick={takePhoto}>Prendre la photo</button>
            <button className="btn-ghost-light" onClick={() => { const c = photoCanvasRef.current; if (c) { const ctx = c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height) } }}>Effacer</button>
          </div>
          <canvas ref={photoCanvasRef} style={{ marginTop: 12, width: '100%', border: '1px solid #eee', borderRadius: 6 }} />
        </div>

        <div>
          <h3>Signature (trackpad)</h3>
          <div style={{ border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' }}>
            <canvas
              ref={sigCanvasRef}
              width={600}
              height={200}
              style={{ width: '100%', height: 200, background: '#fff', touchAction: 'none' }}
              onPointerDown={startDraw}
              onPointerMove={draw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
            />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="btn-primary-light" onClick={() => { saveAndReturn() }} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button className="btn-ghost-light" onClick={clearSignature}>Effacer</button>
          </div>
          {saveError && <div style={{ marginTop: 10, color: '#b91c1c' }}>{saveError}</div>}
        </div>
      </div>
    </div>
  )
}
