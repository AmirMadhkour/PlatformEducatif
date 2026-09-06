import { useEffect, useState } from 'react';
import { Box, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import coursEnLigneService from '../../services/coursEnLigneService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

const STATUT_STYLE = {
  PROGRAMME: { label: 'Programmé', bg: '#EFF6FF', color: COLORS.primary },
  EN_COURS: { label: '🔴 En direct', bg: '#FEE2E2', color: '#DC2626' },
  TERMINE: { label: 'Terminé', bg: '#F1F5F9', color: '#64748B' },
};

export default function AdminLivesListPage() {
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    coursEnLigneService.tousLesLives().then(setLives).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 1 }}>
        Cours en ligne
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', color: COLORS.textBody, mb: 3 }}>
        Vue de supervision — la création/modification est réservée aux enseignants.
      </Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {lives.length === 0 ? (
            <EmptyState message="Aucun cours en ligne programmé sur la plateforme." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>COURS</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ENSEIGNANT</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>DATE</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>HEURE</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>STATUT</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>LIEN ZOOM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lives.map((live) => {
                  const style = STATUT_STYLE[live.statut] || STATUT_STYLE.PROGRAMME;
                  return (
                    <TableRow key={live.id} sx={{ '& td': { fontFamily: 'Inter' } }}>
                      <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{live.matiereNom} : {live.titre}</TableCell>
                      <TableCell>{live.enseignantNomComplet}</TableCell>
                      <TableCell>{new Date(live.dateCours + 'T00:00:00').toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{live.heureDebut?.slice(0, 5)} - {live.heureFin?.slice(0, 5)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={style.label} sx={{ backgroundColor: style.bg, color: style.color, fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={live.zoomLink}>
                          <Typography sx={{ fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {live.zoomLink}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
}
