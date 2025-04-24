import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types/auth';
import authService from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Default auth state
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Create context
const AuthContext = createContext<{
  authState: AuthState;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  authState: defaultAuthState,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the user's ID token
          const token = await firebaseUser.getIdToken();
          
          // Map Firebase user to our User type
          const user: User = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          };
          
          // TODO: Verify the token with our backend API
          // For now, we'll just consider the user authenticated if we have a token
          // In a production app, you'd want to verify this token on your backend
          
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error processing authenticated user:', error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Failed to authenticate user',
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const userData = await authService.loginWithGoogle();
      
      // User is authenticated by Firebase at this point
      // The onAuthStateChanged listener will update the state
    } catch (error: any) {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || 'Failed to sign in with Google',
      }));
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      await authService.logout();
      // The onAuthStateChanged listener will update the state
    } catch (error: any) {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
        error: 'Failed to log out',
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};