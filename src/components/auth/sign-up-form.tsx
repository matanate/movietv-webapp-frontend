'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorScheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GoogleLogin } from '@react-oauth/google';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';

import type { SignUpSubmitValues, SignUpValues, TokenValues } from '@/types/auth';
import { paths } from '@/paths';
import isStringRecord from '@/lib/is-string-record';
import { signUpSchema, tokenSchema } from '@/lib/zod-schemas';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';

const defaultValues = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
} satisfies SignUpValues;

const defaultTokenValues = {
  token: '',
} satisfies TokenValues;

/**
 * SignUpForm component
 *
 * Component for user registration, includes two stages:
 * 1. User enters their details and submits the form to get a token
 * 2. User enters token to complete registration
 *
 * @returns JSX.Element - Sign up form
 */
export function SignUpForm(): React.JSX.Element {
  // Context from AuthContext
  const { createUser, loading, googleLoginUser, setLoading } = useAuth();
  // State for form data, time left for token, and current stage of the form
  const [formData, setFormData] = React.useState<
    Omit<SignUpValues, 'terms' | 'confirmPassword'> | SignUpSubmitValues | null
  >(null);
  const [timeLeft, setTimeLeft] = React.useState(180);
  const [stage, setStage] = React.useState<1 | 2>(1);
  const api = useAxios();

  const { showAlert } = useAlert();

  const { mode: colorMode } = useColorScheme();
  // Refresh time left when stage changes and time left is greater than 0
  React.useEffect(() => {
    if (stage === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [stage, timeLeft]);

  // Initialize form with default values and validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({ defaultValues, resolver: zodResolver(signUpSchema) });

  // Initialize token form with default values and validation
  const {
    control: tokenControl,
    handleSubmit: handleTokenSubmit,
    formState: { errors: tokenErrors },
  } = useForm<TokenValues>({ defaultValues: defaultTokenValues, resolver: zodResolver(tokenSchema) });

  // Handle form submission in stage 1
  const onSubmit = React.useCallback(
    async (values: SignUpValues): Promise<void> => {
      const { username, firstName, lastName, email, password } = values;
      const submitValues = { username, firstName, lastName, email, password };
      setLoading(true);
      try {
        await api.post(`validation/`, { type: 'register', email });
        setFormData(submitValues);
        setStage(2);
        setTimeLeft(180);
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
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  // Handle token form submission in stage 2
  const onTokenSubmit = React.useCallback(
    async (values: TokenValues): Promise<void> => {
      if (formData) {
        await createUser({ ...formData, ...values });
      }
    },
    [createUser, formData]
  );

  // Resend token on click
  const onResend = React.useCallback(async (): Promise<void> => {
    try {
      await api.post(`validation/`, { type: 'register', email: formData?.email });
      setTimeLeft(180);
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
  }, [formData, api, showAlert]);

  // Render form based on stage
  return (
    <Stack spacing={3}>
      {stage === 1 ? (
        // Render sign up form title and sign in link
        <Stack spacing={1}>
          <Typography variant="h4">Sign up</Typography>
          <Typography color="text.secondary" variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
              Sign in
            </Link>
          </Typography>
          <GoogleLogin
            // place in center
            onSuccess={async ({ credential = '' }) => {
              await googleLoginUser({ credential });
            }}
            theme={colorMode === 'dark' ? 'filled_black' : 'outline'}
          />
        </Stack>
      ) : (
        // Render verification form title
        <Stack spacing={1}>
          <Typography variant="h4">Verify your email</Typography>
          <Typography color="text.secondary" variant="body2">
            We&apos;ve sent you an email with a verification token.
            <br />
            Enter the token to complete registration.
          </Typography>
        </Stack>
      )}
      {stage === 1 ? (
        // Render sign up form
        <form key="form-1" id="registration-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* Username input */}
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl error={Boolean(errors.username)}>
                  <InputLabel>Username</InputLabel>
                  <OutlinedInput {...field} label="Username" />
                  {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* First name input */}
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput {...field} label="First name" />
                  {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Last name input */}
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.lastName)}>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput {...field} label="Last name" />
                  {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Email input */}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
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
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Confirm password input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm password</InputLabel>
                  <OutlinedInput {...field} label="Confirm password" type="password" />
                  {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Terms and conditions checkbox */}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div>
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <React.Fragment>
                        I have read the <Link>terms and conditions</Link>
                      </React.Fragment>
                    }
                  />
                  {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                </div>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            {/* Submit button */}
            <Button disabled={loading} type="submit" variant="contained">
              Sign up
            </Button>
          </Stack>
        </form>
      ) : (
        // Render verification form
        <form key="form-2" id="validation-form" onSubmit={handleTokenSubmit(onTokenSubmit)}>
          <Stack spacing={2}>
            {/* Email input disabled */}
            <FormControl>
              <InputLabel>Email address</InputLabel>
              <OutlinedInput value={formData?.email} label="Email address" type="email" disabled />
            </FormControl>
            {/* Token input */}
            <Controller
              control={tokenControl}
              name="token"
              render={({ field }) => (
                <FormControl error={Boolean(tokenErrors.token)}>
                  <InputLabel>Token</InputLabel>
                  <OutlinedInput {...field} label="Token" />
                  {tokenErrors.token ? <FormHelperText>{tokenErrors.token.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Time left text */}
            {timeLeft > 0 && (
              <Typography color="text.secondary" variant="body2">
                Token will expire in {Math.floor(timeLeft / 60).toString()}:
                {timeLeft % 60 < 10 ? `0${(timeLeft % 60).toString()}` : (timeLeft % 60).toString()}
              </Typography>
            )}
            {/* Submit button */}
            <Button disabled={loading || timeLeft <= 0} type="submit" variant="contained">
              Verify Token
            </Button>
            {/* Resend button */}
            {timeLeft > 0 ? (
              <Typography color="text.secondary" variant="body2">
                Didn&apos;t receive a token?{' '}
                <Link component="button" onClick={onResend}>
                  Resend token
                </Link>
              </Typography>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Token expired!{' '}
                <Link component="button" onClick={onResend}>
                  Resend token
                </Link>
              </Typography>
            )}
            {/* Back to sign up link */}
            <Typography color="text.secondary" variant="body1">
              <Link
                component="button"
                onClick={() => {
                  setStage(1);
                }}
              >
                Back to sign up
              </Link>
            </Typography>
          </Stack>
        </form>
      )}
    </Stack>
  );
}
