import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useProfile } from '../../context/ProfileContext';
import coursService from '../../services/coursService';
import FileUploadZone from '../../components/upload/FileUploadZone';
import MultiPdfUploadZone from '../../components/upload/MultiPdfUploadZone';
import CiblageCoursFields from '../../components/enseignant/CiblageCoursFields';
import { COLORS } from '../../theme/theme';

const schema = yup.object({
  titre: yup.string().required('Le titre est obligatoire'),
  description: yup.string().required('La description est obligatoire'),
  matiereId: yup.number().required('La matière est obligatoire'),
  typeCours: yup.string().required(),
  datePublication: yup.string().required('La date de publication est obligatoire'),
  cibleType: yup.string().required(),
});

export default function EnseignantCoursNewPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const matieres = profile?.matieres || [];
  const [video, setVideo] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [ppt, setPpt] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { matiereId: '', typeCours: 'GROUPE', datePublication: new Date().toISOString().slice(0, 10), cibleType: 'NIVEAU' },
  });

  const matiereIdChoisie = watch('matiereId');
  const typeCoursChoisi = watch('typeCours');

  const onSubmit = async (data) => {
    setError(null);


    if (data.cibleType === 'NIVEAU' && !data.cibleNiveau) {
      setError('Choisissez un niveau pour ce cours.');
      return;
    }
    if (data.cibleType === 'ELEVES' && (!data.eleveIds || data.eleveIds.length === 0)) {
      setError('Sélectionnez au moins un élève pour ce cours.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        titre: data.titre,
        description: data.description,
        matiereId: data.matiereId,
        typeCours: data.typeCours,
        datePublication: data.datePublication,
        cibleType: data.cibleType,
        niveau: data.cibleType === 'NIVEAU' ? data.cibleNiveau : undefined,
        eleveIds: data.cibleType === 'ELEVES' ? data.eleveIds : undefined,
      };
      await coursService.create(payload, video, pdfs, ppt);
      navigate('/enseignant/cours');
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response?.data?.message || "Vous n'êtes pas habilité à enseigner cette matière, ou ce ciblage n'est pas autorisé.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue lors de la création du cours.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>
        Ajouter un cours
      </Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Titre" error={!!errors.titre} helperText={errors.titre?.message} {...register('titre')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" error={!!errors.description} helperText={errors.description?.message} {...register('description')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="matiereId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Matière" error={!!errors.matiereId} helperText={errors.matiereId?.message || (matieres.length === 0 && 'Aucune matière associée à votre profil')}>
                  {matieres.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Date de publication" InputLabelProps={{ shrink: true }} error={!!errors.datePublication} {...register('datePublication')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="typeCours"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup exclusive fullWidth value={field.value} onChange={(_, v) => v && field.onChange(v)} sx={{ height: 56 }}>
                  <ToggleButton value="GROUPE">Groupe</ToggleButton>
                  <ToggleButton value="INDIVIDUEL">Individuel</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <CiblageCoursFields control={control} setValue={setValue} matiereId={matiereIdChoisie} typeCours={typeCoursChoisi} />
          </Grid>

          <Grid item xs={12}>
            <FileUploadZone label="Vidéo (optionnel)" accept=".mp4" maxSizeLabel="500 Mo max, optionnel" file={video} onChange={setVideo} />
          </Grid>
          <Grid item xs={12}>
            <MultiPdfUploadZone label="Documents PDF (optionnel, plusieurs possibles)" files={pdfs} onChange={setPdfs} />
          </Grid>
          <Grid item xs={12}>
            <FileUploadZone label="Présentation PPT (optionnel)" accept=".ppt,.pptx" maxSizeLabel="500 Mo max, optionnel" file={ppt} onChange={setPpt} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
          <Button onClick={() => navigate('/enseignant/cours')} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: COLORS.primary, px: 4 }}>
            {submitting ? 'Envoi en cours…' : 'Publier le cours'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
