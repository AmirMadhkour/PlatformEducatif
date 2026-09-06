import { useEffect, useState } from 'react';
import publicService from '../services/publicService';



let niveauxCache = null;
let niveauxPromise = null;

export function useNiveauLabels() {
  const [niveaux, setNiveaux] = useState(niveauxCache || []);

  useEffect(() => {
    if (niveauxCache) return;
    if (!niveauxPromise) {
      niveauxPromise = publicService.getNiveaux();
    }
    niveauxPromise.then((data) => {
      niveauxCache = data;
      setNiveaux(data);
    }).catch(() => {});
  }, []);

  const libelle = (valeur) => niveaux.find((n) => n.valeur === valeur)?.libelle || valeur;

  return { niveaux, libelle };
}
