import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../App-light.css';

export default function QRCodePage() {
    const { id } = useParams();

    // URL to which the QR code redirects
    const statusUrl = `${window.location.origin}/demande/${id}`;

    return (
        <div className="page-light fade-in">
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>

                <div className="card-light" style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
                    <div className="alert alert-success" style={{ justifyContent: 'center', background: '#e6fdf0', border: '1px solid #b3efd4', color: '#008f4c' }}>
                        Demande #{id} soumise avec succès !
                    </div>

                    <h2 style={{ marginTop: '24px', color: '#0f2d52' }}>Votre QR Code de suivi</h2>
                    <p className="sub" style={{ marginBottom: '32px', color: '#4b6278' }}>
                        Conservez ce QR code. Il vous permettra de suivre l'avancée de votre demande en temps réel.
                    </p>

                    <div className="qr-container" style={{ border: '1px solid #d1dce8' }}>
                        <QRCodeSVG
                            value={statusUrl}
                            size={240}
                            level={"H"}
                            includeMargin={false}
                            fgColor="#0f2d52"
                            bgColor="#ffffff"
                        />
                        <div className="qr-label" style={{ color: '#0f2d52' }}>Demande #{id}</div>
                    </div>

                    <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to={`/demandes/${id}`} className="btn-primary-light">
                            Voir le statut maintenant
                        </Link>
                        <Link to="/" className="btn-ghost-light">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
