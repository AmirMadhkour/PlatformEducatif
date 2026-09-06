import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, IconButton, InputAdornment, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';
import { useRegister } from '../../context/RegisterContext';
import { COLORS } from '../../theme/theme';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const schema = yup.object({
  nom: yup.string().required('Le nom complet est obligatoire'),
  telephone: yup.string(),
  email: yup.string().email("Format d'email invalide").required("L'email est obligatoire"),
  password: yup
    .string()
    .matches(PASSWORD_REGEX, 'Minimum 8 caractères, une majuscule et un chiffre')
    .required('Le mot de passe est obligatoire'),
});

export default function RegisterStep1Page() {
  const navigate = useNavigate();
  const { infosPersonnelles, setInfosPersonnelles } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [typeCoursGlobal, setTypeCoursGlobal] = useState(infosPersonnelles.typeCoursGlobal || 'GROUPE');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: infosPersonnelles.nom,
      telephone: infosPersonnelles.telephone,
      email: infosPersonnelles.email,
      password: infosPersonnelles.password,
    },
  });

  const onSubmit = (data) => {


    const [prenom, ...resteNom] = data.nom.trim().split(' ');
    const nom = resteNom.join(' ') || prenom;

    setInfosPersonnelles({
      ...data,
      nom,
      prenom,
      nomComplet: data.nom,
      typeCoursGlobal,
    });
    navigate('/register/parcours');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.background, display: 'flex', flexDirection: 'column' }}>
      <AuthNavbar rightLabel="Déjà un compte ?" rightLinkText="Se connecter" rightLinkTo="/login" />

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', py: 8, px: 3 }}>
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 672 }}>
          <Paper elevation={0} sx={{ borderRadius: '32px', boxShadow: '0px 20px 40px -12px rgba(21,101,192,0.15)', overflow: 'hidden' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 5 }}>
              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 30, mb: 1 }}>
                Créer un compte élève
              </Typography>
              <Typography sx={{ color: COLORS.textBody, fontSize: 16, mb: 4 }}>
                Commençons par vos informations personnelles pour configurer votre espace.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,35,126,0.7)', mb: 1 }}>Nom complet</Typography>
                  <TextField
                    fullWidth
                    placeholder="Jean Dupont"
                    error={!!errors.nom}
                    helperText={errors.nom?.message}
                    {...register('nom')}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,35,126,0.7)', mb: 1 }}>Téléphone</Typography>
                  <TextField
                    fullWidth
                    placeholder="06 12 34 56 78"
                    {...register('telephone')}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,35,126,0.7)', mb: 1 }}>Adresse e-mail</Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="eleve@email.com"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email')}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,35,126,0.7)', mb: 1 }}>Mot de passe</Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    error={!!errors.password}
                    helperText={errors.password?.message || 'Minimum 8 caractères, incluant une majuscule et un chiffre.'}
                    {...register('password')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPassword((v) => !v)}>
                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(26,35,126,0.7)', mb: 1.5 }}>Type de cours souhaité</Typography>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={typeCoursGlobal}
                    onChange={(_, val) => val && setTypeCoursGlobal(val)}
                    sx={{ gap: 2 }}
                  >
                    <ToggleButton
                      value="GROUPE"
                      sx={{
                        flex: 1, textAlign: 'left', alignItems: 'flex-start', flexDirection: 'column', p: 2, borderRadius: '16px !important',
                        border: `2px solid ${typeCoursGlobal === 'GROUPE' ? COLORS.primary : COLORS.borderLight} !important`,
                        backgroundColor: typeCoursGlobal === 'GROUPE' ? 'rgba(21,101,192,0.05)' : 'white',
                      }}
                    >
                      <GroupsOutlinedIcon sx={{ color: typeCoursGlobal === 'GROUPE' ? COLORS.primary : COLORS.textMuted, mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 16, textTransform: 'none' }}>Cours en groupe</Typography>
                      <Typography sx={{ fontSize: 12, color: 'rgba(26,35,126,0.6)', textTransform: 'none' }}>Apprentissage collaboratif</Typography>
                    </ToggleButton>
                    <ToggleButton
                      value="INDIVIDUEL"
                      sx={{
                        flex: 1, textAlign: 'left', alignItems: 'flex-start', flexDirection: 'column', p: 2, borderRadius: '16px !important',
                        border: `2px solid ${typeCoursGlobal === 'INDIVIDUEL' ? COLORS.primary : COLORS.borderLight} !important`,
                        backgroundColor: typeCoursGlobal === 'INDIVIDUEL' ? 'rgba(21,101,192,0.05)' : 'white',
                      }}
                    >
                      <SchoolOutlinedIcon sx={{ color: typeCoursGlobal === 'INDIVIDUEL' ? COLORS.primary : COLORS.textMuted, mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 16, textTransform: 'none' }}>Cours individuel</Typography>
                      <Typography sx={{ fontSize: 12, color: 'rgba(26,35,126,0.6)', textTransform: 'none' }}>Accompagnement sur-mesure</Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>

              <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 4 }}>
                <Button type="submit" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ backgroundColor: COLORS.primary, px: 5, py: 1.75 }}>
                  Étape suivante
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Typography sx={{ textAlign: 'center', color: COLORS.textBody, fontSize: 14 }}>
            Déjà inscrit ?{' '}
            <Box component="span" sx={{ color: COLORS.primary, fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Connectez-vous à votre espace
            </Box>
          </Typography>
        </Stack>
      </Box>

      <AuthFooter />
    </Box>
  );
}
