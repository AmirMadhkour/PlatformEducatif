import { useEffect, useState } from 'react';
import { Box, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import enseignantService from '../../services/enseignantService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EnseignantElevesListPage() {
  const { libelle } = useNiveauLabels();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    enseignantService.getMesEleves().then(setEleves).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>
        Mes élèves
      </Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {eleves.length === 0 ? (
            <EmptyState message="Aucun élève ne vous est affecté pour le moment." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NOM</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>STATUT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eleves.map((e) => (
                  <TableRow
                    key={e.id}
                    hover
                    onClick={() => navigate(`/enseignant/eleves/${e.id}`)}
                    sx={{ cursor: 'pointer', '& td': { fontFamily: 'Inter' } }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{e.prenom} {e.nom}</TableCell>
                    <TableCell>{e.niveau ? libelle(e.niveau) : '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={e.valide ? 'Validé' : 'En attente'}
                        sx={{ backgroundColor: e.valide ? '#DCFCE7' : '#FEF3C7', color: e.valide ? '#166534' : '#92400E', fontWeight: 700 }}
                      />
                    </TableCell>
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
