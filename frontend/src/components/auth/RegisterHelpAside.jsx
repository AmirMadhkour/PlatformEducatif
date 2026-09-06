import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { COLORS } from '../../theme/theme';

export default function RegisterHelpAside() {
  return (
    <Stack spacing={3} sx={{ width: { xs: '100%', md: 314 } }}>
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: '24px', backgroundColor: COLORS.infoBackground, border: `1px solid ${COLORS.infoBorder}`, overflow: 'hidden', position: 'relative' }}
      >
        <Box sx={{ position: 'absolute', top: -16, right: -16, width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(21,101,192,0.05)' }} />
        <Box sx={{ width: 40, height: 40, borderRadius: '16px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 1px 1px rgba(0,0,0,0.05)', mb: 1 }}>
          <ChatBubbleOutlineIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 16, mb: 1 }}>Prochaine étape</Typography>
        <Typography sx={{ fontSize: 14, color: '#4B5563', lineHeight: '22.75px' }}>
          Une fois vos matières validées, un conseiller vous contactera sur{' '}
          <Box component="span" sx={{ fontWeight: 700, color: COLORS.primaryDark }}>
            WhatsApp
          </Box>{' '}
          pour finaliser votre inscription et organiser votre planning.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: `1px solid ${COLORS.borderLight}`, boxShadow: '0px 10px 40px -10px rgba(21,101,192,0.08)' }}>
        <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 14, letterSpacing: '0.7px', textTransform: 'uppercase', mb: 2 }}>
          Besoin d'aide ?
        </Typography>
        <Typography sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: 12 }}>Mme. Leila</Typography>
        <Typography sx={{ color: COLORS.textBody, fontSize: 10, mb: 2 }}>Conseillère pédagogique</Typography>
        <Button fullWidth variant="outlined" sx={{ borderColor: 'rgba(21,101,192,0.2)', color: COLORS.primary, fontSize: 12, py: 1.2, borderRadius: '8px' }}>
          Lancer le chat
        </Button>
      </Paper>
    </Stack>
  );
}
