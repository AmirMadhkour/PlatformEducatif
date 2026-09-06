
export function construireLienAjoutCalendrier({ titre, description, dateCours, heureDebut, heureFin, zoomLink }) {
  const formatGoogle = (date, heure) => `${date}T${heure}`.replace(/[-:]/g, '').slice(0, 15) + '00';
  const dates = `${formatGoogle(dateCours, heureDebut)}/${formatGoogle(dateCours, heureFin)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titre,
    dates,
    details: `${description || ''}\n\nRejoindre (Zoom) : ${zoomLink}`,
    location: zoomLink,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
