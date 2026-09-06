import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import profileService from '../services/profileService';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);


export function ProfileProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetchProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    return profileService
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        return data;
      })
      .catch((err) => {
        setError(err);
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);



  useEffect(() => {
    if (isAuthenticated) {
      refetchProfile().catch(() => {});
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, refetchProfile]);

  const updateProfile = useCallback(async (payload) => {
    const misAJour = await profileService.updateMyProfile(payload);
    setProfile(misAJour);
    return misAJour;
  }, []);

  const value = useMemo(
    () => ({ profile, loading, error, refetchProfile, updateProfile }),
    [profile, loading, error, refetchProfile, updateProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile doit etre utilise a l'interieur de <ProfileProvider>");
  }
  return ctx;
}
