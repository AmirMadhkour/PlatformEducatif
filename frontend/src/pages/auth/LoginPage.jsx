import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/theme';

const schema = yup.object({
  email: yup.string().email('Format d\'email invalide').required('L\'email est obligatoire'),
  password: yup.string().required('Le mot de passe est obligatoire'),
});

const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  ENSEIGNANT: '/enseignant/dashboard',
  ELEVE: '/eleve/dashboard',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);
    try {
      const user = await login(data);
      const redirectTo = location.state?.from || ROLE_HOME[user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError('Email ou mot de passe incorrect.');
      } else if (err.response?.status === 403) {
        setApiError(err.response?.data?.message || 'Ce compte est désactivé.');
      } else {
        setApiError("Une erreur est survenue. Vérifiez que le serveur est bien démarré.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 9,
        backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 15.865%, ${COLORS.primaryDark} 63.462%)`,
      }}
    >
      <Stack spacing={4} sx={{ width: '100%', maxWidth: 448 }}>
        <Stack alignItems="center" spacing={1.5} direction="row" justifyContent="center">
          <Box sx={{ width: 48, height: 48, borderRadius: '16px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <SchoolIcon sx={{ color: COLORS.primary, fontSize: 26 }} />
          </Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 30, letterSpacing: '-0.75px' }}>EduPlatform</Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            boxShadow: `0px 20px 50px -12px rgba(21,101,192,0.15)`,
            p: 5,
          }}
        >
          <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 24, mb: 1 }}>Bon retour parmi nous</Typography>
          <Typography sx={{ color: COLORS.textBody, fontSize: 16, mb: 3 }}>
            Veuillez entrer vos identifiants pour accéder à votre espace.
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {apiError}
            </Alert>
          )}

          <Stack spacing={3}>
            <Box>
              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 1 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="nom@exemple.com"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase' }}>
                  Mot de passe
                </Typography>
                <Typography sx={{ color: COLORS.secondaryLight, fontWeight: 700, fontSize: 12, cursor: 'not-allowed' }} title="Fonctionnalité indisponible pour le moment">
                  Mot de passe oublié ?
                </Typography>
              </Stack>
              <TextField
                fullWidth
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: 14, color: '#4B5563' }}>Rester connecté</Typography>} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={<ArrowForwardIcon />}
              sx={{ backgroundColor: COLORS.primary, py: 2, fontSize: 16 }}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Stack>
        </Box>

        <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
          Pas encore inscrit ?{' '}
          <Box component={RouterLink} to="/register" sx={{ color: 'white', fontWeight: 800, textDecoration: 'none' }}>
            Créer un compte
          </Box>
        </Typography>

        <Stack spacing={2} alignItems="center" sx={{ opacity: 0.8, pt: 2 }}>
          <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            © 2026 EduPlatform Tunisie
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
