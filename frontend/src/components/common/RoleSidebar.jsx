import { Box, Stack, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/theme';


export default function RoleSidebar({ items, roleLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 288,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${COLORS.primaryDark} 0%, ${COLORS.footerBackground} 100%)`,
        minHeight: '100vh',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 4 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '16px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SchoolIcon sx={{ color: COLORS.primary, fontSize: 22 }} />
        </Box>
        <Typography sx={{ color: 'white', fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 24, letterSpacing: '-0.6px' }}>
          EduPlatform
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ px: 2, flex: 1 }}>
        {items.map((item) => (
          <Box
            key={item.to}
            component={NavLink}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: 16,
              borderRadius: 16,
              color: 'rgba(255,255,255,0.7)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: isActive ? `4px solid ${COLORS.secondaryLight}` : '4px solid transparent',
            })}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {item.icon}
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 16, color: 'inherit' }}>{item.label}</Typography>
            </Stack>
            {item.badge > 0 && (
              <Box sx={{ backgroundColor: COLORS.secondaryLight, borderRadius: '9999px', px: 1, py: 0.2 }}>
                <Typography sx={{ color: COLORS.primaryDark, fontWeight: 800, fontSize: 10 }}>{item.badge}</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      <Box sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', p: 1.5, mb: 2 }}>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 12, fontFamily: "'Plus Jakarta Sans'" }}>
            {user?.prenom} {user?.nom}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>
            {roleLabel}
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ cursor: 'pointer', px: 1 }}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogoutIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans'" }}>
            Déconnexion
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
