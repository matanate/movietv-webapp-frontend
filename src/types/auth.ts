import type { z as zod } from 'zod';

import type { User } from '@/types/user';
import type { signInSchema, signUpSchema, tokenSchema } from '@/lib/zod-schemas';

// Define the types for authentication tokens and JWT payload
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface JWTPayload {
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
  is_staff: boolean;
}

// Define the state and actions for the authentication context
export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Define the sign in form values type
export type SignInValues = zod.infer<typeof signInSchema>;

// Sign up form values
export type SignUpValues = zod.infer<typeof signUpSchema>;
// Sign up submit values for user registration
export type SignUpSubmitValues = Omit<SignUpValues, 'terms' | 'confirmPassword'> & TokenValues;

// Token form values
export type TokenValues = zod.infer<typeof tokenSchema>;

export type AuthAction = { type: 'SET_USER'; payload: User | null } | { type: 'SET_LOADING'; payload: boolean };

// Define the authentication context type
export interface AuthContextType extends AuthState {
  setAuthTokens: (value: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  loginUser: ({ email, password }: SignInValues) => Promise<void>;
  googleLoginUser: ({ credential }: { credential: string }) => Promise<void>;
  logoutUser: () => void;
  createUser: ({ username, email, firstName, lastName, password, token }: SignUpSubmitValues) => Promise<void>;
  getUserData: () => Promise<void>;
  resetPassword: ({
    token,
    email,
    newPassword,
  }: {
    token: string;
    email: string;
    newPassword: string;
  }) => Promise<void>;
}
