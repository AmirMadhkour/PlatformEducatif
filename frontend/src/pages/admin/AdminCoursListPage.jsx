import { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import coursService from '../../services/coursService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function AdminCoursListPage() {
  const { libelle } = useNiveauLabels();
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    coursService.search({}).then(setCours).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 1 }}>Cours</Typography>
      <Typography sx={{ fontFamily: 'Inter', color: COLORS.textBody, mb: 3 }}>
        Vue de supervision — la gestion des cours (création, modification, suppression) est réservée aux enseignants.
      </Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {cours.length === 0 ? (
            <EmptyState message="Aucun cours publié pour le moment." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>TITRE</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>MATIÈRE</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ENSEIGNANT</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cours.map((c) => (
                  <TableRow key={c.id} sx={{ '& td': { fontFamily: 'Inter' } }}>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{c.titre}</TableCell>
                    <TableCell>{c.matiereNom}</TableCell>
                    <TableCell>{c.enseignantNomComplet}</TableCell>
                    <TableCell>{c.niveau ? libelle(c.niveau) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
}
