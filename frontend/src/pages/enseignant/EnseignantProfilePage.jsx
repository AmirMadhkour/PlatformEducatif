import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Chip, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useProfile } from '../../context/ProfileContext';
import authService from '../../services/authService';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EnseignantProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, reset } = useForm();
  const pwdForm = useForm();
  const [pwdMessage, setPwdMessage] = useState(null);
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      reset({ nom: profile.nom, prenom: profile.prenom, telephone: profile.telephone || '', specialite: profile.specialite || '', diplome: profile.diplome || '', experience: profile.experience || '', biographie: profile.biographie || '' });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateProfile(data);
      setSuccess(true);
    } catch {
      setError('Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    setPwdSaving(true);
    setPwdMessage(null);
    try {
      await authService.changePassword({ ancienMotDePasse: data.ancien, nouveauMotDePasse: data.nouveau });
      setPwdMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
      pwdForm.reset();
    } catch (err) {
      setPwdMessage({ type: 'error', text: err.response?.data?.message || "L'ancien mot de passe est incorrect." });
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 1 }}>Mon profil</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {profile?.matieres?.map((m) => <Chip key={m.id} label={m.nom} size="small" />)}
      </Stack>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4, mb: 3 }}>
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>Profil mis à jour avec succès.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" {...register('nom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" {...register('prenom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" {...register('telephone')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={profile?.email || ''} disabled helperText="Non modifiable" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Spécialité" {...register('specialite')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Diplôme" {...register('diplome')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Années d'expérience" {...register('experience')} /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Biographie" {...register('biographie')} /></Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: COLORS.primary, px: 4 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} component="form" onSubmit={pwdForm.handleSubmit(onChangePassword)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: COLORS.footerBackground, mb: 2 }}>Changer mon mot de passe</Typography>
        {pwdMessage && <Alert severity={pwdMessage.type} sx={{ mb: 2, borderRadius: '12px' }}>{pwdMessage.text}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="password" label="Ancien mot de passe" {...pwdForm.register('ancien', { required: true })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="password" label="Nouveau mot de passe" helperText="8 caractères min., une majuscule, un chiffre" {...pwdForm.register('nouveau', { required: true })} />
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button type="submit" variant="outlined" disabled={pwdSaving}>{pwdSaving ? 'Envoi…' : 'Changer le mot de passe'}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
