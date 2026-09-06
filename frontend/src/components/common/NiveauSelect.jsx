import { useEffect, useState } from 'react';
import { MenuItem, TextField } from '@mui/material';
import publicService from '../../services/publicService';


export default function NiveauSelect({ value, onChange, label = 'Niveau scolaire', error, helperText, ...props }) {
  const [niveaux, setNiveaux] = useState([]);

  useEffect(() => {
    publicService.getNiveaux().then(setNiveaux).catch(() => {});
  }, []);

  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      {...props}
    >
      {niveaux.map((n) => (
        <MenuItem key={n.valeur} value={n.valeur}>{n.libelle}</MenuItem>
      ))}
    </TextField>
  );
}
