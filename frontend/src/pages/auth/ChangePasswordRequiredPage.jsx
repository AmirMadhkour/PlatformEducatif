import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { COLORS } from '../../theme/theme';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const schema = yup.object({
  nouveauMotDePasse: yup
    .string()
    .matches(PASSWORD_REGEX, 'Minimum 8 caractères, une majuscule et un chiffre')
    .required('Le nouveau mot de passe est obligatoire'),
  confirmation: yup
    .string()
    .oneOf([yup.ref('nouveauMotDePasse')], 'Les mots de passe ne correspondent pas')
    .required('Confirmez le nouveau mot de passe'),
});


export default function ChangePasswordRequiredPage() {
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);
    try {
      await authService.changePassword({ nouveauMotDePasse: data.nouveauMotDePasse });
      updateUser({ mustChangePassword: false });
      navigate('/enseignant/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`, p: 3 }}>
      <Paper elevation={0} sx={{ maxWidth: 460, width: '100%', borderRadius: '24px', p: 5 }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: COLORS.primary }} />
          <Typography sx={{ fontWeight: 700, fontSize: 22, color: COLORS.primaryDark, textAlign: 'center' }}>
            Choisissez un nouveau mot de passe
          </Typography>
          <Typography sx={{ color: COLORS.textBody, fontSize: 14, textAlign: 'center' }}>
            Votre mot de passe actuel est temporaire. Vous devez en définir un nouveau avant d'accéder à votre espace.
          </Typography>
        </Stack>

        {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{apiError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type={showNew ? 'text' : 'password'}
              error={!!errors.nouveauMotDePasse}
              helperText={errors.nouveauMotDePasse?.message}
              {...register('nouveauMotDePasse')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew((v) => !v)} edge="end">
                      {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmer le nouveau mot de passe"
              type={showNew ? 'text' : 'password'}
              error={!!errors.confirmation}
              helperText={errors.confirmation?.message}
              {...register('confirmation')}
            />

            <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: COLORS.primary, py: 1.5 }}>
              {loading ? 'Modification…' : 'Changer le mot de passe'}
            </Button>

            <Button onClick={logout} sx={{ color: COLORS.textMuted }}>
              Se déconnecter
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
