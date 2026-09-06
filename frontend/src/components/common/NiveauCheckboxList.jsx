import { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid } from '@mui/material';
import publicService from '../../services/publicService';


export default function NiveauCheckboxList({ value = [], onChange, label = 'Niveaux enseignés', error, helperText }) {
  const [niveaux, setNiveaux] = useState([]);

  useEffect(() => {
    publicService.getNiveaux().then(setNiveaux).catch(() => {});
  }, []);

  const toggle = (niveauValeur) => {
    const coche = value.includes(niveauValeur);
    onChange(coche ? value.filter((v) => v !== niveauValeur) : [...value, niveauValeur]);
  };

  return (
    <div>
      <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: error ? '#D32F2F' : 'rgba(26,35,126,0.7)', mb: 0.5 }}>
        {label}
      </FormLabel>
      <FormGroup>
        <Grid container>
          {niveaux.map((n) => (
            <Grid item xs={12} sm={6} key={n.valeur}>
              <FormControlLabel
                control={<Checkbox size="small" checked={value.includes(n.valeur)} onChange={() => toggle(n.valeur)} />}
                label={n.libelle}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </div>
  );
}
