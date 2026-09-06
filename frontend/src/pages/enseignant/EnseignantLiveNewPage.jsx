import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { useProfile } from '../../context/ProfileContext';
import coursEnLigneService from '../../services/coursEnLigneService';
import CiblageCoursFields from '../../components/enseignant/CiblageCoursFields';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

const DUREES = [
  { valeur: 30, label: '30 min' },
  { valeur: 45, label: '45 min' },
  { valeur: 60, label: '1h' },
  { valeur: 90, label: '1h30' },
  { valeur: 120, label: '2h' },
];


function ajouterMinutes(heureDebut, minutesAAjouter) {
  const [h, m] = heureDebut.split(':').map(Number);
  const totalMinutes = (h * 60 + m + minutesAAjouter) % (24 * 60);
  const heureFin = Math.floor(totalMinutes / 60);
  const minuteFin = totalMinutes % 60;
  return `${String(heureFin).padStart(2, '0')}:${String(minuteFin).padStart(2, '0')}`;
}

export default function EnseignantLiveNewPage() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const matieres = profile?.matieres || [];
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [coursCree, setCoursCree] = useState(null);

  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { duree: 60, cibleType: 'NIVEAU' } });
  const matiereIdChoisie = watch('matiereId');

  const onSubmit = async (data) => {
    setError(null);
    if (data.cibleType === 'NIVEAU' && !data.cibleNiveau) {
      setError('Choisissez un niveau pour ce cours en ligne.');
      return;
    }
    if (data.cibleType === 'ELEVES' && (!data.eleveIds || data.eleveIds.length === 0)) {
      setError('Sélectionnez au moins un élève pour ce cours en ligne.');
      return;
    }
    setSubmitting(true);
    try {
      const cours = await coursEnLigneService.creer({
        titre: data.titre,
        description: data.description,
        matiereId: data.matiereId,
        dateCours: data.dateCours,
        heureDebut: data.heureDebut,
        heureFin: ajouterMinutes(data.heureDebut, Number(data.duree)),
        cibleType: data.cibleType,
        cibleNiveau: data.cibleType === 'NIVEAU' ? data.cibleNiveau : undefined,
        eleveIds: data.cibleType === 'ELEVES' ? data.eleveIds : undefined,
      });
      setCoursCree(cours);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de créer le cours en ligne. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) return <LoadingState />;

  if (coursCree) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
          <Stack alignItems="center" textAlign="center" spacing={1} sx={{ mb: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#10B981' }} />
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: COLORS.footerBackground }}>
              Cours créé avec succès
            </Typography>
          </Stack>

          <Stack spacing={1} sx={{ p: 2.5, borderRadius: '12px', backgroundColor: COLORS.background, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, color: COLORS.footerBackground }}>{coursCree.titre}</Typography>
              <Chip size="small" label={coursCree.matiereNom} />
            </Stack>
            <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textBody }}>
              {new Date(coursCree.dateCours + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}{coursCree.heureDebut?.slice(0, 5)} - {coursCree.heureFin?.slice(0, 5)}
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Button
              fullWidth
              startIcon={<VideoCameraFrontIcon />}
              onClick={() => window.open(coursCree.zoomLink, '_blank', 'noopener,noreferrer')}
              sx={{ backgroundColor: COLORS.primary, color: 'white', '&:hover': { backgroundColor: COLORS.primaryDark } }}
            >
              Rejoindre le cours (Zoom)
            </Button>
            <Button fullWidth variant="text" onClick={() => navigate('/enseignant/lives')} sx={{ color: COLORS.textBody }}>
              Retour à mes cours en ligne
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>
        Créer un cours en ligne
      </Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="matiereId"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Matière *" error={!!errors.matiereId} helperText={matieres.length === 0 && 'Aucune matière associée à votre profil'}>
                  {matieres.map((m) => <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>)}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Titre du cours *" placeholder="Ex: Algèbre" error={!!errors.titre} {...register('titre', { required: true })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={2} label="Description" {...register('description')} />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              Le lien Zoom sera généré automatiquement à la création de ce cours.
            </Alert>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="date" label="Date *" InputLabelProps={{ shrink: true }} error={!!errors.dateCours} {...register('dateCours', { required: true })} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth type="time" label="Heure de début *" InputLabelProps={{ shrink: true }} error={!!errors.heureDebut} {...register('heureDebut', { required: true })} />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Controller
              name="duree"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Durée *">
                  {DUREES.map((d) => <MenuItem key={d.valeur} value={d.valeur}>{d.label}</MenuItem>)}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CiblageCoursFields control={control} matiereId={matiereIdChoisie} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
          <Button onClick={() => navigate('/enseignant/lives')} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: COLORS.primary, px: 4 }}>
            {submitting ? 'Création…' : 'Créer le cours en ligne'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
