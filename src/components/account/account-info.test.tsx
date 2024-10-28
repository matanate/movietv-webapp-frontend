// frontend/src/components/account/__tests__/account-info.test.tsx
import { useRouter } from 'next/navigation';
import { fireEvent, render, screen } from '@testing-library/react';

import { useAuth } from '@/contexts/auth-context';
import { AccountInfo } from '@/components/account/account-info';

// Mock the necessary hooks and components
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('AccountInfo', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useAuth as jest.Mock).mockReturnValue({
      user: { firstName: 'John', lastName: 'Doe', username: 'johndoe' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<AccountInfo />);

    // Check if the avatar with the user's initials is rendered
    expect(screen.getByText('JD')).toBeInTheDocument();

    // Check if the username is rendered
    expect(screen.getByText('johndoe')).toBeInTheDocument();

    // Check if the full name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('navigates to the reset password page when button is clicked', () => {
    render(<AccountInfo />);

    // Find and click the reset password button
    fireEvent.click(screen.getByText('Reset password'));

    // Check if the router push function was called with the correct path
    expect(mockRouterPush).toHaveBeenCalledWith('/auth/reset-password');
  });
});
