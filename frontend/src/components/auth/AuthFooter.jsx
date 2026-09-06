import { Box, Grid, Stack, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { COLORS } from '../../theme/theme';

const colonnes = [
  { titre: 'Plateforme', liens: ['Tous les cours', 'Nos enseignants', 'Packs révision Bac', 'Abonnements'] },
  { titre: 'Assistance', liens: ["Centre d'aide", "Guide de l'étudiant", 'Contactez-nous'] },
];

export default function AuthFooter() {
  return (
    <Box component="footer" sx={{ backgroundColor: COLORS.footerBackground, borderTop: `1px solid ${COLORS.footerBorder}`, pt: 10, pb: 5, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={6} sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SchoolIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 24 }}>EduPlatform</Typography>
          </Stack>
          <Typography sx={{ color: '#9CA3AF', fontSize: 14, lineHeight: '22.75px' }}>
            La plateforme éducative de référence en Tunisie. Accédez à des milliers de cours et préparez vos examens avec sérénité.
          </Typography>
        </Grid>

        {colonnes.map((col) => (
          <Grid item xs={6} md={3} key={col.titre}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16, mb: 3 }}>{col.titre}</Typography>
            <Stack spacing={2}>
              {col.liens.map((lien) => (
                <Typography key={lien} sx={{ color: '#9CA3AF', fontSize: 14 }}>
                  {lien}
                </Typography>
              ))}
            </Stack>
          </Grid>
        ))}

        <Grid item xs={12} md={3}>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16, mb: 3 }}>Suivez-nous</Typography>
          <Stack direction="row" spacing={2}>
            {[FacebookIcon, InstagramIcon, MusicNoteIcon].map((Icon, i) => (
              <Box
                key={i}
                sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: COLORS.footerBorder, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon sx={{ color: 'white', fontSize: 16 }} />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ maxWidth: 1440, mx: 'auto', pt: 4, mt: 6, borderTop: `1px solid ${COLORS.footerBorder}` }}
      >
        <Typography sx={{ color: '#6B7280', fontSize: 14 }}>© 2026 EduPlatform Tunisie. Tous droits réservés.</Typography>
        <Stack direction="row" spacing={3}>
          <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Mentions légales</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Confidentialité</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
