import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

// Mocking useAuth, useAlert, and useAxios
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/contexts/alert-context', () => ({
  useAlert: jest.fn(),
}));
jest.mock('@/hooks/use-axios', () => jest.fn());

describe('ResetPasswordForm', () => {
  let mockPost: jest.Mock;
  let mockShowAlert: jest.Mock;
  let mockResetPassword: jest.Mock;
  let mockLoading: boolean;
  let mockUser: { email: string } | null;

  beforeEach(() => {
    mockPost = jest.fn(); // Mock the axios POST method
    mockShowAlert = jest.fn();
    mockResetPassword = jest.fn();
    mockLoading = false;
    mockUser = null;

    // Mock implementations for hooks
    (useAxios as jest.Mock).mockReturnValue({ post: mockPost }); // Provide mock axios with `post` method
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
    (useAuth as jest.Mock).mockReturnValue({
      resetPassword: mockResetPassword,
      loading: mockLoading,
      user: mockUser,
    });
  });

  it('renders email input form initially', () => {
    render(<ResetPasswordForm />);
    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toBeInTheDocument();
    const submitButton = screen.getByText('Send recovery Token');
    expect(submitButton).toBeInTheDocument();
  });

  it('field error is shown on empty email', async () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByText('Send recovery Token');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Email is required');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('submits email and transitions to token form', async () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByText('Send recovery Token');

    // Mock the API call for email submission
    mockPost.mockResolvedValueOnce({}); 

    // Simulate typing the email and submitting
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Wait for the form to transition to the token input form
    await waitFor(() => {
      const tokenInput = screen.getByLabelText('Token');
      expect(tokenInput).toBeInTheDocument();
    });
  });

  it('displays an error message on API failure', async () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByText('Send recovery Token');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Mocking an AxiosResponse object
    const mockResponse: AxiosResponse = {
      data: { error: 'Invalid email address' },
      status: 400,
      statusText: 'Bad Request',
      headers: {}, // Response headers
      config: {
        headers: {}, // Add this line
        method: 'post', // Add this line
        url: '', // Add this line
        // Add other required properties as needed
      } as InternalAxiosRequestConfig,
    };

    // Mock API failure scenario with an AxiosError including the mock response
    mockPost.mockRejectedValueOnce(new AxiosError('Request failed', '400', undefined, undefined, mockResponse));

    await waitFor(() => {
      // Check if the alert message is shown on failure
      expect(mockShowAlert).toHaveBeenCalledWith({
        severity: 'error',
        message: { error: 'Invalid email address' },
      });
    });
  });

  it('handles token form submission', async () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByText('Send recovery Token');

    // Mock the initial email submission API call
    mockPost.mockResolvedValueOnce({}); // Ensure the first API call is mocked

    // Simulate email input and form submission
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Wait for the form to show the token input
    await waitFor(() => {
      const tokenInput = screen.getByLabelText('Token');
      expect(tokenInput).toBeInTheDocument();
    });

    // Simulate entering the token and new password
    const tokenInput = screen.getByLabelText('Token');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');
    const resetButton = screen.getByText('Reset password');

    fireEvent.change(tokenInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });

    // Mock the reset password API call
    mockResetPassword.mockResolvedValueOnce({});

    fireEvent.click(resetButton);

    // Validate that resetPassword was called with the correct data
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: '123456',
        newPassword: 'newpassword',
        email: 'test@example.com',
      });
    });
  });
});
