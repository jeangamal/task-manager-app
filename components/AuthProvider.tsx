"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextProps>({ user: null, session: null });

/**
 * AuthProvider wraps the app and exposes the current Supabase user and session.
 * It listens to auth state changes and updates context accordingly.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch the initial session on mount.
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    };
    getSession();

    // Listen for auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth returns the current user and session from context.
 */
export function useAuth() {
  return useContext(AuthContext);
}