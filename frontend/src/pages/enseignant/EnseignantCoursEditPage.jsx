import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useProfile } from '../../context/ProfileContext';
import coursService from '../../services/coursService';
import FileUploadZone from '../../components/upload/FileUploadZone';
import MultiPdfUploadZone from '../../components/upload/MultiPdfUploadZone';
import CiblageCoursFields from '../../components/enseignant/CiblageCoursFields';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function EnseignantCoursEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const matieres = profile?.matieres || [];
  const [coursLoading, setCoursLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nouveauVideo, setNouveauVideo] = useState(null);
  const [pdfsExistants, setPdfsExistants] = useState([]);
  const [nouveauxPdfs, setNouveauxPdfs] = useState([]);
  const [nouveauPpt, setNouveauPpt] = useState(null);




  const [ciblageInitial, setCiblageInitial] = useState(null);
  const loading = profileLoading || coursLoading;

  const { control, register, handleSubmit, watch, setValue, reset } = useForm({ defaultValues: { matiereId: '' } });
  const matiereIdChoisie = watch('matiereId');
  const typeCoursChoisi = watch('typeCours');

  useEffect(() => {
    coursService.getById(id)
      .then((c) => {
        setPdfsExistants(c.pdfs || []);
        setCiblageInitial({
          cibleType: c.cibleType || 'NIVEAU',
          cibleNiveau: c.cibleType === 'NIVEAU' ? (c.niveau || '') : '',
          eleveIds: c.eleveIdsCibles || [],
        });
        reset({
          titre: c.titre,
          description: c.description,
          matiereId: c.matiereId,
          typeCours: c.typeCours || 'GROUPE',
          datePublication: c.datePublication,
          cibleType: c.cibleType || 'NIVEAU',
          cibleNiveau: c.cibleType === 'NIVEAU' ? (c.niveau || '') : '',
          eleveIds: c.eleveIdsCibles || [],
        });
      })
      .catch(() => setError('Impossible de charger ce cours.'))
      .finally(() => setCoursLoading(false));
  }, [id, reset]);

  const handleSupprimerPdfExistant = async (pdfId) => {
    try {
      await coursService.supprimerPdf(id, pdfId);
      setPdfsExistants((prev) => prev.filter((p) => p.id !== pdfId));
    } catch {
      setError('Impossible de supprimer ce PDF.');
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);
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
      await coursService.update(id, payload);
      if (nouveauVideo) await coursService.updateVideo(id, nouveauVideo);

      for (const pdf of nouveauxPdfs) {
        await coursService.ajouterPdf(id, pdf);
      }
      if (nouveauPpt) await coursService.updatePpt(id, nouveauPpt);
      navigate(`/enseignant/cours/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 3 }}>
        Modifier le cours
      </Typography>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Titre" {...register('titre')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" {...register('description')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="matiereId"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Matière">
                  {matieres.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Date de publication" InputLabelProps={{ shrink: true }} {...register('datePublication')} />
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

          {ciblageInitial && (
            <Grid item xs={12}>
              <CiblageCoursFields
                control={control}
                setValue={setValue}
                matiereId={matiereIdChoisie}
                typeCours={typeCoursChoisi}
                defaultCibleType={ciblageInitial.cibleType}
                defaultNiveau={ciblageInitial.cibleNiveau}
                defaultEleveIds={ciblageInitial.eleveIds}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: COLORS.footerBackground, mb: 1 }}>
              Remplacer un fichier (optionnel — laissez vide pour conserver l'actuel)
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FileUploadZone label="Nouvelle vidéo (optionnel)" accept=".mp4" file={nouveauVideo} onChange={setNouveauVideo} />
          </Grid>

          {pdfsExistants.length > 0 && (
            <Grid item xs={12}>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', mb: 1 }}>
                PDF déjà associés à ce cours
              </Typography>
              <Stack spacing={1}>
                {pdfsExistants.map((pdf) => (
                  <Stack key={pdf.id} direction="row" alignItems="center" justifyContent="space-between"
                         sx={{ p: 1.5, borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #F1F5F9' }}>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: 13 }}>{pdf.nomFichier}</Typography>
                    <Button size="small" color="error" onClick={() => handleSupprimerPdfExistant(pdf.id)}>Retirer</Button>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          )}
          <Grid item xs={12}>
            <MultiPdfUploadZone label="Ajouter de nouveaux PDF (optionnel)" files={nouveauxPdfs} onChange={setNouveauxPdfs} />
          </Grid>
          <Grid item xs={12}>
            <FileUploadZone label="Nouvelle présentation PPT" accept=".ppt,.pptx" file={nouveauPpt} onChange={setNouveauPpt} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
          <Button onClick={() => navigate(`/enseignant/cours/${id}`)} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: COLORS.primary, px: 4 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
