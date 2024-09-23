import * as React from 'react';
import type { Metadata } from 'next';
import { Typography } from '@mui/material';

import { config } from '@/config';
import TitlesGrid from '@/components/titles-grid/titles-grid';

export const metadata = { title: `Movies | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <Typography padding={2} variant="h3" gutterBottom>
        Movies:
      </Typography>
      <TitlesGrid recordVariant="movie" paginate filterSort />
    </>
  );
}
