import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import coursService from '../../services/coursService';
import enseignantService from '../../services/enseignantService';
import coursEnLigneService from '../../services/coursEnLigneService';
import { useProfile } from '../../context/ProfileContext';
import { StatCard, LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EnseignantDashboardPage() {
  const { libelle } = useNiveauLabels();
  const { profile, loading: profileLoading } = useProfile();
  const [cours, setCours] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [lives, setLives] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);
  const loading = profileLoading || dataLoading || !profile;

  useEffect(() => {
    Promise.all([coursService.search({}), enseignantService.getMesEleves(), coursEnLigneService.mesLivesEnseignant()])
      .then(([c, e, l]) => {
        setCours(c);
        setEleves(e);
        setLives(l);
      })
      .catch(() => setError(true))
      .finally(() => setDataLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>
        Tableau de bord — {profile?.prenom} {profile?.nom}
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', color: '#64748B', fontSize: 14, mb: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Spécialité : {profile?.specialite || 'Non renseignée'}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <StatCard icon={<GroupsIcon sx={{ color: COLORS.primary }} />} iconBg="rgba(21,101,192,0.1)" label="Élèves actifs" value={eleves.length} />
        <StatCard icon={<MenuBookIcon sx={{ color: '#7C3AED' }} />} iconBg="rgba(124,58,237,0.1)" label="Cours publiés" value={cours.length} />
        <StatCard
          icon={<VideoCameraFrontIcon sx={{ color: '#DC2626' }} />}
          iconBg="rgba(220,38,38,0.1)"
          label="Lives programmés"
          value={lives.filter((l) => l.statut !== 'TERMINE').length}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper elevation={0} sx={{ flex: 2, border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground }}>Gestion des cours</Typography>
            <Button component={RouterLink} to="/enseignant/cours/nouveau" variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: COLORS.primary }}>
              Ajouter un cours
            </Button>
          </Stack>

          {cours.length === 0 ? (
            <EmptyState message="Aucun cours publié pour le moment." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>TITRE</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NIVEAU</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cours.slice(0, 5).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell sx={{ fontFamily: 'Inter' }}>{c.titre}</TableCell>
                    <TableCell sx={{ fontFamily: 'Inter' }}>{c.niveau ? libelle(c.niveau) : '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton component={RouterLink} to={`/enseignant/cours/${c.id}/modifier`} size="small">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton component={RouterLink} to={`/enseignant/cours/${c.id}`} size="small">
                        <DeleteOutlineIcon fontSize="small" sx={{ color: '#EF4444' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        <Paper elevation={0} sx={{ flex: 1, border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground }}>Mes élèves</Typography>
            <Box component={RouterLink} to="/enseignant/eleves" sx={{ color: COLORS.primary, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Voir tout
            </Box>
          </Stack>
          {eleves.length === 0 ? (
            <EmptyState message="Aucun élève affecté pour le moment." />
          ) : (
            <Stack spacing={2} divider={<Box sx={{ borderBottom: '1px solid #F1F5F9' }} />}>
              {eleves.slice(0, 5).map((e) => (
                <Box key={e.id} component={RouterLink} to={`/enseignant/eleves/${e.id}`} sx={{ textDecoration: 'none' }}>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: COLORS.footerBackground }}>
                    {e.prenom} {e.nom}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#94A3B8', textTransform: 'uppercase' }}>{e.niveau ? libelle(e.niveau) : ''}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
