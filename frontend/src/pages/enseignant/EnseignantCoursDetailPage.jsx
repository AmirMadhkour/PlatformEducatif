import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import coursService from '../../services/coursService';
import { LoadingState, ErrorState, ConfirmDialog } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EnseignantCoursDetailPage() {
  const { libelle } = useNiveauLabels();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cours, setCours] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    coursService.getById(id).then(setCours).catch(() => setError(true)).finally(() => setLoading(false));
  }, [id]);

  const ouvrirFichier = async (url) => {
    try {
      const blobUrl = await coursService.telechargerFichier(url);
      window.open(blobUrl, '_blank');
    } catch {
      alert('Impossible de récupérer ce fichier.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await coursService.delete(id);
      navigate('/enseignant/cours');
    } catch {
      setDeleting(false);
      setConfirmOpen(false);
      alert('Suppression impossible.');
    }
  };

  if (loading) return <LoadingState />;
  if (error || !cours) return <ErrorState message="Cours introuvable." />;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>{cours.titre}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip size="small" label={cours.matiereNom} />
            {cours.niveau && <Chip size="small" label={libelle(cours.niveau)} variant="outlined" />}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditOutlinedIcon />} onClick={() => navigate(`/enseignant/cours/${id}/modifier`)}>Modifier</Button>
          <Button startIcon={<DeleteOutlineIcon />} color="error" onClick={() => setConfirmOpen(true)}>Supprimer</Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', color: '#374151' }}>{cours.description}</Typography>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, mb: 2 }}>Ressources</Typography>
        <Stack spacing={1.5}>
          {cours.videoUrl && (
            <Button startIcon={<PlayCircleOutlineIcon />} onClick={() => ouvrirFichier(cours.videoUrl)} sx={{ justifyContent: 'flex-start', color: COLORS.primary }}>
              Regarder la vidéo
            </Button>
          )}
          {(cours.pdfs || []).map((pdf) => (
            <Button key={pdf.id} startIcon={<PictureAsPdfOutlinedIcon />}
                    onClick={() => ouvrirFichier(`/api/cours/${cours.id}/pdfs/${pdf.id}`)}
                    sx={{ justifyContent: 'flex-start', color: COLORS.primary }}>
              {pdf.nomFichier}
            </Button>
          ))}
          {cours.pptUrl && (
            <Button startIcon={<SlideshowOutlinedIcon />} onClick={() => ouvrirFichier(cours.pptUrl)} sx={{ justifyContent: 'flex-start', color: COLORS.primary }}>
              Ouvrir la présentation
            </Button>
          )}
          {!cours.videoUrl && (cours.pdfs || []).length === 0 && !cours.pptUrl && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: '#94A3B8', fontStyle: 'italic' }}>
              Aucune ressource ajoutée pour ce cours.
            </Typography>
          )}
        </Stack>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer ce cours ?"
        description="Cette action supprime aussi les fichiers associés (vidéo, PDF, PPT). Elle est irréversible."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        loading={deleting}
      />
    </Box>
  );
}
