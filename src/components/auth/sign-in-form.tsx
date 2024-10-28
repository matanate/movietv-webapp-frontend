'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorScheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GoogleLogin } from '@react-oauth/google';
import { Controller, useForm } from 'react-hook-form';

import type { SignInValues } from '@/types/auth';
import { paths } from '@/paths';
import { signInSchema } from '@/lib/zod-schemas';
import { useAuth } from '@/contexts/auth-context';

// Define the default form values
const defaultValues: SignInValues = {
  email: '',
  password: '',
};

/**
 * Sign in form component.
 *
 * @returns JSX.Element Sign in form
 */
export function SignInForm(): React.JSX.Element {
  // Get authentication context
  const { loginUser, googleLoginUser, loading } = useAuth();

  const { mode: colorMode } = useColorScheme();

  // Initialize form using react-hook-form library
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ defaultValues, resolver: zodResolver(signInSchema) });

  /**
   * Handle form submission.
   *
   * @param values - Form values
   * @returns Promise that resolves when form is submitted
   */
  const onSubmit = async (values: SignInValues): Promise<void> => {
    // Call loginUser function from authentication context
    await loginUser(values);
  };

  return (
    <Stack spacing={4}>
      {/* Form title and sign up link */}
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
        <GoogleLogin
          // Place in center
          onSuccess={async ({ credential = '' }) => {
            await googleLoginUser({ credential });
          }}
          theme={colorMode === 'dark' ? 'filled_black' : 'outline'}
        />
      </Stack>
      {/* Sign In form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Email input */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel htmlFor="emailInput">Email</InputLabel>
                <OutlinedInput {...field} id="emailInput" label="Email address" type="string" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/* Password input */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel htmlFor="passwordInput">Password</InputLabel>
                <OutlinedInput {...field} id="passwordInput" label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/* Forgot password link */}
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {/* Error message */}
          {errors.root && errors.root.message ? <Alert color="error">{errors.root.message}</Alert> : null}
          {/* Submit button */}
          <Button disabled={loading} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
