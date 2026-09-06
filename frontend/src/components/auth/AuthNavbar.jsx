import { Box, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import { COLORS } from '../../theme/theme';


export default function AuthNavbar({ rightLabel, rightLinkText, rightLinkTo, centerLinks }) {
  const location = useLocation();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid rgba(226,232,240,0.6)',
        px: { xs: 2, md: 4 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 80, maxWidth: 1280, mx: 'auto' }}>
        <Stack component={RouterLink} to="/" direction="row" spacing={1} alignItems="center" sx={{ textDecoration: 'none' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontFamily: "'Barlow Condensed'", color: COLORS.footerBackground, fontWeight: 700, fontSize: 24, letterSpacing: '-0.6px' }}>
            EduPlatform
          </Typography>
        </Stack>

        {centerLinks && (
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {centerLinks.map((link) => {
              const actif = location.pathname === link.to;
              return (
                <Typography
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: 14,
                    color: actif ? COLORS.footerBackground : COLORS.textBody,
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Typography>
              );
            })}
          </Stack>
        )}

        {centerLinks ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography component={RouterLink} to="/login" sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: COLORS.footerBackground, textDecoration: 'none' }}>
              Se connecter
            </Typography>
            <Box
              component={RouterLink}
              to="/register"
              sx={{
                backgroundColor: '#1D4ED8',
                color: 'white',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                borderRadius: '9999px',
                px: 3,
                py: 1.2,
                boxShadow: '0px 8px 10px rgba(29,78,216,0.2)',
              }}
            >
              S'inscrire
            </Box>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center" component={RouterLink} to={rightLinkTo} sx={{ textDecoration: 'none' }}>
            <Typography sx={{ color: COLORS.textBody, fontSize: 14 }}>{rightLabel}</Typography>
            <Typography sx={{ color: COLORS.primary, fontWeight: 700, fontSize: 16 }}>{rightLinkText}</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
