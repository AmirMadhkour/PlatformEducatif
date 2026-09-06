import { Box, Button, Grid, Paper, Stack, Typography, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AuthNavbar from '../../components/auth/AuthNavbar';
import AuthFooter from '../../components/auth/AuthFooter';



const COL = {
  navy: '#0B1F3F',
  navyGradientEnd: '#0F2D5C',
  ctaGradientEnd: '#0C316B',
  accent: '#38BDF8',
  primary: '#1D4ED8',
  slate600: '#64748B',
  slate500: '#94A3B8',
  lightBlue: '#E0F2FE',
  border: '#F3F4F6',
  footerBorder: '#1F2937',
};

const AVANTAGES = [
  { Icon: SchoolOutlinedIcon, titre: 'Professeurs certifiés', texte: "Les meilleurs enseignants tunisiens, rigoureusement sélectionnés pour leur expertise et leur pédagogie." },
  { Icon: LayersOutlinedIcon, titre: 'Cours adaptés', texte: "Des contenus structurés selon votre niveau, du primaire jusqu'aux révisions intensives du Bac." },
  { Icon: TrendingUpOutlinedIcon, titre: 'Suivi personnalisé', texte: 'Des tableaux de bord détaillés pour suivre votre progression matière par matière et identifier vos lacunes.' },
  { Icon: WhatsAppIcon, titre: 'Accompagnement humain', texte: "Un support réactif via WhatsApp pour répondre à vos questions et vous motiver tout au long de l'année." },
];

const STATS = [
  { Icon: GroupsOutlinedIcon, label: '50k+ élèves' },
  { Icon: SchoolOutlinedIcon, label: '200+ enseignants' },
  { Icon: MenuBookOutlinedIcon, label: '15+ matières' },
  { Icon: EmojiEventsOutlinedIcon, label: '98% Taux de réussite Bac' },
];

const OFFRES = [
  {
    titre: 'Cours en groupe',
    description: "L'émulation du groupe pour progresser ensemble.",
    prix: '49 DT',
    items: ['Groupes de 10 élèves max', '2 séances / semaine', 'Accès aux replays', 'Exercices corrigés'],
    mise_en_avant: false,
  },
  {
    titre: 'Cours individuel',
    description: 'Un accompagnement sur-mesure à votre rythme.',
    prix: '89 DT',
    items: ['Professeur dédié', 'Horaires flexibles', 'Programme personnalisé', 'Suivi WhatsApp 7j/7', 'Bilan mensuel parents'],
    mise_en_avant: true,
  },
  {
    titre: 'Pack intensif Bac',
    description: 'Préparation optimale pour décrocher la mention.',
    prix: '149 DT',
    items: ['Toutes les matières principales', 'Révisions thématiques', 'Examens blancs corrigés', 'Méthodologie et gestion du stress'],
    mise_en_avant: false,
  },
];

const TEMOIGNAGES = [
  { texte: "Grâce aux cours intensifs en maths et physique, j'ai pu combler mes lacunes en quelques mois. Les profs sont très à l'écoute et les explications sont claires.", nom: 'Yasmine T.', role: 'Mention Très Bien au Bac 2023' },
  { texte: "La plateforme est super intuitive. Je peux revoir les cours enregistrés quand je veux, ce qui m'a énormément aidé pour mes révisions de dernière minute.", nom: 'Mehdi K.', role: 'Admis en Prépa Ingénieur' },
  { texte: "En tant que parent, le suivi WhatsApp est rassurant. Je sais exactement où en est mon fils et les professeurs nous tiennent régulièrement au courant.", nom: 'Leïla B.', role: "Mère d'un élève de 3ème" },
];

const headingSx = { fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: '-0.02em' };




const MATIERES_ESSENTIELLES = [
  { motCle: 'mathematique', nomAffiche: 'Mathématiques', Icon: CalculateOutlinedIcon, descriptionParDefaut: 'Algèbre, géométrie et analyse pour construire des bases solides.' },
  { motCle: 'science', nomAffiche: 'Sciences', Icon: ScienceOutlinedIcon, descriptionParDefaut: 'Sciences de la vie et de la terre pour comprendre le monde qui vous entoure.' },
  { motCle: 'physique', nomAffiche: 'Physique', Icon: BoltOutlinedIcon, descriptionParDefaut: 'Mécanique, électricité et optique expliquées simplement.' },
];


const ILLUSTRATIONS_MATIERE = {
  mathematique: (
    <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gradMath" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COL.navy} />
          <stop offset="100%" stopColor="#123465" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#gradMath)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`v${i}`} x1={40 + i * 65} y1="0" x2={40 + i * 65} y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={30 + i * 50} x2="400" y2={30 + i * 50} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <path d="M 40 160 Q 140 20 200 100 T 360 40" fill="none" stroke={COL.accent} strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
      <circle cx="200" cy="100" r="6" fill="white" />
      <text x="255" y="150" fontFamily="Georgia, serif" fontStyle="italic" fontSize="34" fill="rgba(255,255,255,0.85)">Σ</text>
      <text x="70" y="70" fontFamily="Georgia, serif" fontStyle="italic" fontSize="28" fill="rgba(255,255,255,0.7)">π</text>
    </svg>
  ),
  science: (
    <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gradScience" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0C3B5E" />
          <stop offset="100%" stopColor="#155A8A" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#gradScience)" />
      <g transform="translate(140,30)">
        <path d="M20 0 L40 0 L40 45 L65 110 Q70 125 55 125 L5 125 Q-10 125 -5 110 L20 45 Z" fill="rgba(255,255,255,0.12)" stroke={COL.accent} strokeWidth="2.5" />
        <path d="M2 95 L58 95 L55 110 Q52 122 40 122 L20 122 Q8 122 5 110 Z" fill={COL.accent} opacity="0.55" />
        <circle cx="18" cy="60" r="4" fill={COL.accent} opacity="0.9" />
        <circle cx="35" cy="75" r="3" fill="white" opacity="0.8" />
        <circle cx="26" cy="88" r="5" fill={COL.accent} opacity="0.7" />
      </g>
      <circle cx="300" cy="50" r="14" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <circle cx="80" cy="150" r="9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
    </svg>
  ),
  physique: (
    <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gradPhysique" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COL.navy} />
          <stop offset="100%" stopColor="#1E3A72" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#gradPhysique)" />
      <g transform="translate(200,100)">
        <ellipse rx="130" ry="42" fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="2.5" />
        <ellipse rx="130" ry="42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" transform="rotate(60)" />
        <ellipse rx="130" ry="42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" transform="rotate(120)" />
        <circle r="12" fill={COL.accent} />
        <circle cx="130" cy="0" r="6" fill="white" />
        <circle cx="-65" cy="36" r="5" fill="white" opacity="0.85" transform="rotate(120)" />
      </g>
    </svg>
  ),
};

function MatiereIllustration({ motCle }) {
  return (
    <Box sx={{ width: '100%', height: 160, borderTopLeftRadius: '16px', borderTopRightRadius: '16px', overflow: 'hidden', lineHeight: 0 }}>
      {ILLUSTRATIONS_MATIERE[motCle] || ILLUSTRATIONS_MATIERE.mathematique}
    </Box>
  );
}

export default function HomePage() {






  const isMobile = useMediaQuery('(max-width:599.95px)');

  const renderCarteAvantage = ({ Icon, titre, texte }) => (
    <Paper elevation={0} sx={{ height: '100%', backgroundColor: 'white', borderRadius: '16px', p: 4, boxShadow: '0px 20px 25px rgba(29,78,216,0.06)' }}>
      <Box sx={{ width: 56, height: 56, borderRadius: '12px', backgroundColor: COL.lightBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <Icon sx={{ color: COL.primary, fontSize: 24 }} />
      </Box>
      <Typography sx={{ ...headingSx, color: COL.navy, fontSize: 24, mb: 1.5 }}>{titre}</Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: 16, color: COL.slate600, lineHeight: '26px' }}>{texte}</Typography>
    </Paper>
  );

  const renderCarteMatiere = ({ nom, description, Icon, motCle }) => (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0px 20px 25px rgba(29,78,216,0.06)' }}>
      <Box sx={{ position: 'relative' }}>
        <MatiereIllustration motCle={motCle} />
        <Box
          sx={{
            position: 'absolute', left: 20, bottom: -22,
            width: 44, height: 44, borderRadius: '12px', backgroundColor: COL.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0px 8px 16px rgba(29,78,216,0.3)', border: '3px solid white',
          }}
        >
          <Icon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 4, pt: 4.5 }}>
        <Typography sx={{ ...headingSx, color: COL.navy, fontSize: 24, mb: 1.5 }}>{nom}</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 16, color: COL.slate600, lineHeight: '26px', mb: 3, flexGrow: 1 }}>
          {description}
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
          sx={{ alignSelf: 'flex-start', fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: COL.primary, textTransform: 'none', px: 0, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
        >
          Découvrir
        </Button>
      </Box>
    </Paper>
  );



  const matieresEssentielles = MATIERES_ESSENTIELLES.map((ref) => ({
    id: ref.motCle, nom: ref.nomAffiche, description: ref.descriptionParDefaut, Icon: ref.Icon, motCle: ref.motCle,
  }));

  const renderCarteTemoignage = (t) => (
    <Paper
      elevation={0}
      sx={{ height: '100%', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', p: 4 }}
    >
      <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} sx={{ color: COL.accent, fontSize: 16 }} />)}
      </Stack>
      <Typography sx={{ fontFamily: 'Inter', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: 'white', lineHeight: '28px', mb: 3 }}>
        "{t.texte}"
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <PersonIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 600, fontSize: 16, color: 'white' }}>{t.nom}</Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COL.accent }}>{t.role}</Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <AuthNavbar centerLinks={[]} />

      {}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: COL.navy,
          backgroundImage: `linear-gradient(147deg, ${COL.navy} 0%, ${COL.navy} 50%, ${COL.navyGradientEnd} 100%)`,
          py: { xs: 6, md: '80px' },
          px: { xs: 3, md: '80px' },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center" justifyContent="center" sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ ...headingSx, color: 'white', fontSize: { xs: 40, md: 72 }, lineHeight: 1.05, mb: 3 }}>
              Réussissez votre
              <br />
              scolarité,
              <br />
              <Box component="span" sx={{ background: `linear-gradient(90deg, ${COL.accent}, white)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                du primaire au Bac
              </Box>
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 20, color: 'white', mb: 4, maxWidth: 576 }}>
              Cours en direct ou enregistrés, professeurs qualifiés, et suivi personnalisé pour chaque élève tunisien.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
              <Button
                component={RouterLink}
                to="/register"
                sx={{ backgroundColor: COL.primary, color: 'white', fontFamily: 'Inter', fontWeight: 600, fontSize: 18, borderRadius: '9999px', px: 4, py: 2, textTransform: 'none', '&:hover': { backgroundColor: '#1e40af' } }}
              >
                Commencer gratuitement
              </Button>
              <Button
                component="a"
                href="#offres"
                sx={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontFamily: 'Inter', fontWeight: 600, fontSize: 18, borderRadius: '9999px', px: 4, py: 2, textTransform: 'none' }}
              >
                Voir nos offres
              </Button>
            </Stack>
            <Stack direction="row" flexWrap="wrap" rowGap={2} columnGap={4} sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4 }}>
              {STATS.map(({ Icon, label }) => (
                <Stack key={label} direction="row" spacing={1} alignItems="center">
                  <Icon sx={{ color: COL.accent, fontSize: 16 }} />
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: 'white' }}>{label}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', maxWidth: 584, mx: 'auto' }}>
              <Box sx={{ position: 'absolute', inset: -16, borderRadius: '32px', background: `linear-gradient(45deg, rgba(56,189,248,0.2), rgba(56,189,248,0))`, filter: 'blur(12px)' }} />
              <Box
                sx={{
                  position: 'relative',
                  height: 600,
                  borderRadius: '32px',
                  backdropFilter: 'blur(5px)',
                  backgroundColor: 'rgba(11,31,63,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {}
                <SchoolOutlinedIcon sx={{ fontSize: 160, color: 'rgba(56,189,248,0.35)' }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {}
      <Box sx={{ backgroundColor: COL.lightBlue, py: { xs: 8, md: '128px' }, px: { xs: 3, md: '80px' } }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Stack spacing={3} alignItems="center" textAlign="center" sx={{ maxWidth: 768, mx: 'auto', mb: 8 }}>
            <Typography sx={{ ...headingSx, color: COL.navy, fontSize: { xs: 32, md: 48 } }}>Pourquoi nous choisir</Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: 18, color: COL.slate600 }}>
              Une approche pédagogique innovante conçue spécifiquement pour le programme tunisien, alliant technologie et accompagnement humain.
            </Typography>
          </Stack>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 2.5, mx: -3, px: 3, pb: 1, WebkitOverflowScrolling: 'touch' }}>
              {AVANTAGES.map((avantage) => (
                <Box key={avantage.titre} sx={{ flexShrink: 0, width: '78vw', maxWidth: 320 }}>
                  {renderCarteAvantage(avantage)}
                </Box>
              ))}
            </Box>
          ) : (
            <Grid container spacing={4}>
              {AVANTAGES.map((avantage) => (
                <Grid item xs={12} sm={6} md={3} key={avantage.titre}>
                  {renderCarteAvantage(avantage)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'white', py: { xs: 8, md: '128px' }, px: { xs: 3, md: '80px' } }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: 672, mx: 'auto', mb: 8 }}>
            <Typography sx={{ ...headingSx, color: COL.navy, fontSize: { xs: 32, md: 48 } }}>Nos Cours</Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: 18, color: COL.slate600 }}>
              Découvrez les matières clés pour réussir votre parcours scolaire.
            </Typography>
          </Stack>

          {isMobile ? (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 2.5, mx: -3, px: 3, pb: 1, WebkitOverflowScrolling: 'touch' }}>
              {matieresEssentielles.map((matiere) => (
                <Box key={matiere.id} sx={{ flexShrink: 0, width: '78vw', maxWidth: 320 }}>
                  {renderCarteMatiere(matiere)}
                </Box>
              ))}
            </Box>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {matieresEssentielles.map((matiere) => (
                <Grid item xs={12} sm={6} md={4} key={matiere.id}>
                  {renderCarteMatiere(matiere)}
                </Grid>
              ))}
            </Grid>
          )}
          </Box>
        </Box>

      {}
      <Box id="offres" sx={{ backgroundColor: 'white', py: { xs: 8, md: '128px' }, px: { xs: 3, md: '80px' } }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: 672, mx: 'auto', mb: 8 }}>
            <Typography sx={{ ...headingSx, color: COL.navy, fontSize: { xs: 32, md: 48 } }}>Nos Offres</Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: 18, color: COL.slate600 }}>
              Choisissez le format qui correspond le mieux à vos besoins et à vos objectifs de réussite.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ maxWidth: 1024, mx: 'auto' }}>
            {OFFRES.map((offre) => (
              <Paper
                key={offre.titre}
                elevation={0}
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: offre.mise_en_avant ? 336 : 320 },
                  flexShrink: 0,
                  p: 4,
                  borderRadius: '32px',
                  backgroundColor: offre.mise_en_avant ? COL.navy : 'white',
                  border: offre.mise_en_avant ? '1px solid rgba(56,189,248,0.3)' : `1px solid ${COL.border}`,
                  boxShadow: offre.mise_en_avant ? '0px 30px 30px rgba(11,31,63,0.3)' : '0px 1px 1px rgba(0,0,0,0.05)',
                }}
              >
                {offre.mise_en_avant && (
                  <Box
                    sx={{
                      position: 'absolute', top: -17, left: '50%', transform: 'translateX(-50%)',
                      background: `linear-gradient(90deg, ${COL.accent}, ${COL.primary})`,
                      color: 'white', fontFamily: 'Inter', fontWeight: 700, fontSize: 12,
                      letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center',
                      borderRadius: '9999px', px: 2, py: 0.5, whiteSpace: 'nowrap',
                    }}
                  >
                    Le plus populaire
                  </Box>
                )}
                <Typography sx={{ ...headingSx, fontSize: 24, color: offre.mise_en_avant ? 'white' : COL.navy, mb: 1 }}>{offre.titre}</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: offre.mise_en_avant ? '#CBD5E1' : COL.slate600, mb: 2, minHeight: 40 }}>
                  {offre.description}
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 2 }}>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: offre.mise_en_avant ? 'white' : COL.navy }}>{offre.prix}</Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 16, color: offre.mise_en_avant ? '#CBD5E1' : COL.slate600 }}>/mois</Typography>
                </Stack>
                <Stack spacing={2} sx={{ py: 3 }}>
                  {offre.items.map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                      <CheckIcon sx={{ fontSize: 16, color: COL.accent, flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: offre.mise_en_avant ? '#F3F4F6' : COL.slate600 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  component={RouterLink}
                  to="/register"
                  fullWidth
                  sx={{
                    borderRadius: '9999px', py: 1.5, fontFamily: 'Inter', fontWeight: 600, fontSize: 16, textTransform: 'none',
                    ...(offre.mise_en_avant
                      ? { backgroundColor: COL.primary, color: 'white', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: '#1e40af' } }
                      : { border: `1px solid ${COL.primary}`, color: COL.primary }),
                  }}
                >
                  Choisir cette offre
                </Button>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>

      {}
      <Box sx={{ backgroundColor: COL.navy, py: { xs: 8, md: '128px' }, px: { xs: 3, md: '80px' } }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
            <Typography sx={{ ...headingSx, color: 'white', fontSize: { xs: 32, md: 48 } }}>Ils ont réussi avec nous</Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: 18, color: '#94A3B8' }}>Découvrez les parcours inspirants de nos élèves.</Typography>
          </Stack>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 2.5, mx: -3, px: 3, pb: 1, WebkitOverflowScrolling: 'touch' }}>
              {TEMOIGNAGES.map((t) => (
                <Box key={t.nom} sx={{ flexShrink: 0, width: '78vw', maxWidth: 320 }}>
                  {renderCarteTemoignage(t)}
                </Box>
              ))}
            </Box>
          ) : (
            <Grid container spacing={4}>
              {TEMOIGNAGES.map((t) => (
                <Grid item xs={12} md={4} key={t.nom}>
                  {renderCarteTemoignage(t)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {}
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, ${COL.navy} 16%, ${COL.ctaGradientEnd} 63%)`,
          py: { xs: 8, md: '96px' },
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ ...headingSx, color: 'white', fontSize: { xs: 32, md: 48 }, mb: 4 }}>
          Prêt à réussir votre année scolaire ?
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          sx={{
            backgroundColor: 'white', color: COL.navy, fontFamily: 'Inter', fontWeight: 700, fontSize: 18,
            borderRadius: '9999px', px: 5, py: 2, textTransform: 'none',
            boxShadow: '0px 0px 40px rgba(255,255,255,0.2)',
            '&:hover': { backgroundColor: '#f1f5f9' },
          }}
        >
          S'inscrire maintenant
        </Button>
      </Box>

      <AuthFooter />
    </Box>
  );
}
