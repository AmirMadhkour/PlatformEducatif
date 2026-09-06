import { createTheme } from '@mui/material/styles';


export const COLORS = {
  primary: '#1565C0',
  primaryDark: '#1A237E',
  secondaryLight: '#4FC3F7',
  textBody: '#6B7280',
  textMuted: '#9CA3AF',
  textDark: '#374151',
  background: '#F8FAFC',
  inputBackground: '#F8FAFC',
  borderDefault: '#E5E7EB',
  borderLight: '#F3F4F6',
  infoBackground: '#EFF6FF',
  infoBorder: '#DBEAFE',
  footerBackground: '#0B1F3F',
  footerBorder: '#1F2937',
  stepperTrack: '#F3F4F6',
  stepperInactiveBg: '#F1F5F9',
  stepperInactiveText: '#94A3B8',
  stepperDoneBg: '#E0F2FE',
};

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
      dark: COLORS.primaryDark,
    },
    secondary: {
      main: COLORS.secondaryLight,
    },
    background: {
      default: COLORS.background,
      paper: '#FFFFFF',
    },
    text: {
      primary: COLORS.primaryDark,
      secondary: COLORS.textBody,
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 700,
        },
        containedPrimary: {
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: COLORS.inputBackground,
          '& fieldset': {
            borderColor: COLORS.borderDefault,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 24,
        },
      },
    },
  },
});

export default theme;
