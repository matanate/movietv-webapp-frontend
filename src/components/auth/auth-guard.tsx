'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';

export interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component is used to protect routes that require authentication.
 * If the user is not logged in, the component redirects the user to the sign in page.
 *
 * @param children - The children components.
 * @returns JSX.Element | null
 */
export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  // Get the Next.js router instance
  const router = useRouter();

  // Get the user and loading state from the AuthContext
  const { user, loading } = useAuth();

  // Get the showAlert function from the AlertContext
  const { showAlert } = useAlert();

  /**
   * Run the effect when either the user or loading state changes.
   * If the user is not logged in, show an alert and redirect to the sign in page.
   */
  useEffect(() => {
    if (!loading && !user) {
      // If the user is not logged in and the loading state is false

      // Show a warning alert to indicate that the user is not logged in
      showAlert({ severity: 'warning', message: 'User is not logged in. Redirecting to sign in.' });
      // Redirect the user to the sign in page
      router.replace(paths.auth.signIn);
    }
  }, [user, loading]);

  // If the user is loading or not logged in, return null to indicate that the component is not ready to render
  if (!user) return null;

  // Render the children components
  return <>{children}</>;
}
