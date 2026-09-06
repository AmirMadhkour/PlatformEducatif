import { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import eleveService from '../../services/eleveService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function AdminInscriptionsListPage() {
  const { libelle } = useNiveauLabels();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    eleveService.getAll({ valide: false }).then(setEleves).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>
        Inscriptions en attente
      </Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {eleves.length === 0 ? (
            <EmptyState message="Aucune inscription en attente." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NOM</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>EMAIL</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eleves.map((e) => (
                  <TableRow key={e.id} hover onClick={() => navigate(`/admin/inscriptions/${e.id}`)} sx={{ cursor: 'pointer', '& td': { fontFamily: 'Inter' } }}>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{e.prenom} {e.nom}</TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>{e.niveau ? libelle(e.niveau) : '—'}</TableCell>
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
