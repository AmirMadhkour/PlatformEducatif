import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { COLORS } from '../../theme/theme';

export function StatCard({ icon, label, value, trend, trendColor, iconBg, subtitle }) {
  return (
    <Paper elevation={0} sx={{ flex: 1, minWidth: 200, border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, boxShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ width: 48, height: 48, borderRadius: '16px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        {trend && (
          <Box sx={{ backgroundColor: `${trendColor}1A`, borderRadius: '8px', px: 1, py: 0.5 }}>
            <Typography sx={{ color: trendColor, fontWeight: 700, fontSize: 12, fontFamily: 'Inter' }}>{trend}</Typography>
          </Box>
        )}
      </Stack>
      <Typography sx={{ color: '#64748B', fontSize: 14, fontFamily: 'Inter', fontWeight: 500, mt: 1.5 }}>{label}</Typography>
      <Typography sx={{ color: COLORS.footerBackground, fontSize: 24, fontFamily: 'Inter', fontWeight: 700 }}>{value}</Typography>
      {subtitle && <Typography sx={{ color: '#94A3B8', fontSize: 12, fontFamily: 'Inter', mt: 0.5 }}>{subtitle}</Typography>}
    </Paper>
  );
}

export function LoadingState() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
      <CircularProgress sx={{ color: COLORS.primary }} />
    </Stack>
  );
}

export function EmptyState({ message = 'Aucun élément pour le moment.' }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 8, color: '#94A3B8' }}>
      <InboxIcon sx={{ fontSize: 40 }} />
      <Typography sx={{ fontFamily: 'Inter' }}>{message}</Typography>
    </Stack>
  );
}

export function ErrorState({ message = "Une erreur est survenue. Vérifiez que le serveur backend est démarré." }) {
  return (
    <Alert severity="error" sx={{ borderRadius: '12px', my: 2 }}>
      {message}
    </Alert>
  );
}

export function ConfirmDialog({ open, title, description, onCancel, onConfirm, confirmLabel = 'Confirmer', loading }) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontFamily: 'Inter', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontFamily: 'Inter', color: '#64748B' }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onCancel} sx={{ color: '#64748B' }}>
          Annuler
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          {loading ? 'En cours…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
