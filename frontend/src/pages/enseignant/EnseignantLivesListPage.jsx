import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import coursEnLigneService from '../../services/coursEnLigneService';
import LiveCard from '../../components/coursEnLigne/LiveCard';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';


export default function EnseignantLivesListPage() {
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aSupprimer, setASupprimer] = useState(null);
  const [suppression, setSuppression] = useState(false);
  const navigate = useNavigate();

  const charger = () => {
    setLoading(true);
    coursEnLigneService.mesLivesEnseignant()
      .then(setLives)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleSupprimer = async () => {
    setSuppression(true);
    try {
      await coursEnLigneService.supprimer(aSupprimer.id);
      setASupprimer(null);
      charger();
    } catch {
      setSuppression(false);
      alert('Suppression impossible. Réessayez.');
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>
          Mes cours en ligne
        </Typography>
        <Button
          onClick={() => navigate('/enseignant/lives/nouveau')}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: COLORS.primary }}
        >
          Créer un cours en ligne
        </Button>
      </Stack>

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && lives.length === 0 && (
        <EmptyState message="Aucun cours en ligne programmé pour le moment." />
      )}

      {!loading && !error && lives.length > 0 && (
        <Stack spacing={2}>
          {lives.map((live) => (
            <LiveCard
              key={live.id}
              live={live}
              actions={
                <Button
                  fullWidth
                  size="small"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setASupprimer(live)}
                  sx={{ mt: 1, color: '#EF4444' }}
                >
                  Supprimer
                </Button>
              }
            />
          ))}
        </Stack>
      )}

      <ConfirmDialog
        open={!!aSupprimer}
        title="Supprimer ce cours en ligne ?"
        description="Cette action est irréversible."
        onCancel={() => setASupprimer(null)}
        onConfirm={handleSupprimer}
        confirmLabel="Supprimer"
        loading={suppression}
      />
    </Box>
  );
}
