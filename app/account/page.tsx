import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/account/account-details-form';
import { AccountInfo } from '@/components/account/account-info';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <AuthGuard>
      <Stack spacing={3}>
        <div>
          <Typography padding={2} variant="h4">
            Account
          </Typography>
        </div>
        <Grid container spacing={3}>
          <Grid size={{ lg: 4, md: 6, xs: 12 }}>
            <AccountInfo />
          </Grid>
          <Grid size={{ lg: 8, md: 6, xs: 12 }}>
            <AccountDetailsForm />
          </Grid>
        </Grid>
      </Stack>
    </AuthGuard>
  );
}
