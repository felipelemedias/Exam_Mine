import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase';

// Type for user data
export interface UserData {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  uid: string;
}

// Convert Firebase User to app UserData
const mapUserData = (user: FirebaseUser): UserData => {
  return {
    email: user.email || '',
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
  };
};

const authService = {
  // Login with Google
  loginWithGoogle: async (): Promise<UserData> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return mapUserData(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: (): Promise<UserData | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(mapUserData(user));
        } else {
          resolve(null);
        }
      });
    });
  },

  // Get ID token for API calls
  getIdToken: async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  },

  // Verify token with backend (placeholder)
  verifyTokenWithBackend: async (token: string): Promise<boolean> => {
    try {
      // TODO: Call the backend API to verify the token
      // const response = await fetch('/api/verify-token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // return response.ok;
      
      // For now, just return true if we have a token
      return !!token;
    } catch (error) {
      console.error('Error verifying token with backend:', error);
      return false;
    }
  }
};

export default authService;