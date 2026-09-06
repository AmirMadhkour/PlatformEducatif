import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import coursService from '../../services/coursService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EleveCoursListPage() {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    coursService.search({}).then(setCours).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>Mes cours</Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && cours.length === 0 && (
        <EmptyState message="Aucun cours accessible pour le moment (compte non validé ou en attente d'affectation)." />
      )}

      {!loading && !error && cours.length > 0 && (
        <Grid container spacing={3}>
          {cours.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Paper
                elevation={0}
                onClick={() => navigate(`/eleve/cours/${c.id}`)}
                sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, cursor: 'pointer', height: '100%' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: 'rgba(21,101,192,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MenuBookIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS.footerBackground }}>{c.titre}</Typography>
                </Stack>
                <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textBody, mb: 1 }}>{c.description}</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: COLORS.textMuted }}>{c.matiereNom} · {c.enseignantNomComplet}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
