import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import { statistiqueService } from '../../services/statistiqueService';
import { LoadingState, ErrorState } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';


const GROUPES_KPI = [
  {
    accent: COLORS.primary, fond: '#EFF6FF',
    lignes: [
      { cle: 'totalEleves', label: 'Total élèves', icone: GroupsOutlinedIcon },
      { cle: 'elevesValides', label: 'Élèves validés', icone: HowToRegOutlinedIcon },
      { cle: 'elevesEnAttente', label: 'Élèves en attente', icone: PendingActionsOutlinedIcon },
    ],
  },
  {
    accent: COLORS.primaryDark, fond: '#EEF2FF',
    lignes: [
      { cle: 'totalEnseignants', label: 'Total enseignants', icone: CastForEducationOutlinedIcon },
      { cle: 'enseignantsActifs', label: 'Enseignants actifs', icone: CheckCircleOutlineIcon },
    ],
  },
  {
    accent: '#0D9488', fond: '#F0FDFA',
    lignes: [
      { cle: 'totalCours', label: 'Cours publiés', icone: MenuBookOutlinedIcon },
      { cle: 'totalMatieres', label: 'Matières configurées', icone: CategoryOutlinedIcon },
    ],
  },
  {
    accent: '#B45309', fond: '#FFFBEB',
    lignes: [
      { cle: 'affectationsEnAttente', label: 'Affectations en attente', icone: AssignmentLateOutlinedIcon },
    ],
  },
];

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];


function formaterMois(cleMois) {
  const [annee, mois] = cleMois.split('-');
  return `${MOIS_COURTS[Number(mois) - 1] || mois} ${annee}`;
}


function CarteKpi({ label, valeur, Icone, accent, fond }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 2.5, height: '100%' }}>
      <Stack direction="row" spacing={1.75} alignItems="center">
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: fond, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icone sx={{ fontSize: 20, color: accent }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 24, color: COLORS.footerBackground, lineHeight: 1.2 }}>{valeur}</Typography>
          <Typography sx={{ fontFamily: 'Inter', color: '#64748B', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}


function TooltipPersonnalise({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '10px', px: 1.75, py: 1, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.08)' }}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#94A3B8', mb: 0.25 }}>{label}</Typography>
      {payload.map((p) => (
        <Stack key={p.dataKey} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.color }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: COLORS.footerBackground }}>{p.value}</Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#64748B' }}>{p.name}</Typography>
        </Stack>
      ))}
    </Paper>
  );
}


function CarteGraphique({ titre, sousTitre, hauteur = 280, estVide, children }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, height: '100%' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15.5, color: COLORS.footerBackground }}>{titre}</Typography>
      {sousTitre && <Typography sx={{ fontFamily: 'Inter', fontSize: 12.5, color: '#94A3B8', mb: 1.5 }}>{sousTitre}</Typography>}
      {estVide ? (
        <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ height: hauteur, color: '#CBD5E1' }}>
          <ShowChartOutlinedIcon sx={{ fontSize: 32 }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: 13.5, color: '#94A3B8' }}>Aucune donnée pour le moment.</Typography>
        </Stack>
      ) : (
        <Box sx={{ height: hauteur, mt: 1.5 }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

export default function AdminStatistiquesPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    statistiqueService.getStatistiques().then(setStats).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!stats) return null;

  const elevesActifsData = (stats.elevesActifsParMois || []).map((s) => ({ mois: formaterMois(s.mois), nombre: s.nombre }));
  const annulationsData = (stats.annulationsParMois || []).map((s) => ({ mois: formaterMois(s.mois), nombre: s.nombre }));
  const enseignantsData = (stats.elevesParEnseignant || []).map((s) => ({ nom: s.enseignantNom, eleves: s.nombreEleves }));
  const matieresData = (stats.matieresPopulaires || []).map((s) => ({ nom: s.matiereNom, eleves: s.nombreEleves }));

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 26, color: COLORS.footerBackground }}>Statistiques</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody, mt: 0.5 }}>
          Vue d'ensemble de l'activité des élèves, enseignants et cours sur EduPlatform.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        {GROUPES_KPI.flatMap((groupe) => groupe.lignes).map((l) => {
          const groupe = GROUPES_KPI.find((g) => g.lignes.includes(l));
          return (
            <Grid item xs={12} sm={6} md={3} key={l.cle}>
              <CarteKpi label={l.label} valeur={stats[l.cle]} Icone={l.icone} accent={groupe.accent} fond={groupe.fond} />
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <CarteGraphique
            titre="Élèves actifs par mois"
            sousTitre="Répartition des élèves actuellement actifs, par mois d'inscription"
            estVide={elevesActifsData.length === 0}
          >
            <AreaChart data={elevesActifsData}>
              <defs>
                <linearGradient id="degradeElevesActifs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={{ stroke: '#F1F5F9' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<TooltipPersonnalise />} />
              <Area type="monotone" dataKey="nombre" name="Élèves actifs" stroke={COLORS.primary} strokeWidth={2.5}
                    fill="url(#degradeElevesActifs)" dot={{ r: 3.5, fill: COLORS.primary, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </CarteGraphique>
        </Grid>

        <Grid item xs={12} md={6}>
          <CarteGraphique
            titre="Annulations par mois"
            sousTitre="Comptes élèves désactivés par l'administration, par mois"
            estVide={annulationsData.length === 0}
          >
            <AreaChart data={annulationsData}>
              <defs>
                <linearGradient id="degradeAnnulations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={{ stroke: '#F1F5F9' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<TooltipPersonnalise />} />
              <Area type="monotone" dataKey="nombre" name="Annulations" stroke="#EF4444" strokeWidth={2.5}
                    fill="url(#degradeAnnulations)" dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </CarteGraphique>
        </Grid>

        <Grid item xs={12} md={6}>
          <CarteGraphique
            titre="Élèves par enseignant"
            sousTitre="Nombre d'élèves distincts actuellement affectés à chaque enseignant"
            estVide={enseignantsData.length === 0}
          >
            <BarChart data={enseignantsData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="nom" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={{ stroke: '#F1F5F9' }} tickLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<TooltipPersonnalise />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="eleves" name="Élèves" fill={COLORS.primary} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </CarteGraphique>
        </Grid>

        <Grid item xs={12} md={6}>
          <CarteGraphique
            titre="Matières les plus populaires"
            sousTitre="Nombre d'élèves distincts inscrits, toutes affectations confondues"
            estVide={matieresData.length === 0}
          >
            <BarChart data={matieresData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="nom" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={{ stroke: '#F1F5F9' }} tickLine={false} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<TooltipPersonnalise />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="eleves" name="Élèves inscrits" fill={COLORS.primaryDark} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </CarteGraphique>
        </Grid>
      </Grid>
    </Box>
  );
}
