import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/HomeOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RoleSidebar from '../components/common/RoleSidebar';
import RoleTopbar from '../components/common/RoleTopbar';
import { COLORS } from '../theme/theme';

const items = [
  { label: 'Tableau de bord', icon: <DashboardIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/eleve/dashboard' },
  { label: 'Mes cours', icon: <MenuBookIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/eleve/cours' },
  { label: 'Mes matières', icon: <CategoryIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/eleve/matieres' },
  { label: 'Mon profil', icon: <PersonOutlineIcon sx={{ color: 'inherit', fontSize: 20 }} />, to: '/eleve/profil' },
];

export default function EleveLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.background }}>
      <RoleSidebar items={items} roleLabel="Élève" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <RoleTopbar searchPlaceholder="Rechercher un cours, un document..." roleLabel="Élève" />
        <Box sx={{ p: { xs: 2, md: 5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
