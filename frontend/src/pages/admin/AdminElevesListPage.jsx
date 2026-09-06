import { useEffect, useState } from 'react';
import { Box, Chip, Paper, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import eleveService from '../../services/eleveService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function AdminElevesListPage() {
  const { libelle } = useNiveauLabels();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const charger = () => {
    eleveService.getAll({ valide: true }).then(setEleves).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleToggle = async (e) => {
    await eleveService.toggleActivation(e.id, !e.enabled);
    charger();
  };

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>Élèves</Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {eleves.length === 0 ? (
            <EmptyState message="Aucun élève validé pour le moment." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NOM</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>MATIÈRES</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eleves.map((e) => (
                  <TableRow key={e.id} hover sx={{ '& td': { fontFamily: 'Inter' } }}>
                    <TableCell onClick={() => navigate(`/admin/eleves/${e.id}`)} sx={{ cursor: 'pointer', fontWeight: 600, color: COLORS.footerBackground }}>
                      {e.prenom} {e.nom}
                    </TableCell>
                    <TableCell>{e.niveau ? libelle(e.niveau) : '—'}</TableCell>
                    <TableCell>
                      {e.affectations?.map((a) => <Chip key={a.id} label={a.matiereNom} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)}
                    </TableCell>
                    <TableCell><Switch checked={e.enabled} onChange={() => handleToggle(e)} /></TableCell>
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
