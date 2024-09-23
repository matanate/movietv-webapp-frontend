'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';

// Email form schema
const emailSchema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });
// Reset password form schema
const tokenSchema = zod
  .object({
    token: zod.string().min(1, { message: 'Token is required' }),
    newPassword: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Email form values
type EmailValues = zod.infer<typeof emailSchema>;
// Reset password form values
type TokenValues = zod.infer<typeof tokenSchema>;

const defaultEmailValues = { email: '' } satisfies EmailValues;
const defaultTokenValues = { token: '', newPassword: '', confirmPassword: '' } satisfies TokenValues;

/**
 * Component for resetting password, includes two stages:
 * 1. User enters their email address
 * 2. User enters token and new password

 *
 * @returns JSX.Element - Reset password form
 */
export function ResetPasswordForm(): React.JSX.Element {
  // Access authentication context
  const { resetPassword, loading, user } = useAuth();

  // Define state for form stages and email address
  const [stage, setStage] = React.useState<1 | 2>(1);
  const [email, setEmail] = React.useState<string>('');
  const [timeLeft, setTimeLeft] = React.useState(180);

  const api = useAxios();
  const { showAlert } = useAlert();

  // Set up interval for counting down token expiration time
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

  // Set up forms for email and token submission
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailValues>({
    defaultValues: !user ? defaultEmailValues : { email: user.email },
    resolver: zodResolver(emailSchema),
  });

  const {
    control: tokenControl,
    handleSubmit: handleTokenSubmit,
    formState: { errors: tokenErrors },
  } = useForm<TokenValues>({ defaultValues: defaultTokenValues, resolver: zodResolver(tokenSchema) });

  // Handle email submission
  const onEmailSubmit = React.useCallback(
    async (values: EmailValues): Promise<void> => {
      const { email: emailValue } = values;
      try {
        await api.post(`validation/`, { type: 'resetPassword', emailValue });
        setEmail(emailValue);
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
      }
    },
    [api, showAlert]
  );

  // Handle token submission
  const onTokenSubmit = React.useCallback(
    async (values: TokenValues): Promise<void> => {
      const { token, newPassword } = values;
      await resetPassword({ token, newPassword, email });
    },
    [resetPassword, email]
  );

  // Handle token resend
  const onResend = React.useCallback(async (): Promise<void> => {
    if (email) {
      try {
        await api.post(`validation/`, { type: 'resetPassword', email });
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
    }
  }, [email, api]);

  return (
    <Stack spacing={4}>
      <Typography variant="h5">
        {/* Display appropriate form heading based on stage */}
        {stage === 1 ? 'Reset password' : 'Verify token and reset password'}
      </Typography>

      {stage === 1 ? (
        // Email form
        <form key="form-1" onSubmit={handleEmailSubmit(onEmailSubmit)}>
          <Stack spacing={2}>
            {/* Email input */}
            <Controller
              control={emailControl}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(emailErrors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" disabled={!user} />
                  {emailErrors.email ? <FormHelperText>{emailErrors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {emailErrors.root ? <Alert color="error">{emailErrors.root.message}</Alert> : null}
            {/* Send recovery token button */}
            <Button disabled={loading} type="submit" variant="contained">
              Send recovery Token
            </Button>
          </Stack>
        </form>
      ) : (
        // Reset password form
        <form key="form-2" onSubmit={handleTokenSubmit(onTokenSubmit)}>
          <Stack spacing={2}>
            {/* Email input disabled */}
            <FormControl>
              <InputLabel>Email address</InputLabel>
              <OutlinedInput value={email} label="Email address" type="email" disabled />
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
            {/* New password input */}
            <Controller
              control={tokenControl}
              name="newPassword"
              render={({ field }) => (
                <FormControl error={Boolean(tokenErrors.newPassword)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="newPassword" type="password" />
                  {tokenErrors.newPassword ? <FormHelperText>{tokenErrors.newPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* Confirm password input */}
            <Controller
              control={tokenControl}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(tokenErrors.confirmPassword)}>
                  <InputLabel>Confirm password</InputLabel>
                  <OutlinedInput {...field} label="Confirm password" type="password" />
                  {tokenErrors.confirmPassword ? (
                    <FormHelperText>{tokenErrors.confirmPassword.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            {tokenErrors.root ? <Alert color="error">{tokenErrors.root.message}</Alert> : null}
            {/* Token expiration countdown */}
            {timeLeft > 0 && (
              <Typography color="text.secondary" variant="body2">
                Token will expire in {Math.floor(timeLeft / 60).toString()}:
                {timeLeft % 60 < 10 ? `0${(timeLeft % 60).toString()}` : (timeLeft % 60).toString()}
              </Typography>
            )}
            {/* Submit button */}
            <Button disabled={loading || timeLeft <= 0} type="submit" variant="contained">
              Reset password
            </Button>
            {/* Resend token link */}
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
            {/* Back to password reset link */}
            <Typography color="text.secondary" variant="body1">
              <Link
                component="button"
                onClick={() => {
                  setStage(1);
                }}
              >
                Back to password reset
              </Link>
            </Typography>
          </Stack>
        </form>
      )}
    </Stack>
  );
}
