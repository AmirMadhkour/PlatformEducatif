import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import enseignantService from '../../services/enseignantService';
import publicService from '../../services/publicService';
import { useProfile } from '../../context/ProfileContext';
import { COLORS } from '../../theme/theme';



export default function CiblageCoursFields({ control, setValue, matiereId, typeCours = 'GROUPE', defaultCibleType = 'NIVEAU', defaultNiveau, defaultEleveIds = [] }) {
  const { profile, loading: profileLoading } = useProfile();
  const mesNiveaux = profile?.niveaux || [];
  const [mesEleves, setMesEleves] = useState([]);
  const [libellesNiveaux, setLibellesNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const estIndividuel = typeCours === 'INDIVIDUEL';

  useEffect(() => {
    Promise.all([enseignantService.getMesEleves(), publicService.getNiveaux()])
      .then(([eleves, niveaux]) => {
        setMesEleves(eleves);
        setLibellesNiveaux(niveaux);
      })
      .finally(() => setLoading(false));
  }, []);




  useEffect(() => {
    if (estIndividuel && setValue) {
      setValue('cibleType', 'ELEVES');
      setValue('eleveIds', []);
    }
  }, [estIndividuel, setValue]);

  const libelle = (valeur) => libellesNiveaux.find((n) => n.valeur === valeur)?.libelle || valeur;

  const elevesPourMatiere = useMemo(() => {
    if (!matiereId) return [];
    return mesEleves.filter((e) =>
      (e.affectations || []).some((a) => String(a.matiereId) === String(matiereId) && a.statut === 'AFFECTEE')
    );
  }, [mesEleves, matiereId]);

  if (!matiereId) {
    return (
      <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' }}>
        Choisissez une matière pour définir à qui ce cours est destiné.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#374151', mb: 0.5 }}>Destiné à</Typography>
        {estIndividuel ? (
          <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic', mb: 1 }}>
            Un cours individuel s'adresse à un seul élève.
          </Typography>
        ) : (
          <Controller
            name="cibleType"
            control={control}
            defaultValue={defaultCibleType}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="NIVEAU" control={<Radio size="small" />} label="Un niveau" />
                <FormControlLabel value="ELEVES" control={<Radio size="small" />} label="Des élèves spécifiques" />
              </RadioGroup>
            )}
          />
        )}
      </Box>

      <Controller
        name="cibleType"
        control={control}
        defaultValue={defaultCibleType}
        render={({ field: { value: cibleTypeBrut } }) => {
          const cibleType = estIndividuel ? 'ELEVES' : cibleTypeBrut;
          return (
            <>
              {cibleType === 'NIVEAU' && (
                !profileLoading && mesNiveaux.length === 0 ? (
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: '#B45309' }}>
                    Aucun niveau ne vous a été assigné par l'administration — contactez l'administration pour être habilité sur un niveau.
                  </Typography>
                ) : (
                  <Controller
                    name="cibleNiveau"
                    control={control}
                    defaultValue={defaultNiveau || ''}
                    rules={{ required: cibleType === 'NIVEAU' }}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth label="Niveau" size="small">
                        {mesNiveaux.map((n) => <MenuItem key={n} value={n}>{libelle(n)}</MenuItem>)}
                      </TextField>
                    )}
                  />
                )
              )}

              {cibleType === 'ELEVES' && (
                !loading && elevesPourMatiere.length === 0 ? (
                  <Typography sx={{ fontFamily: 'Inter', fontSize: 13, color: '#B45309' }}>
                    Aucun élève ne vous est affecté pour cette matière — impossible de cibler des élèves spécifiques ici pour le moment.
                  </Typography>
                ) : (
                  <Controller
                    name="eleveIds"
                    control={control}
                    defaultValue={defaultEleveIds}
                    rules={{ validate: (v) => cibleType !== 'ELEVES' || (v && v.length > 0) }}
                    render={({ field }) => (
                      <Stack sx={{ border: `1px solid ${COLORS.borderLight}`, borderRadius: '12px', p: 1.5, maxHeight: 220, overflowY: 'auto' }}>
                        {estIndividuel ? (
                          <RadioGroup
                            value={(field.value && field.value[0]) || ''}
                            onChange={(e) => field.onChange([e.target.value])}
                          >
                            {elevesPourMatiere.map((eleve) => (
                              <FormControlLabel
                                key={eleve.id}
                                value={String(eleve.id)}
                                control={<Radio size="small" />}
                                label={`${eleve.prenom} ${eleve.nom} — ${eleve.niveau ? libelle(eleve.niveau) : 'niveau non renseigné'}`}
                              />
                            ))}
                          </RadioGroup>
                        ) : (
                          elevesPourMatiere.map((eleve) => {
                            const checked = (field.value || []).map(String).includes(String(eleve.id));
                            return (
                              <FormControlLabel
                                key={eleve.id}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={checked}
                                    onChange={(e) => {
                                      const courant = field.value || [];
                                      field.onChange(
                                        e.target.checked
                                          ? [...courant, eleve.id]
                                          : courant.filter((id) => String(id) !== String(eleve.id))
                                      );
                                    }}
                                  />
                                }
                                label={`${eleve.prenom} ${eleve.nom} — ${eleve.niveau ? libelle(eleve.niveau) : 'niveau non renseigné'}`}
                              />
                            );
                          })
                        )}
                      </Stack>
                    )}
                  />
                )
              )}
            </>
          );
        }}
      />
    </Stack>
  );
}
