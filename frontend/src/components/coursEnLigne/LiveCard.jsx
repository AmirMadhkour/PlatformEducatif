import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { construireLienAjoutCalendrier } from '../../utils/googleCalendarLink';
import { COLORS } from '../../theme/theme';

const STATUTS = {
  PROGRAMME: { label: 'Programmé', bg: '#EFF6FF', color: COLORS.primary },
  EN_COURS: { label: '🔴 En direct', bg: '#FEE2E2', color: '#DC2626' },
  TERMINE: { label: 'Terminé', bg: '#F1F5F9', color: '#64748B' },
};


export default function LiveCard({ live, actions }) {
  const style = STATUTS[live.statut] || STATUTS.PROGRAMME;
  const dateAffichee = new Date(live.dateCours + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS.footerBackground }}>
            {live.matiereNom} : {live.titre}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textMuted }}>{live.enseignantNomComplet}</Typography>
        </Box>
        <Chip label={style.label} size="small" sx={{ backgroundColor: style.bg, color: style.color, fontWeight: 700 }} />
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <EventOutlinedIcon sx={{ fontSize: 16, color: COLORS.textMuted }} />
        <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textBody, textTransform: 'capitalize' }}>
          {dateAffichee} · {live.heureDebut?.slice(0, 5)} - {live.heureFin?.slice(0, 5)}
        </Typography>
      </Stack>

      {live.statut === 'EN_COURS' && (
        <Button
          fullWidth
          startIcon={<VideoCameraFrontIcon />}
          onClick={() => window.open(live.zoomLink, '_blank', 'noopener,noreferrer')}
          sx={{ backgroundColor: '#DC2626', color: 'white', '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Rejoindre le live (Zoom)
        </Button>
      )}

      {live.statut === 'PROGRAMME' && (
        <Button
          fullWidth
          variant="outlined"
          onClick={() => window.open(construireLienAjoutCalendrier(live), '_blank', 'noopener,noreferrer')}
        >
          Ajouter au calendrier
        </Button>
      )}

      {live.statut === 'TERMINE' && (
        <Button fullWidth disabled variant="outlined">
          Live terminé
        </Button>
      )}

      {actions}
    </Paper>
  );
}
