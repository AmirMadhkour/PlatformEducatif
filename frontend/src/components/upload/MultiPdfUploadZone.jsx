import { useRef, useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../theme/theme';


export default function MultiPdfUploadZone({ label = 'Documents PDF', files = [], onChange }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const ajouterFichiers = (nouveauxFichiers) => {
    const pdfs = Array.from(nouveauxFichiers || []).filter((f) => f.type === 'application/pdf');
    onChange([...files, ...pdfs]);
  };

  const retirerFichier = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', mb: 1 }}>
        {label}
      </Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); ajouterFichiers(e.dataTransfer.files); }}
        sx={{
          border: `2px dashed ${dragOver ? COLORS.primary : '#E5E7EB'}`,
          borderRadius: '16px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? 'rgba(21,101,192,0.03)' : '#FAFAFA',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" multiple hidden onChange={(e) => ajouterFichiers(e.target.files)} />
        <Stack alignItems="center" spacing={1}>
          <CloudUploadOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 28 }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: '#64748B' }}>
            Glissez-déposez ou cliquez pour ajouter un ou plusieurs PDF
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#94A3B8' }}>.pdf · plusieurs fichiers possibles · optionnel</Typography>
        </Stack>
      </Box>

      {files.length > 0 && (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {files.map((f, index) => (
            <Stack key={`${f.name}-${index}`} direction="row" alignItems="center" justifyContent="space-between"
                   sx={{ p: 1.5, borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #F1F5F9' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ overflow: 'hidden' }}>
                <PictureAsPdfOutlinedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                <Typography sx={{ fontFamily: 'Inter', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {f.name}
                </Typography>
              </Stack>
              <IconButton size="small" onClick={() => retirerFichier(index)}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
