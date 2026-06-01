import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDemandeById, updatePhotoSignature } from '../api/insertionApi';
import '../App-light.css';

export default function CapturePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [demande, setDemande] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Camera states
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    // Canvas/Signature states
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isCanvasDirty, setIsCanvasDirty] = useState(false);
    const [existingSignature, setExistingSignature] = useState(null);

    useEffect(() => {
        getDemandeById(id)
            .then(data => {
                setDemande(data);
                if (data.photoIdentite) {
                    setPhoto(data.photoIdentite);
                }
                if (data.signatureDigital) {
                    setExistingSignature(data.signatureDigital);
                }
            })
            .catch(err => {
                setError(err.message || 'Erreur lors du chargement de la demande.');
            })
            .finally(() => {
                setLoading(false);
            });

        // Cleanup camera stream on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [id]);

    // Start Webcam
    const startCamera = async () => {
        setError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 320, height: 320, facingMode: 'user' }
            });
            setStream(mediaStream);
            setCameraActive(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Impossible d'accéder à la caméra frontal de l'ordinateur. Veuillez vérifier vos autorisations.");
        }
    };

    // Capture photo
    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, 320, 320);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);

        // Stop camera stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    // Restart camera
    const recamera = () => {
        setPhoto(null);
        startCamera();
    };

    // Stop camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    // Canvas drawing handlers (Mouse & Touch/Trackpad support)
    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#0f2d52';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setIsCanvasDirty(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsCanvasDirty(false);
        setExistingSignature(null);
    };

    // Save captures to database
    const handleSave = async () => {
        setSubmitting(true);
        setError('');

        try {
            let finalPhoto = photo;
            let finalSignature = existingSignature;

            if (isCanvasDirty && canvasRef.current) {
                finalSignature = canvasRef.current.toDataURL('image/png');
            }

            const payload = {
                photoIdentite: finalPhoto || '',
                signatureDigital: finalSignature || ''
            };

            const res = await updatePhotoSignature(id, payload);
            if (res.success) {
                navigate(`/demande/${id}`);
            } else {
                setError(res.message || 'Une erreur est survenue lors de la sauvegarde.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur lors de la communication avec le serveur.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-light">
                <div className="spinner-light"></div>
            </div>
        );
    }

    return (
        <div className="page-light">
            <div className="top-bar">
                <div className="top-bar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                </div>
                <div className="top-bar-text">
                    <h1>Prise de photo & signature</h1>
                    <p>Demande #{id} — {demande ? `${demande.nomDemandeur} ${demande.prenomDemandeur || ''}` : ''}</p>
                </div>
                <button
                    onClick={() => {
                        stopCamera();
                        navigate(`/demande/${id}`);
                    }}
                    className="back-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    &#8592; Annuler
                </button>
            </div>

            {error && (
                <div style={{ maxWidth: 760, margin: '0 auto 1.25rem', color: '#ff5252', background: '#ffebee', padding: 12, borderRadius: 6 }}>
                    {error}
                </div>
            )}

            <div className="form-light" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* Photo Capture Block */}
                <fieldset style={{ margin: 0 }}>
                    <legend>📸 Photo d'identité (Caméra frontal)</legend>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        
                        {cameraActive ? (
                            <div style={{ position: 'relative', width: '320px', height: '320px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ) : photo ? (
                            <img
                                src={photo}
                                alt="Capture"
                                style={{ width: '320px', height: '320px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #d1dce8' }}
                            />
                        ) : (
                            <div style={{ width: '320px', height: '320px', borderRadius: '8px', border: '2px dashed #d1dce8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7a95ab', background: '#fafcff' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                Caméra inactive
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {cameraActive ? (
                                <>
                                    <button type="button" onClick={capturePhoto} className="btn-submit" style={{ background: '#10b981' }}>
                                        Prendre la photo
                                    </button>
                                    <button type="button" onClick={stopCamera} className="btn-secondary-light">
                                        Arrêter
                                    </button>
                                </>
                            ) : (
                                <button type="button" onClick={photo ? recamera : startCamera} className="btn-submit">
                                    {photo ? 'Recommencer' : 'Activer la caméra'}
                                </button>
                            )}
                        </div>
                    </div>
                </fieldset>

                {/* Signature Drawing Block */}
                <fieldset style={{ margin: 0 }}>
                    <legend>✍️ Signature digitale (Trackpad / Souris)</legend>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        
                        <div style={{ position: 'relative', width: '320px', height: '320px', background: '#ffffff', borderRadius: '8px', border: '2px solid #d1dce8', overflow: 'hidden' }}>
                            {existingSignature && !isCanvasDirty && (
                                <img
                                    src={existingSignature}
                                    alt="Signature actuelle"
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                />
                            )}
                            <canvas
                                ref={canvasRef}
                                width={320}
                                height={320}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={clearCanvas} className="btn-secondary-light">
                                Effacer la signature
                            </button>
                        </div>
                    </div>
                </fieldset>

                {/* Main Action Footer */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={() => {
                            stopCamera();
                            navigate(`/demande/${id}`);
                        }}
                        className="btn-secondary-light"
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn-submit"
                        disabled={submitting || (!photo && !existingSignature && !isCanvasDirty)}
                    >
                        {submitting ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
