import { z as zod } from 'zod';

// Sign in form schema
export const signInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});

// Sign up form schema
export const signUpSchema = zod
  .object({
    username: zod.string().min(1, { message: 'Username is required' }),
    firstName: zod.string().min(1, { message: 'First name is required' }),
    lastName: zod.string().min(1, { message: 'Last name is required' }),
    email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
    password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required' }),
    terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Token form schema
export const tokenSchema = zod.object({
  token: zod.string().min(1, { message: 'Token is required' }),
});

// Review form schema
export const reviewFormSchema = zod.object({
  rating: zod.number().min(1, { message: 'Rating is required' }),
  comment: zod.string().min(1, { message: 'Comment is required' }),
});
