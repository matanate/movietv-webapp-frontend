import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';
import { AccountDetailsForm } from '@/components/account/account-details-form';

// Mock contexts and hooks
jest.mock('@/contexts/auth-context');
jest.mock('@/contexts/alert-context');
jest.mock('@/hooks/use-axios');

describe('AccountDetailsForm', () => {
  const mockShowAlert = jest.fn();
  const mockPatch = jest.fn();
  const mockGetUserData = jest.fn();

  // Setup the mocked contexts and hooks
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe' },
      getUserData: mockGetUserData,
      loading: false,
    });
    (useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });
    (useAxios as jest.Mock).mockReturnValue({ patch: mockPatch });
  });

  it('should render the form fields with default values', () => {
    render(<AccountDetailsForm />);

    // Assert that the form fields are rendered with default values
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Username')).toHaveValue('johndoe');
  });

  it('should display validation errors if required fields are missing', async () => {
    render(<AccountDetailsForm />);

    // Clear out the required fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: '' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    // Wait for the validation to kick in
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should call the API on form submit with correct data', async () => {
    render(<AccountDetailsForm />);

    // Change form fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'janesmith' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    // Wait for form submission
    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith('users/1/', {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
      });
    });

    // Ensure the user data is refreshed
    expect(mockGetUserData).toHaveBeenCalled();

    // Ensure a success alert is shown
    expect(mockShowAlert).toHaveBeenCalledWith({
      severity: 'success',
      message: 'Profile updated successfully',
    });
  });

  it('should show an error alert on API failure', async () => {
    // Mock the API call to fail
    mockPatch.mockRejectedValueOnce(new Error('An error occurred.'));

    render(<AccountDetailsForm />);

    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    // Wait for the error handling
    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith({
        severity: 'error',
        message: 'An error occurred.',
      });
    });
  });
});
