import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/PieChartOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RoleSidebar from '../components/common/RoleSidebar';
import RoleTopbar from '../components/common/RoleTopbar';
import { COLORS } from '../theme/theme';

const items = [
  { label: 'Tableau de bord', icon: <DashboardIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/enseignant/dashboard' },
  { label: 'Mes élèves', icon: <GroupsIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/enseignant/eleves' },
  { label: 'Mes cours', icon: <MenuBookIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/enseignant/cours' },
  { label: 'Cours en ligne', icon: <VideoCameraFrontIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/enseignant/lives' },
  { label: 'Mon profil', icon: <PersonOutlineIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/enseignant/profil' },
];

export default function EnseignantLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.background }}>
      <RoleSidebar items={items} roleLabel="Enseignant" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <RoleTopbar searchPlaceholder="Rechercher un élève, un cours..." roleLabel="Enseignant" />
        <Box sx={{ p: { xs: 2, md: 5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
