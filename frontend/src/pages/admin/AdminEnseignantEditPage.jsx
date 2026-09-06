import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Autocomplete, Box, Button, Chip, FormControlLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import matiereService from '../../services/matiereService';
import enseignantService from '../../services/enseignantService';
import NiveauCheckboxList from '../../components/common/NiveauCheckboxList';
import { PAYS_BAC_OPTIONS } from '../../constants/paysBac';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminEnseignantEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paysSelectionne, setPaysSelectionne] = useState('');

  const { control, register, handleSubmit, watch, reset } = useForm();
  const origineDiplomeChoisie = watch('origineDiplome');
  const niveauxChoisis = watch('niveaux');
  const enseigneLeBac = (niveauxChoisis || []).includes('BACCALAUREAT');

  useEffect(() => {
    Promise.all([enseignantService.getById(id), matiereService.getAll()]).then(([ens, allMatieres]) => {
      setMatieres(allMatieres);
      reset({
        nom: ens.nom, prenom: ens.prenom, telephone: ens.telephone || '', specialite: ens.specialite || '',
        diplome: ens.diplome || '', origineDiplome: ens.origineDiplome || '', paysDiplome: ens.paysDiplome || '',
        experience: ens.experience || '', biographie: ens.biographie || '',
        matieres: ens.matieres || [],
        niveaux: ens.niveaux || [],
      });
      setPaysSelectionne(ens.paysDiplome && !PAYS_BAC_OPTIONS.slice(0, 2).includes(ens.paysDiplome) ? 'Autre' : (ens.paysDiplome || ''));
    }).finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);
    try {
      await enseignantService.update(id, { ...data, matieresIds: data.matieres.map((m) => m.id), niveaux: data.niveaux, experience: data.experience ? Number(data.experience) : undefined });
      navigate(`/admin/enseignants/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>Modifier l'enseignant</Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" {...register('prenom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" {...register('nom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" {...register('telephone')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Spécialité" {...register('specialite')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Diplôme" {...register('diplome')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Expérience (années)" {...register('experience')} /></Grid>

          <Grid item xs={12}>
            <Controller
              name="matieres"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={matieres}
                  getOptionLabel={(m) => m.nom}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  value={field.value || []}
                  onChange={(_, val) => field.onChange(val)}
                  renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option.nom} {...getTagProps({ index })} key={option.id} />)}
                  renderInput={(params) => <TextField {...params} label="Matières enseignées" />}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Biographie" {...register('biographie')} /></Grid>
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
          <Button onClick={() => navigate(`/admin/enseignants/${id}`)} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: COLORS.primary, px: 4 }}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
