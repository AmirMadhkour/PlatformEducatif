import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { statistiqueService } from '../../services/statistiqueService';
import { StatCard, LoadingState, ErrorState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    statistiqueService
      .getStatistiques()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color: COLORS.footerBackground }}>
        Bonjour, Administrateur 👋
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', color: '#64748B', fontSize: 16, mb: 4 }}>
        Voici ce qui se passe sur EduPlatform Tunisie aujourd'hui.
      </Typography>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {stats && (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <StatCard
              icon={<PeopleAltOutlinedIcon sx={{ color: COLORS.primary }} />}
              iconBg="rgba(21,101,192,0.1)"
              label="Élèves (total)"
              value={stats.totalEleves}
              subtitle={`${stats.elevesValides} validés`}
            />
            <StatCard
              icon={<PersonAddAltOutlinedIcon sx={{ color: '#F59E0B' }} />}
              iconBg="rgba(245,158,11,0.1)"
              label="Inscriptions en attente"
              value={stats.elevesEnAttente}
              trend={stats.elevesEnAttente > 0 ? 'Action requise' : undefined}
              trendColor="#F59E0B"
            />
            <StatCard
              icon={<SchoolOutlinedIcon sx={{ color: COLORS.secondaryLight }} />}
              iconBg="rgba(79,195,247,0.1)"
              label="Enseignants"
              value={stats.totalEnseignants}
              subtitle={`${stats.enseignantsActifs} actifs`}
            />
            <StatCard
              icon={<LayersOutlinedIcon sx={{ color: '#64748B' }} />}
              iconBg="#F1F5F9"
              label="Cours publiés"
              value={stats.totalCours}
              subtitle="Total plateforme"
            />
          </Stack>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, height: '100%' }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground, mb: 2 }}>
                  Matières de référence
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', color: '#64748B', fontSize: 14 }}>
                  {stats.totalMatieres} matières configurées sur la plateforme.
                </Typography>
                <Box component={RouterLink} to="/admin/matieres" sx={{ display: 'inline-block', mt: 2, color: COLORS.primary, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Gérer les matières →
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, height: '100%' }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: COLORS.footerBackground, mb: 2 }}>
                  Affectations en attente
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {stats.affectationsEnAttente > 0 ? (
                    <WarningAmberIcon sx={{ color: '#F59E0B' }} />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ color: '#10B981' }} />
                  )}
                  <Typography sx={{ fontFamily: 'Inter', color: '#64748B', fontSize: 14 }}>
                    {stats.affectationsEnAttente} matière(s) demandée(s) sans enseignant affecté.
                  </Typography>
                </Stack>
                <Box component={RouterLink} to="/admin/inscriptions" sx={{ display: 'inline-block', mt: 2, color: COLORS.primary, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Traiter les inscriptions →
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
