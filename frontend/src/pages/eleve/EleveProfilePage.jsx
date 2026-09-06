import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Alert, Box, Button, FormControlLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useProfile } from '../../context/ProfileContext';
import authService from '../../services/authService';
import NiveauSelect from '../../components/common/NiveauSelect';
import { PAYS_BAC_OPTIONS } from '../../constants/paysBac';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EleveProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, control, watch, reset } = useForm();
  const niveauChoisi = watch('niveau');
  const typeBacChoisi = watch('typeBac');
  const [paysSelectionne, setPaysSelectionne] = useState('');
  const pwdForm = useForm();
  const [pwdMessage, setPwdMessage] = useState(null);
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      reset({ nom: profile.nom, prenom: profile.prenom, telephone: profile.telephone || '', niveau: profile.niveau || '', typeBac: profile.typeBac || '', paysBac: profile.paysBac || '', classe: profile.classe || '', adresse: profile.adresse || '', parentNom: profile.parentNom || '', parentTelephone: profile.parentTelephone || '' });
      setPaysSelectionne(profile.paysBac && !PAYS_BAC_OPTIONS.slice(0, 2).includes(profile.paysBac) ? 'Autre' : (profile.paysBac || ''));
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
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>Mon profil</Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4, mb: 3 }}>
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>Profil mis à jour avec succès.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" {...register('nom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" {...register('prenom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" {...register('telephone')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={profile?.email || ''} disabled helperText="Non modifiable" /></Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="niveau"
              control={control}
              render={({ field }) => <NiveauSelect {...field} />}
            />
          </Grid>

          {niveauChoisi === 'BACCALAUREAT' && (
            <Grid item xs={12}>
              <Box sx={{ p: 2.5, borderRadius: '12px', backgroundColor: 'rgba(239,246,255,0.5)', border: `1px solid ${COLORS.borderLight}` }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.primaryDark, mb: 1 }}>Type de bac</Typography>
                <Controller
                  name="typeBac"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="TUNISIEN" control={<Radio size="small" />} label="Bac tunisien" />
                      <FormControlLabel value="ETRANGER" control={<Radio size="small" />} label="Bac étranger" />
                    </RadioGroup>
                  )}
                />

                {typeBacChoisi === 'ETRANGER' && (
                  <Controller
                    name="paysBac"
                    control={control}
                    render={({ field }) => (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Pays"
                          value={paysSelectionne}
                          onChange={(e) => {
                            const valeur = e.target.value;
                            setPaysSelectionne(valeur);
                            field.onChange(valeur === 'Autre' ? '' : valeur);
                          }}
                        >
                          {PAYS_BAC_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </TextField>
                        {paysSelectionne === 'Autre' && (
                          <TextField
                            fullWidth
                            size="small"
                            label="Nom du pays"
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        )}
                      </Stack>
                    )}
                  />
                )}
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sm={6}><TextField fullWidth label="Classe" {...register('classe')} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Adresse" {...register('adresse')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nom du parent" {...register('parentNom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone du parent" {...register('parentTelephone')} /></Grid>
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
