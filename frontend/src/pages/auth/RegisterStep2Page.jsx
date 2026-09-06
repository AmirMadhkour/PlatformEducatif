import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, Paper, Radio, RadioGroup, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';
import RegisterStepper from '../../components/auth/RegisterStepper';
import RegisterHelpAside from '../../components/auth/RegisterHelpAside';
import { useRegister } from '../../context/RegisterContext';
import matiereService from '../../services/matiereService';
import NiveauSelect from '../../components/common/NiveauSelect';
import { PAYS_BAC_OPTIONS } from '../../constants/paysBac';
import { COLORS } from '../../theme/theme';

export default function RegisterStep2Page() {
  const navigate = useNavigate();
  const { etape1Complete, niveau, setNiveau, typeBac, setTypeBac, paysBac, setPaysBac, matieresSouhaitees, toggleMatiere, setTypeCoursPourMatiere } = useRegister();
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [paysSelectionne, setPaysSelectionne] = useState(() => (paysBac && !PAYS_BAC_OPTIONS.slice(0, 2).includes(paysBac) ? 'Autre' : paysBac));

  const handleChangerPaysSelectionne = (valeur) => {
    setPaysSelectionne(valeur);
    setPaysBac(valeur === 'Autre' ? '' : valeur);
  };


  useEffect(() => {
    if (!etape1Complete) {
      navigate('/register', { replace: true });
    }
  }, [etape1Complete, navigate]);

  useEffect(() => {
    matiereService
      .getAll()
      .then(setMatieres)
      .catch(() => setError('Impossible de charger la liste des matières. Le serveur backend est-il démarré ?'))
      .finally(() => setLoading(false));
  }, []);

  const estSelectionnee = (id) => matieresSouhaitees.some((m) => m.matiereId === id);
  const typeCoursDe = (id) => matieresSouhaitees.find((m) => m.matiereId === id)?.typeCours ?? 'GROUPE';

  const handleSuivant = () => {
    if (!niveau) {
      setError('Sélectionnez votre niveau scolaire avant de continuer.');
      return;
    }
    if (niveau === 'BACCALAUREAT' && !typeBac) {
      setError('Précisez si vous préparez un bac tunisien ou étranger.');
      return;
    }
    if (niveau === 'BACCALAUREAT' && typeBac === 'ETRANGER' && !paysBac) {
      setError('Indiquez le pays du baccalauréat étranger.');
      return;
    }
    if (matieresSouhaitees.length === 0) {
      setError('Sélectionnez au moins une matière avant de continuer.');
      return;
    }
    navigate('/register/recapitulatif');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.background, display: 'flex', flexDirection: 'column' }}>
      <AuthNavbar rightLabel="Déjà un compte ?" rightLinkText="Se connecter" rightLinkTo="/login" />

      <Box sx={{ flex: 1, py: 8, px: 3 }}>
        <RegisterStepper currentStep={2} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} sx={{ maxWidth: 1024, mx: 'auto' }}>
          <Paper elevation={0} sx={{ flex: 1, borderRadius: '24px', border: `1px solid ${COLORS.borderLight}`, boxShadow: '0px 10px 40px -10px rgba(21,101,192,0.08)', overflow: 'hidden' }}>
            <Box sx={{ p: 4, borderBottom: '1px solid #F9FAFB' }}>
              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 24, mb: 0.5 }}>Votre parcours scolaire</Typography>
              <Typography sx={{ color: COLORS.textBody, fontSize: 16 }}>
                Dites-nous ce que vous souhaitez apprendre pour personnaliser votre expérience.
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {error && <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 2 }}>
                Niveau d'étude *
              </Typography>
              <Box sx={{ mb: 4 }}>
                <NiveauSelect value={niveau} onChange={setNiveau} label="" />
              </Box>

              {niveau === 'BACCALAUREAT' && (
                <Box sx={{ mb: 4, p: 3, borderRadius: '16px', backgroundColor: 'rgba(239,246,255,0.5)', border: `1px solid ${COLORS.borderLight}` }}>
                  <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 1.5 }}>
                    Type de bac *
                  </Typography>
                  <RadioGroup row value={typeBac} onChange={(e) => setTypeBac(e.target.value)}>
                    <FormControlLabel value="TUNISIEN" control={<Radio />} label="Bac tunisien" />
                    <FormControlLabel value="ETRANGER" control={<Radio />} label="Bac étranger" />
                  </RadioGroup>

                  {typeBac === 'ETRANGER' && (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        select
                        fullWidth
                        label="Pays"
                        value={paysSelectionne}
                        onChange={(e) => handleChangerPaysSelectionne(e.target.value)}
                      >
                        {PAYS_BAC_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                      </TextField>

                      {paysSelectionne === 'Autre' && (
                        <TextField
                          fullWidth
                          label="Nom du pays"
                          value={paysBac}
                          onChange={(e) => setPaysBac(e.target.value)}
                        />
                      )}
                    </Stack>
                  )}
                </Box>
              )}

              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 2 }}>
                Matières souhaitées
              </Typography>

              {loading ? (
                <Stack alignItems="center" py={4}><CircularProgress size={28} /></Stack>
              ) : matieres.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>Aucune matière disponible pour le moment.</Alert>
              ) : (
                <Stack spacing={2}>
                  {matieres.map((matiere) => {
                    const selectionnee = estSelectionnee(matiere.id);
                    return (
                      <Box
                        key={matiere.id}
                        sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, borderRadius: '16px',
                          border: `1px solid ${selectionnee ? 'rgba(21,101,192,0.2)' : COLORS.borderLight}`,
                          backgroundColor: selectionnee ? 'rgba(239,246,255,0.5)' : 'white',
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: 'pointer', flex: 1 }} onClick={() => toggleMatiere(matiere.id)}>
                          <Checkbox checked={selectionnee} sx={{ p: 0 }} />
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 16 }}>{matiere.nom}</Typography>
                            {matiere.description && (
                              <Typography sx={{ fontSize: 12, color: COLORS.textBody }}>{matiere.description}</Typography>
                            )}
                          </Box>
                        </Stack>

                        <ToggleButtonGroup
                          size="small"
                          exclusive
                          disabled={!selectionnee}
                          value={typeCoursDe(matiere.id)}
                          onChange={(_, val) => val && setTypeCoursPourMatiere(matiere.id, val)}
                          sx={{ backgroundColor: 'white', border: `1px solid ${COLORS.borderLight}`, borderRadius: '8px', p: 0.5 }}
                        >
                          <ToggleButton
                            value="GROUPE"
                            sx={{
                              px: 2, py: 0.5, border: 'none', borderRadius: '6px !important', fontSize: 12, fontWeight: 700, textTransform: 'none',
                              color: typeCoursDe(matiere.id) === 'GROUPE' && selectionnee ? 'white' : COLORS.textBody,
                              backgroundColor: typeCoursDe(matiere.id) === 'GROUPE' && selectionnee ? `${COLORS.primary} !important` : 'transparent',
                            }}
                          >
                            Groupe
                          </ToggleButton>
                          <ToggleButton
                            value="INDIVIDUEL"
                            sx={{
                              px: 2, py: 0.5, border: 'none', borderRadius: '6px !important', fontSize: 12, fontWeight: 700, textTransform: 'none',
                              color: typeCoursDe(matiere.id) === 'INDIVIDUEL' && selectionnee ? 'white' : COLORS.textBody,
                              backgroundColor: typeCoursDe(matiere.id) === 'INDIVIDUEL' && selectionnee ? `${COLORS.primary} !important` : 'transparent',
                            }}
                          >
                            Individuel
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ p: 4, backgroundColor: COLORS.background, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/register')} sx={{ borderColor: COLORS.borderDefault, borderWidth: 2, color: COLORS.textBody, px: 4 }}>
                Précédent
              </Button>
              <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleSuivant} sx={{ backgroundColor: COLORS.primary, px: 5 }}>
                Suivant
              </Button>
            </Stack>
          </Paper>

          <RegisterHelpAside />
        </Stack>
      </Box>

      <AuthFooter />
    </Box>
  );
}
