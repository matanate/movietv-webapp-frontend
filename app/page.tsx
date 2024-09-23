import * as React from 'react';
import type { Metadata } from 'next';
import { Typography } from '@mui/material';

import { config } from '@/config';
import TitlesGrid from '@/components/titles-grid/titles-grid';

export const metadata = { title: config.site.name } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <Typography padding={2} variant="h3" gutterBottom>
        Top 10 Movies:
      </Typography>
      <TitlesGrid recordVariant="movie" />
      <Typography padding={2} variant="h3" gutterBottom>
        Top 10 Tv Shows:
      </Typography>
      <TitlesGrid recordVariant="tv" />
    </>
  );
}
