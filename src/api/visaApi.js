const API_URL = "http://localhost:8080/api";

async function requestJson(path, errorMessage) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

async function verifierNumero(numero) {
  return requestJson(
    `/demandes/verifier-numero/${encodeURIComponent(numero)}`,
    "Numéro introuvable ou invalide",
  );
}

async function getTypesVisa() {
  return requestJson("/types_visa", "Impossible de charger les types de visa");
}

async function getTypesDemande() {
  return requestJson(
    "/types_demande",
    "Impossible de charger les types de demande",
  );
}

async function getNationalites() {
  return requestJson("/nationalites", "Impossible de charger les nationalités");
}

async function getSituationsFamiliales() {
  return requestJson(
    "/situations_familiales",
    "Impossible de charger les situations familiales",
  );
}

async function getPiecesComplementaires(typeVisaId) {
  const encodedTypeVisaId = encodeURIComponent(typeVisaId);
  const paths = [
    `/piece/${encodedTypeVisaId}`,
    `/pieces_complementaires?typeVisaId=${encodedTypeVisaId}`,
    "/pieces_complementaires",
  ];

  let lastError = new Error("Impossible de charger les pièces complémentaires");

  for (const path of paths) {
    try {
      const response = await fetch(`${API_URL}${path}`);
      if (!response.ok) {
        lastError = new Error(
          "Impossible de charger les pièces complémentaires",
        );
        continue;
      }

      return response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : lastError;
    }
  }

  throw lastError;
}

async function creerDemande(formData) {
  const response = await fetch(`${API_URL}/demandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Impossible d'envoyer la demande");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export {
  creerDemande,
  getNationalites,
  getPiecesComplementaires,
  getSituationsFamiliales,
  getTypesDemande,
  getTypesVisa,
  verifierNumero,
};
