import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser, supabase.auth]);

  return (
    <SupabaseContext.Provider value={null}>
      {children}
    </SupabaseContext.Provider>
  );
}