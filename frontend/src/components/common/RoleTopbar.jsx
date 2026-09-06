import { Badge, Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/theme';

export default function RoleTopbar({ searchPlaceholder, roleLabel }) {
  const { user } = useAuth();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: 80, px: { xs: 2, md: 5 }, backgroundColor: 'white', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}
    >
      <TextField
        placeholder={searchPlaceholder}
        size="small"
        sx={{ width: { xs: '100%', sm: 384 }, '& .MuiOutlinedInput-root': { backgroundColor: COLORS.background, borderColor: '#F1F5F9' } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: COLORS.textMuted, fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" spacing={4} alignItems="center">
        <Badge variant="dot" color="error">
          <NotificationsNoneIcon sx={{ color: '#475569' }} />
        </Badge>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, borderLeft: '1px solid #E2E8F0', pl: 4, textAlign: 'right' }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: COLORS.footerBackground }}>
            {user?.prenom} {user?.nom}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#64748B', textTransform: 'uppercase' }}>
            {roleLabel}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
