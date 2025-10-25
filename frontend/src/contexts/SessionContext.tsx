'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionContextType {
  sessionId: string | null;
  isLoggedIn: boolean;
  setSessionId: (id: string) => void;
  signOut: () => void;
  deleteSession: () => void;
  isInitialized: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage and sessionStorage on mount (client-side only)
  useEffect(() => {
    const storedSessionId = localStorage.getItem('llm-lab-session-id');
    const loggedIn = sessionStorage.getItem('isLoggedIn');

    if (storedSessionId) {
      setSessionIdState(storedSessionId);
    }
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }

    setIsInitialized(true);
  }, []);

  // Update localStorage when sessionId changes
  const setSessionId = (id: string) => {
    localStorage.setItem('llm-lab-session-id', id);
    sessionStorage.setItem('isLoggedIn', 'true');
    setSessionIdState(id);
    setIsLoggedIn(true);
  };

  // Sign out - clear logged-in state but keep session ID for recovery
  const signOut = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // Delete session - permanently clear everything
  const deleteSession = () => {
    localStorage.removeItem('llm-lab-session-id');
    sessionStorage.removeItem('isLoggedIn');
    setSessionIdState(null);
    setIsLoggedIn(false);
  };

  return (
    <SessionContext.Provider value={{ sessionId, isLoggedIn, setSessionId, signOut, deleteSession, isInitialized }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
