import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { SignInForm } from '@/components/auth/sign-in-form';

import { ThemeProvider } from '../core/theme-provider/theme-provider';

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/alert-context', () => ({
  useAlert: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: jest.fn(() => <button>Sign in with Google</button>),
}));

describe('SignInForm', () => {
  const mockLoginUser = jest.fn();
  const mockGoogleLoginUser = jest.fn();
  const mockShowAlert = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      loginUser: mockLoginUser,
      googleLoginUser: mockGoogleLoginUser,
      loading: false,
    });
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it('renders sign in form with email and password fields', () => {
    renderWithProviders(<SignInForm />);

    const emailField = screen.getByLabelText('Email');
    const passwordField = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign in' });

    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    renderWithProviders(<SignInForm />);

    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('calls loginUser with correct values on form submission', async () => {
    renderWithProviders(<SignInForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('disables the submit button when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      loginUser: mockLoginUser,
      googleLoginUser: mockGoogleLoginUser,
      loading: true,
    });

    renderWithProviders(<SignInForm />);

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  it('redirects to sign up page on sign up link click', () => {
    renderWithProviders(<SignInForm />);

    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');
  });

  it('redirects to reset password page on forgot password link click', () => {
    renderWithProviders(<SignInForm />);

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toHaveAttribute('href', '/auth/reset-password');
  });
});
