'use client';

import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';

import type {
  AuthAction,
  AuthContextType,
  AuthState,
  AuthTokens,
  JWTPayload,
  SignInValues,
  SignUpSubmitValues,
} from '@/types/auth';
import type { User } from '@/types/user';
import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import useAxios from '@/hooks/use-axios';
import useLocalStorage from '@/hooks/use-local-storage';

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Define the initial state for the authentication context
const initialState: AuthState = {
  user: null,
  loading: true,
};

// Define the authentication reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Define the authentication provider component
export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const { showAlert } = useAlert();
  const [authTokens, setAuthTokens] = useLocalStorage<AuthTokens | null>('authTokens', null);
  const api = useAxios();

  const previousTokensRef = useRef<AuthTokens | null>(null);

  // Fetch user data from the API
  const getUserData = async (): Promise<void> => {
    setLoading(true);
    if (authTokens) {
      const { user_id: userId } = jwtDecode<JWTPayload>(authTokens.access);
      try {
        const response = await api.get(`users/${userId.toString()}/`);
        setUser(response.data as User);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  // Set the user in the authentication state
  const setUser = (user: User | null): void => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  // Set the loading state in the authentication state
  const setLoading = (loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  // Login user with email and password
  const loginUser = async ({ email, password }: SignInValues): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post('token/', { email, password });
      const data = response.data as AuthTokens;
      setAuthTokens(data);
    } catch (error) {
      // Show an error alert
      if (error instanceof AxiosError) {
        if (typeof error.response?.data === 'string' || isStringRecord(error.response?.data)) {
          showAlert({ severity: 'error', message: error.response?.data });
        } else {
          showAlert({ severity: 'error', message: 'An error occurred.' });
        }
      } else {
        showAlert({ severity: 'error', message: 'An error occurred.' });
      }
      setLoading(false);
    }
  };

  // Configure Google One Tap login
  useGoogleOneTapLogin({
    disabled: authTokens !== null,
    onSuccess: async ({ credential }) => {
      await googleLoginUser({ credential });
    },
  });

  // Login user with Google credential
  const googleLoginUser = async ({ credential }: { credential: string | undefined }): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post('auth/google/', { credential });
      const data = response.data as AuthTokens;
      setAuthTokens(data);
    } catch (error) {
      // Show an error alert
      if (error instanceof AxiosError) {
        if (typeof error.response?.data === 'string' || isStringRecord(error.response?.data)) {
          showAlert({ severity: 'error', message: error.response?.data });
        } else {
          showAlert({ severity: 'error', message: 'An error occurred.' });
        }
      } else {
        showAlert({ severity: 'error', message: 'An error occurred.' });
      }
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = (): void => {
    setAuthTokens(null);
  };

  // Create a new user
  const createUser = async ({
    username,
    email,
    firstName,
    lastName,
    password,
    token,
  }: SignUpSubmitValues): Promise<void> => {
    setLoading(true);
    try {
      await api.post('users/', {
        username,
        email,
        firstName,
        lastName,
        password,
        token,
      });
      showAlert({ severity: 'success', message: 'You have successfully registered.' });
      await loginUser({ email, password });
    } catch (error) {
      // Show an error alert
      if (error instanceof AxiosError) {
        if (typeof error.response?.data === 'string' || isStringRecord(error.response?.data)) {
          showAlert({ severity: 'error', message: error.response?.data });
        } else {
          showAlert({ severity: 'error', message: 'An error occurred.' });
        }
      } else {
        showAlert({ severity: 'error', message: 'An error occurred.' });
      }
      setLoading(false);
    }
  };

  // Reset user password
  const resetPassword = async ({
    token,
    email,
    newPassword,
  }: {
    token: string;
    email: string;
    newPassword: string;
  }): Promise<void> => {
    setLoading(true);
    try {
      await api.post('password-reset/', {
        token,
        email,
        newPassword,
      });
      showAlert({ severity: 'success', message: 'Your password has been reset.' });
      router.push('/auth/sign-in');
    } catch (error) {
      // Show an error alert
      if (error instanceof AxiosError) {
        if (typeof error.response?.data === 'string' || isStringRecord(error.response?.data)) {
          showAlert({ severity: 'error', message: error.response?.data });
        } else {
          showAlert({ severity: 'error', message: 'An error occurred.' });
        }
      } else {
        showAlert({ severity: 'error', message: 'An error occurred.' });
      }
    }
    setLoading(false);
  };

  // Fetch user data when authTokens change
  useEffect(() => {
    if (!_.isEqual(authTokens, previousTokensRef.current)) {
      previousTokensRef.current = authTokens;
      void getUserData();
    }
  }, [authTokens]);

  // Fetch user data at mount
  useEffect(() => {
    void getUserData();
  }, []);

  // Create the value object for the authentication context
  const value: AuthContextType = {
    ...state,
    setAuthTokens,
    setLoading,
    loginUser,
    googleLoginUser,
    logoutUser,
    createUser,
    getUserData,
    resetPassword,
  };

  // Render the authentication context provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
