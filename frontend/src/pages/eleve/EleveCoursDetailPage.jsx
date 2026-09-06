import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import coursService from '../../services/coursService';
import { LoadingState } from '../../components/common/SharedWidgets';
import { useNiveauLabels } from '../../hooks/useNiveauLabels';
import { COLORS } from '../../theme/theme';

export default function EleveCoursDetailPage() {
  const { libelle } = useNiveauLabels();
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursService
      .getById(id)
      .then(async (c) => {
        setCours(c);

        if (c.videoUrl) {
          const blob = await coursService.telechargerFichier(c.videoUrl);
          setVideoUrl(blob);
        }
      })
      .catch((err) => {
        setError(err.response?.status === 403 ? "Vous n'avez pas accès à ce cours." : 'Impossible de charger ce cours.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const ouvrirFichier = async (url) => {
    const blobUrl = await coursService.telechargerFichier(url);
    window.open(blobUrl, '_blank');
  };

  if (loading) return <LoadingState />;
  if (error) return <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>;
  if (!cours) return null;

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label={cours.matiereNom} />
        {cours.niveau && <Chip size="small" variant="outlined" label={libelle(cours.niveau)} />}
      </Stack>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground, mb: 0.5 }}>{cours.titre}</Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textMuted, mb: 3 }}>Enseignant : {cours.enseignantNomComplet}</Typography>

      <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', mb: 3, backgroundColor: 'black' }}>
        {videoUrl && (
          <video controls style={{ width: '100%', display: 'block', maxHeight: 480 }} src={videoUrl}>
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        )}
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', color: '#374151' }}>{cours.description}</Typography>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, mb: 2 }}>Documents</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {(cours.pdfs || []).map((pdf) => (
            <Button key={pdf.id} startIcon={<PictureAsPdfOutlinedIcon />} endIcon={<DownloadIcon />} variant="outlined"
                    onClick={() => ouvrirFichier(`/api/cours/${cours.id}/pdfs/${pdf.id}`)}>
              {pdf.nomFichier}
            </Button>
          ))}
          {cours.pptUrl && (
            <Button startIcon={<SlideshowOutlinedIcon />} endIcon={<DownloadIcon />} variant="outlined" onClick={() => ouvrirFichier(cours.pptUrl)}>
              Télécharger le PPT
            </Button>
          )}
          {(cours.pdfs || []).length === 0 && !cours.pptUrl && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: '#94A3B8', fontStyle: 'italic' }}>
              Aucun document disponible pour ce cours.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
