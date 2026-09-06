import { createContext, useContext, useMemo, useState } from 'react';

const RegisterContext = createContext(null);

const INITIAL_INFOS = {
  nom: '',
  prenom: '',
  email: '',
  password: '',
  telephone: '',
  typeCoursGlobal: 'GROUPE',
};


export function RegisterProvider({ children }) {
  const [infosPersonnelles, setInfosPersonnelles] = useState(INITIAL_INFOS);
  const [niveau, setNiveauBrut] = useState('');
  const [typeBac, setTypeBacBrut] = useState('');
  const [paysBac, setPaysBac] = useState('');
  const [matieresSouhaitees, setMatieresSouhaitees] = useState([]);


  const setNiveau = (valeur) => {
    setNiveauBrut(valeur);
    if (valeur !== 'BACCALAUREAT') {
      setTypeBacBrut('');
      setPaysBac('');
    }
  };

  const setTypeBac = (valeur) => {
    setTypeBacBrut(valeur);
    if (valeur !== 'ETRANGER') {
      setPaysBac('');
    }
  };

  const reset = () => {
    setInfosPersonnelles(INITIAL_INFOS);
    setNiveauBrut('');
    setTypeBacBrut('');
    setPaysBac('');
    setMatieresSouhaitees([]);
  };

  const toggleMatiere = (matiereId) => {
    setMatieresSouhaitees((prev) => {
      const existe = prev.find((m) => m.matiereId === matiereId);
      if (existe) {
        return prev.filter((m) => m.matiereId !== matiereId);
      }
      return [...prev, { matiereId, typeCours: 'GROUPE' }];
    });
  };

  const setTypeCoursPourMatiere = (matiereId, typeCours) => {
    setMatieresSouhaitees((prev) =>
      prev.map((m) => (m.matiereId === matiereId ? { ...m, typeCours } : m))
    );
  };

  const bacInfoComplete = niveau !== 'BACCALAUREAT' || (typeBac === 'TUNISIEN') || (typeBac === 'ETRANGER' && !!paysBac);

  const value = useMemo(
    () => ({
      infosPersonnelles,
      setInfosPersonnelles,
      niveau,
      setNiveau,
      typeBac,
      setTypeBac,
      paysBac,
      setPaysBac,
      matieresSouhaitees,
      toggleMatiere,
      setTypeCoursPourMatiere,
      reset,
      
      etape1Complete: !!infosPersonnelles.email,
      etape2Complete: !!niveau && matieresSouhaitees.length > 0 && bacInfoComplete,
    }),
    [infosPersonnelles, niveau, typeBac, paysBac, matieresSouhaitees, bacInfoComplete]
  );

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
}

export function useRegister() {
  const ctx = useContext(RegisterContext);
  if (!ctx) {
    throw new Error('useRegister doit etre utilise a l\'interieur de <RegisterProvider>');
  }
  return ctx;
}
