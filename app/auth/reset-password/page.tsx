import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

import { Layout } from '../../../src/components/auth/layout';

export const metadata = { title: `Reset password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
}
