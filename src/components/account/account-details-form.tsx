'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';

// Define the validation schema using Zod
const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  username: zod.string().min(1, { message: 'Username is required' }),
});

// Define the default form values
const defaultValues = {
  firstName: '',
  lastName: '',
  username: '',
};

// Define the type for form values
export type Values = zod.infer<typeof schema>;

/**
 * Component for editing account details.
 *
 * @returns JSX.Element
 */
export function AccountDetailsForm(): React.JSX.Element {
  // Contexts
  const { user, getUserData, loading } = useAuth();
  const api = useAxios();
  // Form hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  // Custom hooks
  const { showAlert } = useAlert();

  /**
   * Handles form submission.
   *
   * @returns Promise<void>
   */
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // Send a PATCH request to update the user's profile
        await api.patch(`users/${user?.id ? user.id.toString() : ''}/`, values);
        // Refresh the user data
        await getUserData();
        // Show a success alert
        showAlert({ severity: 'success', message: 'Profile updated successfully' });
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
    },
    [api, getUserData, user]
  );

  // Effect hook
  React.useEffect(() => {
    // Update form control values when the user changes
    if (user) {
      setValue('firstName', user.firstName || '', { shouldDirty: true, shouldTouch: true });
      setValue('lastName', user.lastName || '', { shouldDirty: true, shouldTouch: true });
      setValue('username', user.username || '', { shouldDirty: true, shouldTouch: true });
    }
  }, [user]);

  // Render form
  return (
    // User profile form
    <form id="account-details-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Card */}
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* First name input */}
            <Grid md={6} xs={12}>
              {/* First name input */}
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.firstName)}>
                    {/* Input label */}
                    <InputLabel>First Name</InputLabel>
                    {/* Input */}
                    <OutlinedInput {...field} label="First Name" />
                    {/* Error message */}
                    {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            {/* Last name input */}
            <Grid md={6} xs={12}>
              {/* Last name input */}
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.lastName)}>
                    <InputLabel>Last Name</InputLabel>
                    <OutlinedInput {...field} label="Last Name" />
                    {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              {/* Username input */}
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.username)}>
                    <InputLabel>Username</InputLabel>
                    <OutlinedInput {...field} label="Username address" />
                    {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* Error message */}
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          {/* Submit button */}
          <Button disabled={loading} type="submit" variant="contained">
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
