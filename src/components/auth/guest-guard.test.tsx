// frontend/src/components/auth/__tests__/guest-guard.test.tsx
import { useRouter } from 'next/navigation';
import { render, screen, waitFor } from '@testing-library/react';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { GuestGuard } from '@/components/auth/guest-guard';

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

describe('GuestGuard', () => {
  const mockRouterBack = jest.fn();
  const mockShowAlert = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ back: mockRouterBack });
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to previous page with success alert if user is logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1, name: 'John Doe' }, loading: false });

    render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith({
        severity: 'success',
        message: 'You are logged in, redirect to previous page',
      });
      expect(mockRouterBack).toHaveBeenCalled();
    });

    expect(screen.queryByText('Guest Content')).not.toBeInTheDocument();
  });

  it('renders children if user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    expect(screen.getByText('Guest Content')).toBeInTheDocument();
    expect(mockShowAlert).not.toHaveBeenCalled();
    expect(mockRouterBack).not.toHaveBeenCalled();
  });

  it('renders nothing if user exists', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1, name: 'John Doe' }, loading: false });

    const { container } = render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
