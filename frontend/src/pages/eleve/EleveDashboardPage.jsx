import { useEffect, useState } from 'react';
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import { useProfile } from '../../context/ProfileContext';
import coursService from '../../services/coursService';
import coursEnLigneService from '../../services/coursEnLigneService';
import LiveCard from '../../components/coursEnLigne/LiveCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EleveDashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const [cours, setCours] = useState([]);
  const [lives, setLives] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bienvenueVisible, setBienvenueVisible] = useState(true);
  const loading = profileLoading || dataLoading || !profile;

  useEffect(() => {
    Promise.all([coursService.search({}), coursEnLigneService.mesLivesEleve()])
      .then(([c, l]) => {
        setCours(c);
        setLives(l);
      })
      .catch(() => setError(true))
      .finally(() => setDataLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color: COLORS.footerBackground }}>
        Bonjour, {profile?.prenom} ! 👋
      </Typography>

      {profile?.valide && bienvenueVisible && (
        <Paper elevation={0} sx={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', p: 3, my: 3, position: 'relative' }}>
          <IconButton size="small" onClick={() => setBienvenueVisible(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#065F46' }}>🎉 Bienvenue sur EduPlatform !</Typography>
          <Typography sx={{ fontFamily: 'Inter', color: '#065F46', fontSize: 14, mt: 0.5, pr: 3 }}>
            Votre inscription a été validée. Vos matières et enseignants ont été affectés. Commencez dès maintenant votre parcours d'apprentissage.
          </Typography>
        </Paper>
      )}

      {!profile?.valide && (
        <Paper elevation={0} sx={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '16px', p: 3, my: 3 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#92400E' }}>Compte en attente de validation</Typography>
          <Typography sx={{ fontFamily: 'Inter', color: '#92400E', fontSize: 14, mt: 0.5 }}>
            Votre compte sera activé dès qu'un enseignant aura été affecté à chacune de vos matières et que l'administrateur aura validé votre inscription. Vous n'avez pas encore accès aux cours.
          </Typography>
        </Paper>
      )}

      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground, mt: 4, mb: 2 }}>
        Prochains lives
      </Typography>
      {lives.filter((l) => l.statut !== 'TERMINE').length === 0 ? (
        <EmptyState message="Aucun live programmé pour le moment." />
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
          {lives
            .filter((l) => l.statut !== 'TERMINE')
            .sort((a, b) => (a.statut === 'EN_COURS' ? -1 : b.statut === 'EN_COURS' ? 1 : 0))
            .map((live) => (
              <Box key={live.id} sx={{ width: 320 }}>
                <LiveCard live={live} />
              </Box>
            ))}
        </Stack>
      )}

      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground, mt: 4, mb: 2 }}>
        Mes matières
      </Typography>
      {!profile?.affectations || profile.affectations.length === 0 ? (
        <EmptyState message="Aucune matière demandée." />
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
          {profile.affectations.map((aff) => (
            <Paper key={aff.id} elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 2.5, width: 260 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS.footerBackground }}>{aff.matiereNom}</Typography>
                <Chip
                  size="small"
                  label={aff.statut === 'AFFECTEE' ? 'Affectée' : 'En attente'}
                  sx={{
                    backgroundColor: aff.statut === 'AFFECTEE' ? '#DCFCE7' : '#FEF3C7',
                    color: aff.statut === 'AFFECTEE' ? '#166534' : '#92400E',
                    fontWeight: 700,
                  }}
                />
              </Stack>
              <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: '#64748B', mt: 1 }}>
                {aff.enseignantNomComplet ? `Enseignant : ${aff.enseignantNomComplet}` : "Enseignant pas encore affecté"}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}

      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground, mb: 2 }}>
        Mes cours
      </Typography>
      {cours.length === 0 ? (
        <EmptyState message={profile?.valide ? 'Aucun cours disponible pour le moment.' : 'Aucun cours disponible tant que votre compte n\'est pas validé.'} />
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {cours.map((c) => (
            <Paper
              key={c.id}
              component={RouterLink}
              to={`/eleve/cours/${c.id}`}
              elevation={0}
              sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 2.5, width: 280, textDecoration: 'none', display: 'block' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <MenuBookIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS.footerBackground }}>{c.titre}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: '#64748B' }}>{c.matiereNom} · {c.enseignantNomComplet}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
