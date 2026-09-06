import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/PieChartOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import InsightsIcon from '@mui/icons-material/Insights';
import CategoryIcon from '@mui/icons-material/Category';
import { useEffect, useState } from 'react';
import RoleSidebar from '../components/common/RoleSidebar';
import RoleTopbar from '../components/common/RoleTopbar';
import eleveService from '../services/eleveService';
import { COLORS } from '../theme/theme';

export default function AdminLayout() {
  const [inscriptionsEnAttente, setInscriptionsEnAttente] = useState(0);

  useEffect(() => {
    eleveService.getAll({ valide: false }).then((data) => setInscriptionsEnAttente(data.length)).catch(() => {});
  }, []);

  const items = [
    { label: 'Tableau de bord', icon: <DashboardIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/dashboard' },
    { label: 'Inscriptions en attente', icon: <HowToRegIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/inscriptions', badge: inscriptionsEnAttente },
    { label: 'Enseignants', icon: <CastForEducationIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/enseignants' },
    { label: 'Élèves', icon: <GroupsIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/eleves' },
    { label: 'Cours', icon: <MenuBookIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/cours' },
    { label: 'Cours en ligne', icon: <VideoCameraFrontIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/lives' },
    { label: 'Matières', icon: <CategoryIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/matieres' },
    { label: 'Statistiques', icon: <InsightsIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/admin/statistiques' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.background }}>
      <RoleSidebar items={items} roleLabel="Administrateur" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <RoleTopbar searchPlaceholder="Rechercher un élève, un cours..." roleLabel="Administrateur" />
        <Box sx={{ p: { xs: 2, md: 5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
