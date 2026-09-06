import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Box, Button, Chip, FormControlLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import matiereService from '../../services/matiereService';
import enseignantService from '../../services/enseignantService';
import NiveauCheckboxList from '../../components/common/NiveauCheckboxList';
import { PAYS_BAC_OPTIONS } from '../../constants/paysBac';
import { COLORS } from '../../theme/theme';

export default function AdminEnseignantNewPage() {
  const navigate = useNavigate();
  const [matieres, setMatieres] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paysSelectionne, setPaysSelectionne] = useState('');

  const { control, register, handleSubmit, watch } = useForm({ defaultValues: { matieres: [], niveaux: [] } });
  const origineDiplomeChoisie = watch('origineDiplome');
  const niveauxChoisis = watch('niveaux');
  const enseigneLeBac = (niveauxChoisis || []).includes('BACCALAUREAT');

  useEffect(() => {
    matiereService.getAll().then(setMatieres);
  }, []);

  const onSubmit = async (data) => {
    if (data.matieres.length === 0) {
      setError('Sélectionnez au moins une matière enseignée.');
      return;
    }
    if (data.niveaux.length === 0) {
      setError('Sélectionnez au moins un niveau enseigné.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await enseignantService.create({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motDePasseTemporaire: data.motDePasseTemporaire,
        telephone: data.telephone,
        specialite: data.specialite,
        diplome: data.diplome,
        origineDiplome: data.origineDiplome || undefined,
        paysDiplome: data.origineDiplome === 'ETRANGER' ? data.paysDiplome : undefined,
        experience: data.experience ? Number(data.experience) : undefined,
        biographie: data.biographie,
        matieresIds: data.matieres.map((m) => m.id),
        niveaux: data.niveaux,
      });
      navigate('/admin/enseignants');
    } catch (err) {
      if (err.response?.status === 409) setError('Un compte existe déjà avec cet email.');
      else setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 1 }}>Ajouter un enseignant</Typography>
      <Typography sx={{ fontFamily: 'Inter', color: COLORS.textBody, mb: 3 }}>Remplissez les informations pour créer un nouveau compte professeur.</Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><TextField fullWidth required label="Prénom" placeholder="Ex: Mohamed" {...register('prenom', { required: true })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth required label="Nom" placeholder="Ex: Trabelsi" {...register('nom', { required: true })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth required type="email" label="Email professionnel" placeholder="m.trabelsi@edu.tn" {...register('email', { required: true })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" placeholder="+216 22 123 456" {...register('telephone')} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="text"
              label="Mot de passe temporaire"
              helperText="Min. 8 caractères, une majuscule, un chiffre — l'enseignant devra le changer à sa première connexion"
              {...register('motDePasseTemporaire', { required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Spécialité principale" {...register('specialite')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Diplôme" {...register('diplome')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Années d'expérience" {...register('experience')} /></Grid>

          <Grid item xs={12}>
            <Controller
              name="matieres"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={matieres}
                  getOptionLabel={(m) => m.nom}
                  value={field.value}
                  onChange={(_, val) => field.onChange(val)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip label={option.nom} {...getTagProps({ index })} key={option.id} />)
                  }
                  renderInput={(params) => <TextField {...params} label="Matières enseignées" placeholder="Ajouter une matière" />}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Biographie & parcours académique" {...register('biographie')} />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="niveaux"
              control={control}
              render={({ field }) => <NiveauCheckboxList {...field} />}
            />
          </Grid>

          {enseigneLeBac && (
            <Grid item xs={12}>
              <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: 'rgba(239,246,255,0.5)', border: `1px solid ${COLORS.borderLight}` }}>
                <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 1.5 }}>
                  Origine du diplôme (optionnel)
                </Typography>
                <Controller
                  name="origineDiplome"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="TUNISIEN" control={<Radio />} label="Tunisien" />
                      <FormControlLabel value="ETRANGER" control={<Radio />} label="Étranger" />
                    </RadioGroup>
                  )}
                />

                {origineDiplomeChoisie === 'ETRANGER' && (
                  <Controller
                    name="paysDiplome"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                          select
                          fullWidth
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
                          <TextField fullWidth label="Nom du pays" value={field.value || ''} onChange={field.onChange} />
                        )}
                      </Stack>
                    )}
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
          <Button onClick={() => navigate('/admin/enseignants')} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: COLORS.primary, px: 4 }}>
            {submitting ? 'Enregistrement…' : "Enregistrer l'enseignant"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
