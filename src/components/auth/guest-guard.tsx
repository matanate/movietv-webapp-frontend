'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';

export interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard is a higher order component that checks if the user is a guest.
 * If the user is not a guest, it redirects them to the home page with a success alert.
 * If the user is a guest, it renders the children components.
 *
 * @param children - The children components.
 * @returns React.JSX.Element | null - The rendered children components or null if the user is not a guest.
 */
export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  // Get the router and the user from the AuthContext
  const router = useRouter();
  const { user, loading } = useAuth();
  // Get the showAlert function from the AlertContext
  const { showAlert } = useAlert();

  // Use the React.useEffect hook to redirect the user to the home page if they are not a guest
  useEffect(() => {
    // If the user is not loading and exists
    if (!loading && user) {
      // Show a success alert and redirect the user to the home page
      showAlert({ severity: 'success', message: 'You are logged in, redirect to previous page' });
      // redirect to the previous page
      router.back();
    }
  }, [user, loading]);

  // If the user is loading or exists, return null to hide the children components
  if (user) return null;

  // Render the children components
  return <>{children}</>;
}
