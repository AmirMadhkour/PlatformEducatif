import { useEffect, useState } from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import affectationService from '../../services/affectationService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EleveMatieresPage() {
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    affectationService.getMesAffectations().then(setAffectations).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>Mes matières</Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && affectations.length === 0 && <EmptyState message="Aucune matière demandée." />}

      {!loading && !error && (
        <Stack spacing={2}>
          {affectations.map((a) => (
            <Paper key={a.id} elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: COLORS.footerBackground }}>{a.matiereNom}</Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textBody, mt: 0.5 }}>
                    {a.enseignantNomComplet ? `Enseignant : ${a.enseignantNomComplet}` : "En attente d'affectation d'un enseignant"}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: COLORS.textMuted, mt: 0.5 }}>
                    Mode : {a.typeCours === 'GROUPE' ? 'Groupe' : 'Individuel'}
                  </Typography>
                </Box>
                <Chip
                  label={a.statut === 'AFFECTEE' ? 'Affectée' : 'En attente'}
                  sx={{ backgroundColor: a.statut === 'AFFECTEE' ? '#DCFCE7' : '#FEF3C7', color: a.statut === 'AFFECTEE' ? '#166534' : '#92400E', fontWeight: 700 }}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
