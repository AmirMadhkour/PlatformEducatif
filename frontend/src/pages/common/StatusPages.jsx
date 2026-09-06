import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/theme';

const ROLE_HOME = { ADMIN: '/admin/dashboard', ENSEIGNANT: '/enseignant/dashboard', ELEVE: '/eleve/dashboard' };

function CentralMessagePage({ Icon, title, description }) {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.background, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 480, p: 5, borderRadius: '24px', boxShadow: '0px 10px 40px -10px rgba(21,101,192,0.08)', textAlign: 'center' }}>
        <Icon sx={{ fontSize: 56, color: COLORS.primary, mb: 2 }} />
        <Typography sx={{ color: COLORS.primaryDark, fontFamily: 'Inter', fontWeight: 700, fontSize: 22, mb: 1.5 }}>{title}</Typography>
        <Typography sx={{ color: COLORS.textBody, fontFamily: 'Inter', fontSize: 14, mb: 4 }}>{description}</Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: COLORS.primary, py: 1.5 }}
          onClick={() => navigate(isAuthenticated ? ROLE_HOME[role] || '/login' : '/login')}
        >
          {isAuthenticated ? 'Retour à mon espace' : 'Retour à la connexion'}
        </Button>
      </Paper>
    </Box>
  );
}

export function NotFoundPage() {
  return <CentralMessagePage Icon={SearchOffIcon} title="Page introuvable" description="La page que vous cherchez n'existe pas ou a été déplacée." />;
}

export function AccessDeniedPage() {
  return <CentralMessagePage Icon={BlockIcon} title="Accès refusé" description="Votre rôle ne vous permet pas d'accéder à cette page." />;
}
