import { useRouter } from 'next/navigation';
import { render, screen, waitFor } from '@testing-library/react';

import { paths } from '@/paths';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { AuthGuard } from '@/components/auth/auth-guard';

// Mock the necessary hooks and components
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/alert-context', () => ({
  useAlert: jest.fn(),
}));

describe('AuthGuard', () => {
  const mockRouterReplace = jest.fn();
  const mockShowAlert = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to sign in page if user is not logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith({
        severity: 'warning',
        message: 'User is not logged in. Redirecting to sign in.',
      });
      expect(mockRouterReplace).toHaveBeenCalledWith(paths.auth.signIn);
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children if user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1, name: 'John Doe' }, loading: false });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockShowAlert).not.toHaveBeenCalled();
    expect(mockRouterReplace).not.toHaveBeenCalled();
  });

  it('renders nothing if user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    const { container } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
