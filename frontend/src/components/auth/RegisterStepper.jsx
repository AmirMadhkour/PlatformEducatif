import { Box, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { COLORS } from '../../theme/theme';

const ETAPES = [
  { numero: 1, label: 'Infos personnelles' },
  { numero: 2, label: 'Niveau & matières' },
  { numero: 3, label: 'Récapitulatif' },
];


export default function RegisterStepper({ currentStep }) {
  const progressPercent = currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100;

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 896, mx: 'auto', mb: 6 }}>
      <Box sx={{ position: 'absolute', top: 24, left: 0, right: 0, height: 4, backgroundColor: COLORS.stepperTrack, zIndex: 0 }} />
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          left: 0,
          width: `${progressPercent}%`,
          height: 4,
          backgroundColor: COLORS.primary,
          zIndex: 1,
          transition: 'width 0.3s ease',
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 2 }}>
        {ETAPES.map((etape) => {
          const estFaite = etape.numero < currentStep;
          const estActive = etape.numero === currentStep;
          return (
            <Stack key={etape.numero} spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: estActive ? `4px solid white` : '2px solid white',
                  boxShadow: estActive ? '0px 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                  backgroundColor: estFaite
                    ? COLORS.stepperDoneBg
                    : estActive
                      ? COLORS.primary
                      : COLORS.stepperInactiveBg,
                }}
              >
                {estFaite ? (
                  <CheckIcon sx={{ color: COLORS.primary }} />
                ) : (
                  <Typography sx={{ fontWeight: 700, fontSize: 16, color: estActive ? 'white' : COLORS.stepperInactiveText }}>
                    {etape.numero}
                  </Typography>
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: estActive ? 800 : 600,
                  color: estActive || estFaite ? COLORS.primary : COLORS.textMuted,
                }}
              >
                {etape.numero}. {etape.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
