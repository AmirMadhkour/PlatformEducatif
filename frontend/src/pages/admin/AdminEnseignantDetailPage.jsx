import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Paper, Stack, Switch, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import enseignantService from '../../services/enseignantService';
import { LoadingState, ConfirmDialog } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminEnseignantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ens, setEns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const charger = () => {
    enseignantService.getById(id).then(setEns).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, [id]);

  const handleToggle = async () => {
    await enseignantService.toggleActivation(id, !ens.enabled);
    charger();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await enseignantService.delete(id);
      navigate('/admin/enseignants');
    } catch (err) {
      setDeleting(false);
      setConfirmOpen(false);
      setDeleteError(err.response?.data?.message || "Suppression impossible : cet enseignant a des cours ou des élèves affectés. Désactivez-le plutôt.");
    }
  };

  if (loading) return <LoadingState />;
  if (!ens) return null;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      {deleteError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{deleteError}</Alert>}

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>{ens.prenom} {ens.nom}</Typography>
          <Typography sx={{ fontFamily: 'Inter', color: COLORS.textBody, fontSize: 14 }}>{ens.email}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditOutlinedIcon />} onClick={() => navigate(`/admin/enseignants/${id}/modifier`)}>Modifier</Button>
          <Button startIcon={<DeleteOutlineIcon />} color="error" onClick={() => setConfirmOpen(true)}>Supprimer</Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700 }}>Compte actif</Typography>
          <Switch checked={ens.enabled} onChange={handleToggle} />
        </Stack>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody }}>Téléphone : {ens.telephone || '—'}</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody }}>Spécialité : {ens.specialite || '—'}</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody }}>Diplôme : {ens.diplome || '—'}</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody }}>Expérience : {ens.experience ? `${ens.experience} ans` : '—'}</Typography>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, mb: 1.5 }}>Matières enseignées</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {ens.matieres?.map((m) => <Chip key={m.id} label={m.nom} />)}
        </Stack>
      </Paper>

      {ens.biographie && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, mb: 1 }}>Biographie</Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: COLORS.textBody }}>{ens.biographie}</Typography>
        </Paper>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer cet enseignant ?"
        description="Impossible s'il a des cours publiés ou des élèves affectés — utilisez la désactivation dans ce cas."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        loading={deleting}
      />
    </Box>
  );
}
