import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

type Session = {
  user: {
    username: string;
    userNumber: string;
    location: Location.LocationObject;
  } | null;
  isLoading: boolean;
};

const SessionContext = createContext<Session & { setSession: (session: Session) => void }>({
  user: null,
  isLoading: true,
  setSession: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    async function loadSession() {
      const userInfo = await SecureStore.getItemAsync('userInfo');
      if (userInfo) {
        setSession({ user: JSON.parse(userInfo), isLoading: false });
      } else {
        setSession({ user: null, isLoading: false });
      }
    }

    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ ...session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
