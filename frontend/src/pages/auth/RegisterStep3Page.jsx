import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';
import RegisterStepper from '../../components/auth/RegisterStepper';
import RegisterHelpAside from '../../components/auth/RegisterHelpAside';
import { useRegister } from '../../context/RegisterContext';
import matiereService from '../../services/matiereService';
import authService from '../../services/authService';
import publicService from '../../services/publicService';
import { construireLienWhatsAppInscription, whatsappConfigured } from '../../utils/whatsapp';
import { COLORS } from '../../theme/theme';


export default function RegisterStep3Page() {
  const navigate = useNavigate();
  const { infosPersonnelles, niveau, typeBac, paysBac, matieresSouhaitees, etape1Complete, etape2Complete, reset } = useRegister();
  const [matieres, setMatieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [recapInscription, setRecapInscription] = useState(null);




  useEffect(() => {
    if (!success && (!etape1Complete || !etape2Complete)) {
      navigate('/register', { replace: true });
    }
  }, [success, etape1Complete, etape2Complete, navigate]);

  useEffect(() => {
    matiereService.getAll().then(setMatieres).catch(() => {});
    publicService.getNiveaux().then(setNiveaux).catch(() => {});
  }, []);

  const nomMatiere = (id) => matieres.find((m) => m.id === id)?.nom ?? `Matière #${id}`;

  const handleConfirmer = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await authService.register({
        nom: infosPersonnelles.nom,
        prenom: infosPersonnelles.prenom,
        email: infosPersonnelles.email,
        password: infosPersonnelles.password,
        telephone: infosPersonnelles.telephone,
        niveau,
        typeBac: niveau === 'BACCALAUREAT' ? typeBac : undefined,
        paysBac: niveau === 'BACCALAUREAT' && typeBac === 'ETRANGER' ? paysBac : undefined,
        matieresSouhaitees: matieresSouhaitees.map((m) => ({ matiereId: m.matiereId, typeCours: m.typeCours })),
      });
      setSuccess(true);
      setRecapInscription({
        nom: infosPersonnelles.nom,
        prenom: infosPersonnelles.prenom,
        nomComplet: infosPersonnelles.nomComplet,
        email: infosPersonnelles.email,
        telephone: infosPersonnelles.telephone,
        niveauLibelle: niveaux.find((n) => n.valeur === niveau)?.libelle,
        bacLibelle: niveau === 'BACCALAUREAT'
          ? (typeBac === 'ETRANGER' ? `Bac étranger — ${paysBac}` : 'Bac tunisien')
          : null,
        matieresAvecMode: matieresSouhaitees.map((m) => ({ nom: nomMatiere(m.matiereId), mode: m.typeCours })),
      });
      reset();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Un compte existe déjà avec cet email.');
      } else if (err.response?.data?.validationErrors) {
        const messages = Object.values(err.response.data.validationErrors).join(' ');
        setError(messages);
      } else {
        setError("Une erreur est survenue. Vérifiez que le serveur backend est démarré.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const lienWhatsApp = recapInscription ? construireLienWhatsAppInscription(recapInscription) : null;

    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.background, display: 'flex', flexDirection: 'column' }}>
        <AuthNavbar rightLabel="Déjà un compte ?" rightLinkText="Se connecter" rightLinkTo="/login" />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, py: 6 }}>
          <Paper elevation={0} sx={{ maxWidth: 560, width: '100%', p: 5, borderRadius: '24px', boxShadow: '0px 10px 40px -10px rgba(21,101,192,0.08)' }}>
            <Stack alignItems="center" textAlign="center" spacing={1} sx={{ mb: 3 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 56, color: COLORS.primary }} />
              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 24 }}>
                Inscription enregistrée avec succès
              </Typography>
              {recapInscription && (
                <Typography sx={{ color: COLORS.textBody, fontSize: 16 }}>
                  Bienvenue {recapInscription.prenom} {recapInscription.nom}
                </Typography>
              )}
            </Stack>

            <Typography sx={{ color: COLORS.textBody, fontSize: 15, mb: 3, textAlign: 'center' }}>
              Votre demande d'inscription a bien été enregistrée. Votre compte est actuellement en attente
              de validation par l'administration. Vous pourrez accéder à votre espace élève uniquement après
              validation et affectation de vos matières.
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Statut
              </Typography>
              <Chip label="🟠 En attente de validation" sx={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700 }} />
            </Stack>

            {recapInscription && (
              <Stack spacing={3} sx={{ mb: 4 }}>
                <Box>
                  <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 13, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 1.5 }}>
                    Informations personnelles
                  </Typography>
                  <Stack spacing={1} sx={{ p: 2.5, borderRadius: '16px', backgroundColor: COLORS.background, border: `1px solid ${COLORS.borderLight}` }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PersonOutlineIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                      <Typography sx={{ fontSize: 14, color: COLORS.primaryDark, fontWeight: 600 }}>{recapInscription.prenom} {recapInscription.nom}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <EmailOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                      <Typography sx={{ fontSize: 14, color: COLORS.textBody }}>{recapInscription.email}</Typography>
                    </Stack>
                    {recapInscription.telephone && (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PhoneOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                        <Typography sx={{ fontSize: 14, color: COLORS.textBody }}>{recapInscription.telephone}</Typography>
                      </Stack>
                    )}
                    {recapInscription.niveauLibelle && (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography sx={{ fontSize: 14, color: COLORS.textBody, fontWeight: 600 }}>{recapInscription.niveauLibelle}</Typography>
                      </Stack>
                    )}
                    {recapInscription.bacLibelle && (
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>{recapInscription.bacLibelle}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 13, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 1.5 }}>
                    Matières demandées
                  </Typography>
                  <Stack spacing={1}>
                    {recapInscription.matieresAvecMode.map((m) => (
                      <Stack key={m.nom} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.75, borderRadius: '12px', border: `1px solid ${COLORS.borderLight}` }}>
                        <Typography sx={{ fontSize: 14, color: COLORS.primaryDark, fontWeight: 600 }}>✓ {m.nom}</Typography>
                        <Chip size="small" label={m.mode === 'GROUPE' ? 'Groupe' : 'Individuel'} sx={{ backgroundColor: COLORS.primary, color: 'white', fontWeight: 700, fontSize: 12 }} />
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}

            {whatsappConfigured && lienWhatsApp && (
              <Button
                onClick={() => window.open(lienWhatsApp, '_blank', 'noopener,noreferrer')}
                fullWidth
                startIcon={<WhatsAppIcon />}
                sx={{ backgroundColor: '#25D366', color: 'white', py: 1.75, mb: 2, '&:hover': { backgroundColor: '#1EBE5A' } }}
              >
                Contacter l'administration sur WhatsApp
              </Button>
            )}

          </Paper>
        </Box>
        <AuthFooter />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.background, display: 'flex', flexDirection: 'column' }}>
      <AuthNavbar rightLabel="Déjà un compte ?" rightLinkText="Se connecter" rightLinkTo="/login" />

      <Box sx={{ flex: 1, py: 8, px: 3 }}>
        <RegisterStepper currentStep={3} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} sx={{ maxWidth: 1024, mx: 'auto' }}>
          <Paper elevation={0} sx={{ flex: 1, borderRadius: '24px', border: `1px solid ${COLORS.borderLight}`, boxShadow: '0px 10px 40px -10px rgba(21,101,192,0.08)', overflow: 'hidden' }}>
            <Box sx={{ p: 4, borderBottom: '1px solid #F9FAFB' }}>
              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 24, mb: 0.5 }}>Récapitulatif</Typography>
              <Typography sx={{ color: COLORS.textBody, fontSize: 16 }}>
                Vérifiez vos informations avant de finaliser votre inscription.
              </Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 2 }}>
                Informations personnelles
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 4, p: 2.5, borderRadius: '16px', backgroundColor: COLORS.background, border: `1px solid ${COLORS.borderLight}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonOutlineIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                  <Typography sx={{ fontSize: 16, color: COLORS.primaryDark, fontWeight: 600 }}>{infosPersonnelles.nomComplet}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                  <Typography sx={{ fontSize: 16, color: COLORS.textBody }}>{infosPersonnelles.email}</Typography>
                </Stack>
                {infosPersonnelles.telephone && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                    <Typography sx={{ fontSize: 16, color: COLORS.textBody }}>{infosPersonnelles.telephone}</Typography>
                  </Stack>
                )}
                {niveau && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography sx={{ fontSize: 16, color: COLORS.textBody, fontWeight: 600 }}>
                      {niveaux.find((n) => n.valeur === niveau)?.libelle || niveau}
                    </Typography>
                  </Stack>
                )}
                {niveau === 'BACCALAUREAT' && typeBac && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography sx={{ fontSize: 14, color: COLORS.textMuted }}>
                      {typeBac === 'ETRANGER' ? `Bac étranger — ${paysBac || '…'}` : 'Bac tunisien'}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Typography sx={{ color: COLORS.primaryDark, fontWeight: 700, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 2 }}>
                Matières demandées
              </Typography>
              <Stack spacing={1.5}>
                {matieresSouhaitees.map((m) => (
                  <Stack
                    key={m.matiereId}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 2, borderRadius: '16px', border: '1px solid rgba(21,101,192,0.2)', backgroundColor: 'rgba(239,246,255,0.5)' }}
                  >
                    <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 16 }}>{nomMatiere(m.matiereId)}</Typography>
                    <Chip
                      label={m.typeCours === 'GROUPE' ? 'Groupe' : 'Individuel'}
                      size="small"
                      sx={{ backgroundColor: COLORS.primary, color: 'white', fontWeight: 700, fontSize: 12 }}
                    />
                  </Stack>
                ))}
              </Stack>

              <Alert severity="info" sx={{ mt: 4, borderRadius: '12px' }}>
                Votre demande d'inscription sera envoyée à l'administration. Votre compte restera en attente
                de validation jusqu'à l'affectation des matières et des enseignants.
              </Alert>
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{ p: 4, backgroundColor: COLORS.background, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/register/parcours')} sx={{ borderColor: COLORS.borderDefault, borderWidth: 2, color: COLORS.textBody, px: 4 }}>
                Précédent
              </Button>
              <Button variant="contained" disabled={submitting} onClick={handleConfirmer} sx={{ backgroundColor: COLORS.primary, px: 5 }}>
                {submitting ? 'Création…' : 'Créer mon compte'}
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
