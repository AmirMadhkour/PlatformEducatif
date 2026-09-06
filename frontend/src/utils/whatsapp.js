const NUMERO_ADMIN = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER;


export function construireLienWhatsAppInscription({ nomComplet, email, telephone, matieresAvecMode }) {
  const lignesMatieres = matieresAvecMode
    .map((m) => `- ${m.nom} — ${m.mode === 'GROUPE' ? 'Groupe' : 'Individuel'}`)
    .join('\n');

  const message = [
    'Bonjour,',
    '',
    "Je viens de créer une demande d'inscription sur EduPlatform.",
    '',
    `Nom : ${nomComplet}`,
    `Email : ${email}`,
    telephone ? `Téléphone : ${telephone}` : null,
    '',
    'Matières demandées :',
    lignesMatieres,
    '',
    'Je souhaite confirmer les tarifs et finaliser mon inscription.',
    '',
    'Merci.',
  ]
    .filter((ligne) => ligne !== null)
    .join('\n');

  return `https://wa.me/${NUMERO_ADMIN}?text=${encodeURIComponent(message)}`;
}

export const whatsappConfigured = !!NUMERO_ADMIN;
