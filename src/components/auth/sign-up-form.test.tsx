import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';

import { ThemeProvider } from '../core/theme-provider/theme-provider';
import { SignUpForm } from './sign-up-form';

// Mock the necessary hooks and components
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/alert-context', () => ({
  useAlert: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: jest.fn(() => <button>Sign in with Google</button>),
}));

jest.mock('@/hooks/use-axios', () => jest.fn());

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('SignUpForm', () => {
  const mockCreateUser = jest.fn();
  const mockGoogleLoginUser = jest.fn();
  const mockShowAlert = jest.fn();
  const mockSetLoading = jest.fn();
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn(); // Mock the axios POST method
    (useAxios as jest.Mock).mockReturnValue({ post: mockPost }); // Provide mock axios with `post` method
    (useAuth as jest.Mock).mockReturnValue({
      createUser: mockCreateUser,
      loading: false,
      googleLoginUser: mockGoogleLoginUser,
      setLoading: mockSetLoading,
    });
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-up form with the necessary fields', () => {
    renderWithProviders(<SignUpForm />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    // I have read the <Link>terms and conditions</Link>
    expect(screen.getByLabelText('I have read the terms and conditions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    renderWithProviders(<SignUpForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password should be at least 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('transitions to token input stage upon successful form submission', async () => {
    renderWithProviders(<SignUpForm />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('I have read the terms and conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    // Mock API success scenario
    mockPost.mockResolvedValueOnce({});

    await waitFor(() => {
      expect(screen.getByLabelText('Token')).toBeInTheDocument();
    });
  });

  it('do not transitions to token input stage upon failed form submission and shows error', async () => {
    renderWithProviders(<SignUpForm />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('I have read the terms and conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

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
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith({
        severity: 'error',
        message: { error: 'Invalid email address' },
      });
    });
  });

  it('shows validation error if token is empty in stage two', async () => {
    renderWithProviders(<SignUpForm />);

    // Simulate complete stage one to transition to stage two
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('I have read the terms and conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Token')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Verify Token' }));

    await waitFor(() => {
      expect(screen.getByText(/token is required/i)).toBeInTheDocument();
    });
  });

  it('calls createUser with correct values on form submission', async () => {
    renderWithProviders(<SignUpForm />);
    // Simulate complete stage one to transition to stage two
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('I have read the terms and conditions'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Token')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Token'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify Token' }));

    // verify createUser was called with correct values
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        token: '123456',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
    });
  });
});
