import * as React from 'react';
import type { Metadata } from 'next';
import { Typography } from '@mui/material';

import { config } from '@/config';
import TitlesGrid from '@/components/titles-grid/titles-grid';

export const metadata = { title: `Search | ${config.site.name}` } satisfies Metadata;

type SearchParams = Record<string, string>;

export default function Page({ searchParams }: { searchParams: SearchParams }): React.JSX.Element {
  // take in mind %20 and other special characters
  const searchTerm = searchParams.q?.replace(/%20/g, ' ');
  // split genres by comma and turn to numbers

  const genres = searchParams.g?.split(',')?.map((genre) => Number(genre));
  return (
    <>
      {searchTerm && searchTerm !== '' ? (
        <Typography padding={2} variant="h3" gutterBottom>
          Search result for &quot;{searchTerm}&quot;:
        </Typography>
      ) : (
        <Typography padding={2} variant="h3" gutterBottom>
          Search result:
        </Typography>
      )}
      <TitlesGrid recordVariant="search" initialFilters={{ search: searchTerm, genres }} paginate filterSort />
    </>
  );
}
