import { useEffect, useState } from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import enseignantService from '../../services/enseignantService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminEnseignantsListPage() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const charger = () => {
    enseignantService.getAll().then(setEnseignants).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleToggle = async (ens) => {
    await enseignantService.toggleActivation(ens.id, !ens.enabled);
    charger();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>Enseignants</Typography>
        <Button onClick={() => navigate('/admin/enseignants/nouveau')} variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: COLORS.primary }}>
          Ajouter un enseignant
        </Button>
      </Stack>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {enseignants.length === 0 ? (
            <EmptyState message="Aucun enseignant pour le moment." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NOM</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>SPÉCIALITÉ</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>MATIÈRES</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIF</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enseignants.map((ens) => (
                  <TableRow key={ens.id} hover sx={{ '& td': { fontFamily: 'Inter' } }}>
                    <TableCell onClick={() => navigate(`/admin/enseignants/${ens.id}`)} sx={{ cursor: 'pointer', fontWeight: 600, color: COLORS.footerBackground }}>
                      {ens.prenom} {ens.nom}
                    </TableCell>
                    <TableCell>{ens.specialite || '—'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {ens.matieres?.map((m) => <Chip key={m.id} label={m.nom} size="small" />)}
                      </Stack>
                    </TableCell>
                    <TableCell><Switch checked={ens.enabled} onChange={() => handleToggle(ens)} /></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/admin/enseignants/${ens.id}/modifier`)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
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
