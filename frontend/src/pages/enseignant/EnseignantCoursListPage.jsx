import { useEffect, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import coursService from '../../services/coursService';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EnseignantCoursListPage() {
  const { libelle } = useNiveauLabels();
  const [cours, setCours] = useState([]);
  const [titre, setTitre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const charger = (filtreTitre) => {
    setLoading(true);
    coursService
      .search({ titre: filtreTitre || undefined })
      .then(setCours)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    charger();
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>Mes cours</Typography>
        <Button onClick={() => navigate('/enseignant/cours/nouveau')} variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: COLORS.primary }}>
          Ajouter un cours
        </Button>
      </Stack>

      <TextField
        placeholder="Rechercher un cours..."
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && charger(titre)}
        onBlur={() => charger(titre)}
        size="small"
        sx={{ mb: 3, width: 320 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: COLORS.textMuted }} /></InputAdornment> }}
      />

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
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cours.map((c) => (
                  <TableRow key={c.id} hover sx={{ '& td': { fontFamily: 'Inter' } }}>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{c.titre}</TableCell>
                    <TableCell>{c.matiereNom}</TableCell>
                    <TableCell>{c.niveau ? libelle(c.niveau) : '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/enseignant/cours/${c.id}`)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/enseignant/cours/${c.id}/modifier`)}>
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
