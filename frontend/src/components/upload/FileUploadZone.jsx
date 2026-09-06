import { useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { COLORS } from '../../theme/theme';


export default function FileUploadZone({ label, accept, maxSizeLabel = '500 Mo max', file, onChange, required }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    if (files?.[0]) onChange(files[0]);
  };

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', mb: 1 }}>
        {label} {required && <Box component="span" sx={{ color: '#EF4444' }}>*</Box>}
      </Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        sx={{
          border: `2px dashed ${dragOver ? COLORS.primary : '#E5E7EB'}`,
          borderRadius: '16px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? 'rgba(21,101,192,0.03)' : '#FAFAFA',
        }}
      >
        <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handleFiles(e.target.files)} />
        <Stack alignItems="center" spacing={1}>
          {file ? (
            <>
              <CheckCircleOutlineIcon sx={{ color: '#10B981', fontSize: 28 }} />
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14 }}>{file.name}</Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#94A3B8' }}>Cliquez pour remplacer</Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 28 }} />
              <Typography sx={{ fontFamily: 'Inter', fontSize: 14, color: '#64748B' }}>
                Glissez-déposez ou cliquez pour choisir un fichier
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: 12, color: '#94A3B8' }}>{accept} · {maxSizeLabel}</Typography>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
