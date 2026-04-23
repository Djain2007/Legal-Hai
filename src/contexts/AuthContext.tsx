/**
 * AuthContext — provides an anonymous Supabase session to the entire app.
 * On first visit, Supabase creates a persistent anonymous user UUID stored in
 * localStorage. This gives each visitor a stable identity without a login form.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabaseClient';

interface AuthContextValue {
  user: User | null;
  userId: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: 'guest_user',
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    // Restore existing session or sign in anonymously
    supabaseClient.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else {
        // No session — sign in anonymously (creates a persistent UUID)
        const { data, error } = await supabaseClient!.auth.signInAnonymously();
        if (!error && data.user) {
          setUser(data.user);
        } else {
          // Anonymous sign-ins disabled or failed. Proceed with 'guest_user' safely.
          setUser(null);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.error('[AuthContext] Failed to initialize auth session:', err);
      setLoading(false); // Always resolve so the app doesn't hang
    });

    // Listen for auth changes (logout, token refresh, etc.)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = user?.id ?? 'guest_user';

  return (
    <AuthContext.Provider value={{ user, userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
