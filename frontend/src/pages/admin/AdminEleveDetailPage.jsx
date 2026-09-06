import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  Alert, Box, Button, Chip, FormControlLabel, Grid, IconButton, MenuItem, Paper, Radio, RadioGroup, Stack, Switch, TextField,
  ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import eleveService from '../../services/eleveService';
import matiereService from '../../services/matiereService';
import enseignantService from '../../services/enseignantService';
import affectationService from '../../services/affectationService';
import NiveauSelect from '../../components/common/NiveauSelect';
import { PAYS_BAC_OPTIONS } from '../../constants/paysBac';
import { LoadingState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminEleveDetailPage() {
  const { id } = useParams();
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [toutesMatieres, setToutesMatieres] = useState([]);
  const [enseignantsParMatiere, setEnseignantsParMatiere] = useState({}); // { [matiereId]: EnseignantResponse[] }
  const [selectionReaffectation, setSelectionReaffectation] = useState({}); // { [affectationId]: enseignantId }
  const [messageMatieres, setMessageMatieres] = useState(null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouvelleMatiereId, setNouvelleMatiereId] = useState('');
  const [nouvelEnseignantId, setNouvelEnseignantId] = useState('');
  const [nouveauTypeCours, setNouveauTypeCours] = useState('GROUPE');
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  const { register, handleSubmit, control, watch, reset } = useForm();
  const niveauChoisi = watch('niveau');
  const typeBacChoisi = watch('typeBac');
  const [paysSelectionne, setPaysSelectionne] = useState('');

  const charger = () => {
    Promise.all([eleveService.getById(id), matiereService.getAll()]).then(async ([e, mats]) => {
      setEleve(e);
      setToutesMatieres(mats);
      reset({ nom: e.nom, prenom: e.prenom, telephone: e.telephone || '', niveau: e.niveau || '', typeBac: e.typeBac || '', paysBac: e.paysBac || '', classe: e.classe || '', adresse: e.adresse || '', parentNom: e.parentNom || '', parentTelephone: e.parentTelephone || '' });
      setPaysSelectionne(e.paysBac && !PAYS_BAC_OPTIONS.slice(0, 2).includes(e.paysBac) ? 'Autre' : (e.paysBac || ''));

      const paires = await Promise.all(
        (e.affectations || []).map(async (a) => [a.matiereId, await enseignantService.getAll(a.matiereId)])
      );
      setEnseignantsParMatiere((prev) => ({ ...prev, ...Object.fromEntries(paires) }));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, [id]);

  const onSubmit = async (data) => {
    setSaving(true);
    setSuccess(false);
    try {
      await eleveService.update(id, data);
      setSuccess(true);
      charger();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    await eleveService.toggleActivation(id, !eleve.enabled);
    charger();
  };

  const handleChangerEnseignant = async (affectationId) => {
    const enseignantId = selectionReaffectation[affectationId];
    if (!enseignantId) return;
    setMessageMatieres(null);
    try {
      await affectationService.affecter(affectationId, enseignantId);
      setMessageMatieres({ type: 'success', text: 'Enseignant mis à jour.' });
      charger();
    } catch (err) {
      setMessageMatieres({ type: 'error', text: err.response?.data?.message || "Cet enseignant n'est pas habilité pour cette matière." });
    }
  };

  const handleSupprimerAffectation = async (affectationId) => {
    setMessageMatieres(null);
    try {
      await affectationService.supprimer(affectationId);
      setMessageMatieres({ type: 'success', text: 'Matière retirée.' });
      charger();
    } catch (err) {
      setMessageMatieres({ type: 'error', text: err.response?.data?.message || 'Suppression impossible.' });
    }
  };

  const handleChoixNouvelleMatiere = async (matiereId) => {
    setNouvelleMatiereId(matiereId);
    setNouvelEnseignantId('');
    if (matiereId && !enseignantsParMatiere[matiereId]) {
      const liste = await enseignantService.getAll(matiereId);
      setEnseignantsParMatiere((prev) => ({ ...prev, [matiereId]: liste }));
    }
  };

  const handleAjouterMatiere = async () => {
    if (!nouvelleMatiereId) return;
    setAjoutEnCours(true);
    setMessageMatieres(null);
    try {
      await affectationService.creer({
        eleveId: Number(id),
        matiereId: nouvelleMatiereId,
        enseignantId: nouvelEnseignantId || undefined,
        typeCours: nouveauTypeCours,
      });
      setMessageMatieres({ type: 'success', text: 'Matière ajoutée.' });
      setAjoutOuvert(false);
      setNouvelleMatiereId('');
      setNouvelEnseignantId('');
      setNouveauTypeCours('GROUPE');
      charger();
    } catch (err) {
      setMessageMatieres({ type: 'error', text: err.response?.data?.message || "Impossible d'ajouter cette matière." });
    } finally {
      setAjoutEnCours(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!eleve) return null;

  const matieresDejaAffectees = new Set((eleve.affectations || []).map((a) => a.matiereId));
  const matieresDisponibles = toutesMatieres.filter((m) => !matieresDejaAffectees.has(m.id));

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>{eleve.prenom} {eleve.nom}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={eleve.valide ? 'Validé' : 'En attente'} sx={{ backgroundColor: eleve.valide ? '#DCFCE7' : '#FEF3C7', color: eleve.valide ? '#166534' : '#92400E', fontWeight: 700 }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: 13 }}>Actif</Typography>
          <Switch checked={eleve.enabled} onChange={handleToggle} />
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700 }}>Matières</Typography>
          {!ajoutOuvert && matieresDisponibles.length > 0 && (
            <Button size="small" startIcon={<AddIcon />} onClick={() => setAjoutOuvert(true)} sx={{ color: COLORS.primary, fontWeight: 700 }}>
              Ajouter une matière
            </Button>
          )}
        </Stack>

        {messageMatieres && <Alert severity={messageMatieres.type} sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setMessageMatieres(null)}>{messageMatieres.text}</Alert>}

        <Stack spacing={1.5}>
          {(eleve.affectations || []).map((a) => (
            <Box key={a.id} sx={{ p: 2, borderRadius: '12px', border: '1px solid #F3F4F6' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15 }}>{a.matiereNom}</Typography>
                  {a.statut === 'AFFECTEE' ? (
                    <Chip size="small" icon={<CheckCircleIcon />} label={a.enseignantNomComplet} sx={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 700, mt: 0.5 }} />
                  ) : (
                    <Chip size="small" label="Aucun enseignant" sx={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700, mt: 0.5 }} />
                  )}
                </Box>
                <IconButton size="small" onClick={() => handleSupprimerAffectation(a.id)} title="Retirer cette matière">
                  <DeleteOutlineIcon fontSize="small" sx={{ color: '#EF4444' }} />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label={a.statut === 'AFFECTEE' ? "Changer d'enseignant" : 'Choisir un enseignant'}
                  value={selectionReaffectation[a.id] || ''}
                  onChange={(e) => setSelectionReaffectation((prev) => ({ ...prev, [a.id]: e.target.value }))}
                  helperText={(enseignantsParMatiere[a.matiereId]?.length ?? 0) === 0 ? 'Aucun enseignant habilité pour cette matière' : ''}
                >
                  {(enseignantsParMatiere[a.matiereId] || []).map((ens) => (
                    <MenuItem key={ens.id} value={ens.id}>{ens.prenom} {ens.nom}</MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="outlined"
                  disabled={!selectionReaffectation[a.id]}
                  onClick={() => handleChangerEnseignant(a.id)}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Confirmer
                </Button>
              </Stack>
            </Box>
          ))}

          {(eleve.affectations || []).length === 0 && !ajoutOuvert && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody, fontStyle: 'italic' }}>
              Aucune matière pour cet élève.
            </Typography>
          )}

          {ajoutOuvert && (
            <Box sx={{ p: 2, borderRadius: '12px', border: `1px solid ${COLORS.primary}`, backgroundColor: 'rgba(239,246,255,0.5)' }}>
              <Stack spacing={1.5}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Matière"
                  value={nouvelleMatiereId}
                  onChange={(e) => handleChoixNouvelleMatiere(e.target.value)}
                >
                  {matieresDisponibles.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>
                  ))}
                </TextField>

                {nouvelleMatiereId && (
                  <>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Enseignant (optionnel)"
                      value={nouvelEnseignantId}
                      onChange={(e) => setNouvelEnseignantId(e.target.value)}
                      helperText={(enseignantsParMatiere[nouvelleMatiereId]?.length ?? 0) === 0 ? 'Aucun enseignant habilité — la matière restera en attente' : 'Laissez vide pour affecter plus tard'}
                    >
                      <MenuItem value="">— Non affecté pour l'instant —</MenuItem>
                      {(enseignantsParMatiere[nouvelleMatiereId] || []).map((ens) => (
                        <MenuItem key={ens.id} value={ens.id}>{ens.prenom} {ens.nom}</MenuItem>
                      ))}
                    </TextField>

                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={nouveauTypeCours}
                      onChange={(_, val) => val && setNouveauTypeCours(val)}
                    >
                      <ToggleButton value="GROUPE">Groupe</ToggleButton>
                      <ToggleButton value="INDIVIDUEL">Individuel</ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}

                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                  <Button onClick={() => { setAjoutOuvert(false); setNouvelleMatiereId(''); }} sx={{ color: '#64748B' }}>Annuler</Button>
                  <Button
                    variant="contained"
                    disabled={!nouvelleMatiereId || ajoutEnCours}
                    onClick={handleAjouterMatiere}
                    sx={{ backgroundColor: COLORS.primary }}
                  >
                    {ajoutEnCours ? 'Ajout…' : 'Ajouter'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 4 }}>
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>Modifications enregistrées.</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" {...register('nom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" {...register('prenom')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" {...register('telephone')} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={eleve.email} disabled /></Grid>
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
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: COLORS.primary, px: 4 }}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
