export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  uid: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}