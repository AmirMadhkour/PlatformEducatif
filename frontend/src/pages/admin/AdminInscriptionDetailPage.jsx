import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import eleveService from '../../services/eleveService';
import affectationService from '../../services/affectationService';
import enseignantService from '../../services/enseignantService';
import { LoadingState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function AdminInscriptionDetailPage() {
  const { libelle } = useNiveauLabels();
  const { id } = useParams();
  const navigate = useNavigate();
  const [eleve, setEleve] = useState(null);
  const [enseignantsParMatiere, setEnseignantsParMatiere] = useState({});
  const [selection, setSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [validating, setValidating] = useState(false);

  const charger = () => {
    eleveService.getById(id).then(async (e) => {
      setEleve(e);
      const paires = await Promise.all(
        (e.affectations || []).map(async (a) => [a.matiereId, await enseignantService.getAll(a.matiereId)])
      );
      setEnseignantsParMatiere(Object.fromEntries(paires));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, [id]);

  const handleAffecter = async (affectationId) => {
    const enseignantId = selection[affectationId];
    if (!enseignantId) return;
    setMessage(null);
    try {
      await affectationService.affecter(affectationId, enseignantId);
      setMessage({ type: 'success', text: 'Enseignant affecté.' });
      setLoading(true);
      charger();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Cet enseignant n'est pas habilité pour cette matière." });
    }
  };

  const handleValider = async () => {
    setValidating(true);
    setMessage(null);
    try {
      await eleveService.valider(id);
      navigate('/admin/inscriptions');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Validation impossible : toutes les matières doivent avoir un enseignant.' });
    } finally {
      setValidating(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!eleve) return null;

  const toutesAffectees = eleve.affectations?.every((a) => a.statut === 'AFFECTEE');

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 1 }}>
        {eleve.prenom} {eleve.nom}
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', color: COLORS.textBody, mb: 3 }}>
        {eleve.niveau ? libelle(eleve.niveau) : ''} · {eleve.email}{eleve.telephone ? ` · ${eleve.telephone}` : ''}
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 3, borderRadius: '12px' }}>{message.text}</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, mb: 2 }}>Matières demandées</Typography>
        <Stack spacing={2}>
          {eleve.affectations?.map((a) => (
            <Box key={a.id} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #F3F4F6' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: a.statut === 'EN_ATTENTE' ? 2 : 0 }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700 }}>{a.matiereNom}</Typography>
                {a.statut === 'AFFECTEE' ? (
                  <Chip icon={<CheckCircleIcon />} label={`Affectée — ${a.enseignantNomComplet}`} sx={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 700 }} />
                ) : (
                  <Chip label="En attente" sx={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
                )}
              </Stack>

              {a.statut === 'EN_ATTENTE' && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Choisir un enseignant"
                    value={selection[a.id] || ''}
                    onChange={(e) => setSelection((prev) => ({ ...prev, [a.id]: e.target.value }))}
                    helperText={(enseignantsParMatiere[a.matiereId]?.length ?? 0) === 0 ? 'Aucun enseignant habilité pour cette matière' : ''}
                  >
                    {(enseignantsParMatiere[a.matiereId] || []).map((ens) => (
                      <MenuItem key={ens.id} value={ens.id}>{ens.prenom} {ens.nom}</MenuItem>
                    ))}
                  </TextField>
                  <Button variant="contained" disabled={!selection[a.id]} onClick={() => handleAffecter(a.id)} sx={{ backgroundColor: COLORS.primary, whiteSpace: 'nowrap' }}>
                    Confirmer
                  </Button>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        disabled={!toutesAffectees || validating}
        onClick={handleValider}
        sx={{ backgroundColor: COLORS.primary, py: 1.5 }}
      >
        {validating ? 'Validation…' : toutesAffectees ? "Valider l'inscription" : 'Affectez toutes les matières avant de valider'}
      </Button>
    </Box>
  );
}
