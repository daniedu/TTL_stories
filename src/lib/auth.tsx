"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "firebase/auth";
import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { getAuth } from "./firebase";
import { MOCK_USER } from "./mockData";

const IS_MOCK = typeof window !== "undefined" && (
  new URLSearchParams(window.location.search).has("mock") ||
  (window as any).__MOCK_MODE__
);

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_MOCK) {
      setUser(MOCK_USER as unknown as User);
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setLoading(false);
      } else {
        signInAnonymously(auth)
          .then((cred) => setUser(cred.user))
          .finally(() => setLoading(false));
      }
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (IS_MOCK) return;
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      if (IS_MOCK) {
        setUser({ ...MOCK_USER, displayName: name } as unknown as User);
        return;
      }
      const auth = getAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      setUser({ ...cred.user, displayName: name } as User);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (IS_MOCK) {
      setUser(null);
      return;
    }
    const auth = getAuth();
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
