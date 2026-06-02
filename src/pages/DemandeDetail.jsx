import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getDemandeById } from "../api/insertionApi";
import { jsPDF } from "jspdf";
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
import "../App-light.css";

const BACKEND_ORIGIN = "http://localhost:8080";

function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

function isPdfUrl(url) {
  return /\.pdf($|\?)/i.test(url || "");
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const loadPdfPreview = async (url) => {
  const pdf = await pdfjsLib.getDocument(url).promise;

  // Première page
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1.5 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL("image/jpeg");
};

async function loadImageData(url) {
  const response = await fetch(resolveMediaUrl(url));
  if (!response.ok) {
    throw new Error("Impossible de charger une pièce justificative");
  }
  const blob = await response.blob();
  return blobToDataUrl(blob);
}

function getPieceList(demande) {
  return demande?.piecesJustificatives || [];
}

function getMediaPiece(demande, keywords) {
  return getPieceList(demande).find((piece) => {
    const label = (piece.libelle || "").toLowerCase();
    return keywords.some((keyword) => label.includes(keyword));
  });
}

export default function DemandeDetail() {
  const { id } = useParams();
  const qrRef = useRef(null);
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDemandeById(id)
      .then((d) => setDemande(d))
      .catch((err) => setError(err.message || "Erreur"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="page-light">
        <div className="spinner-light" />
      </div>
    );
  if (error) return <div className="page-light">Erreur: {error}</div>;
  if (!demande)
    return <div className="page-light">Aucune demande trouvée.</div>;

  const statut = (demande.statutDemandeLibelle || "").toLowerCase();
  const canOpenCapture =
    statut.includes("dossier") &&
    (statut.includes("cre") || statut.includes("cré"));
  const canExportLetter = statut.includes("scan") && statut.includes("termin");
  const pieces = getPieceList(demande);
  const statusUrl = `${window.location.origin}/demande/${id}`;

  async function openPdf(blob) {
    const url = window.URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      window.URL.revokeObjectURL(url);
      return;
    }
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  }

  async function buildPiecesPdf() {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    let cursorY = 18;

    doc.setFontSize(18);
    doc.text(`Apercu pieces justificatives - Demande ${id}`, margin, cursorY);
    cursorY += 10;
    doc.setFontSize(11);
    doc.text(`Reference: ${demande.numeroReference || "—"}`, margin, cursorY);
    cursorY += 8;

    if (pieces.length === 0) {
      doc.text("Aucune piece trouvee.", margin, cursorY);
      return doc;
    }

    for (const piece of pieces) {
      if (cursorY > pageHeight - 40) {
        doc.addPage();
        cursorY = 18;
      }

      doc.setFontSize(13);
      doc.text(piece.libelle || "Piece justificative", margin, cursorY);
      cursorY += 6;

      const mediaUrl = resolveMediaUrl(piece.url);

      if (mediaUrl) {
        // IMAGE
        if (!isPdfUrl(mediaUrl)) {
          const dataUrl = await loadImageData(mediaUrl);

          const imageProps = doc.getImageProperties(dataUrl);

          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - cursorY - 20;

          const ratio = Math.min(
            maxWidth / imageProps.width,
            maxHeight / imageProps.height,
            1,
          );

          const width = imageProps.width * ratio;
          const height = imageProps.height * ratio;

          doc.addImage(
            dataUrl,
            imageProps.fileType || "JPEG",
            margin,
            cursorY,
            width,
            height,
          );

          cursorY += height + 10;

          // PDF
        } else {
          const previewDataUrl = await loadPdfPreview(mediaUrl);

          const imageProps = doc.getImageProperties(previewDataUrl);

          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - cursorY - 20;

          const ratio = Math.min(
            maxWidth / imageProps.width,
            maxHeight / imageProps.height,
            1,
          );

          const width = imageProps.width * ratio;
          const height = imageProps.height * ratio;

          doc.addImage(previewDataUrl, "JPEG", margin, cursorY, width, height);

          cursorY += height + 10;
        }
      } else {
        doc.setFontSize(10);
        doc.text(
          piece.cheminFichier || "Piece non visualisable",
          margin,
          cursorY,
        );

        cursorY += 10;
      }
    }

    return doc;
  }

  async function openPiecesPreview() {
    setPdfBusy(true);
    try {
      const doc = await buildPiecesPdf();
      await openPdf(doc.output("blob"));
    } finally {
      setPdfBusy(false);
    }
  }

  async function openLetterPreview() {
    setPdfBusy(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let cursorY = 22;
      const photoPiece = getMediaPiece(demande, ["photo", "identit"]);

      doc.setFontSize(20);
      doc.text("Lettre de recu du dossier", margin, cursorY);
      cursorY += 12;
      doc.setFontSize(11);
      doc.text(`Reference: ${demande.numeroReference || "—"}`, margin, cursorY);
      cursorY += 8;
      doc.text(
        `Nom: ${demande.nomDemandeur || "—"} ${demande.prenomDemandeur || ""}`.trim(),
        margin,
        cursorY,
      );
      cursorY += 8;
      doc.text(
        `Statut: ${demande.statutDemandeLibelle || "—"}`,
        margin,
        cursorY,
      );
      cursorY += 10;
      doc.text("Nous confirmons la reception de la demande.", margin, cursorY);
      cursorY += 8;
      doc.text(
        "Conservez cette lettre pour le suivi du dossier.",
        margin,
        cursorY,
      );

      const qrCanvas = qrRef.current;
      if (qrCanvas) {
        doc.addImage(
          qrCanvas.toDataURL("image/png"),
          "PNG",
          pageWidth - 64,
          20,
          50,
          50,
        );
      }

      if (photoPiece?.url) {
        const photoDataUrl = await loadImageData(photoPiece.url);
        doc.addImage(photoDataUrl, "JPEG", pageWidth - 66, 80, 50, 62);
      }

      cursorY = 150;
      // doc.text("Signature: _______________________ ", margin, cursorY);
      await openPdf(doc.output("blob"));
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="page-light">
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <QRCodeCanvas
          ref={qrRef}
          value={statusUrl}
          size={240}
          level="H"
          includeMargin={false}
        />
      </div>
      <div className="top-bar">
        <div className="top-bar-icon">📄</div>
        <div className="top-bar-text">
          <h1>Demande #{id}</h1>
          <p>Statut: {demande.statutDemandeLibelle || "—"}</p>
        </div>
        <Link
          to={`/demandes/${demande.numeroPasseport || demande.numeroReference || ""}`}
          className="back-link"
        >
          ← Retour
        </Link>
      </div>

      <div
        className="card-light"
        style={{ maxWidth: 900, margin: "20px auto" }}
      >
        <h2>Informations du demandeur</h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}
        >
          <div>
            <p>
              <strong>Nom :</strong>{" "}
              {demande.nomDemandeur || demande.nom || "—"}
            </p>
            <p>
              <strong>Prénom :</strong>{" "}
              {demande.prenomDemandeur || demande.prenom || "—"}
            </p>
            <p>
              <strong>Référence :</strong> {demande.numeroReference || "—"}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 8 }}>
              {getMediaPiece(demande, ["photo", "identit"])?.url ? (
                <img
                  src={resolveMediaUrl(
                    getMediaPiece(demande, ["photo", "identit"])?.url,
                  )}
                  alt="photo"
                  style={{
                    width: 160,
                    height: 200,
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 160,
                    height: 200,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Photo manquante
                </div>
              )}
            </div>
            <div>
              {getMediaPiece(demande, ["signature"])?.url ? (
                <img
                  src={resolveMediaUrl(
                    getMediaPiece(demande, ["signature"])?.url,
                  )}
                  alt="signature"
                  style={{
                    width: 160,
                    height: 60,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 160,
                    height: 60,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Signature manquante
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: 20 }}>Pièces justificatives</h3>
        <div>
          {pieces.length === 0 && <p>Aucune pièce listée.</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {pieces.map((p, i) => (
              <div key={i} style={{ width: 160 }}>
                {p.url ? (
                  <img
                    src={resolveMediaUrl(p.url)}
                    alt={p.libelle || "pièce"}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: 8,
                      background: "#fff",
                      border: "1px solid #eee",
                    }}
                  >
                    {p.libelle || JSON.stringify(p)}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {p.libelle || ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
          <button
            className="btn-primary-light"
            onClick={openPiecesPreview}
            disabled={pdfBusy}
          >
            {pdfBusy ? "Génération..." : "Aperçu pièces justificatives"}
          </button>
          <button className="btn-secondary-light" onClick={openLetterPreview}>
            Lettre de reçu du dossier
          </button>
          <Link
            to={`/demande/${id}/capture`}
            className="btn-primary-light"
            style={{ marginLeft: "auto" }}
          >
            Photo et signature
          </Link>
        </div>
      </div>
    </div>
  );
}
