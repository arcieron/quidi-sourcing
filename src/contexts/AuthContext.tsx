import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (password: string) => boolean;
  signOut: () => void;
  // Keep these for compatibility
  user: { id: string } | null;
  session: { user: { id: string } } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = "GARNETATLAS";
const AUTH_KEY = "quidi_auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem(AUTH_KEY);
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signIn = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signOut = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  // Compatibility layer for existing code
  const user = isAuthenticated ? { id: "authenticated-user" } : null;
  const session = isAuthenticated ? { user: { id: "authenticated-user" } } : null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut, user, session }}>
      {children}
    </AuthContext.Provider>
  );
};
