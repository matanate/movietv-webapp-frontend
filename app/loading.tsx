import React from 'react';
import { LinearProgress } from '@mui/material';

export default function Loading(): React.JSX.Element {
  return (
    <LinearProgress
      sx={{
        position: 'relative',
        zIndex: 1200,
        marginTop: '-20px', // Offset the container padding
        marginLeft: '-24px',
        marginRight: '-24px',
      }}
    />
  );
}
