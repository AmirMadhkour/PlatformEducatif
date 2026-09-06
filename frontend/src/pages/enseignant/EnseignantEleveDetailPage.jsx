import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import eleveService from '../../services/eleveService';
import { LoadingState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EnseignantEleveDetailPage() {
  const { libelle } = useNiveauLabels();
  const { id } = useParams();
  const [eleve, setEleve] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eleveService
      .getById(id)
      .then(setEleve)
      .catch((err) => {


        if (err.response?.status === 403) {
          setError("Vous n'avez pas accès à cet élève : il ne vous est pas affecté.");
        } else {
          setError('Impossible de charger cet élève.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>;
  if (!eleve) return null;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>
          {eleve.prenom} {eleve.nom}
        </Typography>
        <Chip
          label={eleve.valide ? 'Compte validé' : 'En attente de validation'}
          sx={{ backgroundColor: eleve.valide ? '#DCFCE7' : '#FEF3C7', color: eleve.valide ? '#166534' : '#92400E', fontWeight: 700 }}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: COLORS.footerBackground, mb: 2 }}>
              Informations
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PersonOutlineIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                <Typography sx={{ fontFamily: 'Inter', fontSize: 14 }}>{eleve.niveau ? libelle(eleve.niveau) : ''} {eleve.classe && `— ${eleve.classe}`}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EmailOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                <Typography sx={{ fontFamily: 'Inter', fontSize: 14 }}>{eleve.email}</Typography>
              </Stack>
              {eleve.telephone && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 14 }}>{eleve.telephone}</Typography>
                </Stack>
              )}
              {eleve.adresse && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <HomeOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 14 }}>{eleve.adresse}</Typography>
                </Stack>
              )}
            </Stack>

            {(eleve.parentNom || eleve.parentTelephone) && (
              <>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: COLORS.footerBackground, mt: 3, mb: 1 }}>
                  Contact parent
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: '#64748B' }}>
                  {eleve.parentNom} {eleve.parentTelephone && `· ${eleve.parentTelephone}`}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: COLORS.footerBackground, mb: 2 }}>
              Matières
            </Typography>
            <Stack spacing={1.5}>
              {eleve.affectations?.map((a) => (
                <Stack key={a.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderRadius: '12px', backgroundColor: COLORS.background }}>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 600 }}>{a.matiereNom}</Typography>
                  <Chip size="small" label={a.typeCours === 'GROUPE' ? 'Groupe' : 'Individuel'} />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
