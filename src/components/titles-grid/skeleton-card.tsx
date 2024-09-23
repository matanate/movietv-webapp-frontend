import * as React from 'react';
import { Grid, Skeleton } from '@mui/material';
import _ from 'lodash';

/**
 * Renders a skeleton card component.
 * @returns The JSX element representing the skeleton card.
 */
function SkeletonCard(): React.JSX.Element {
  return <Skeleton variant="rectangular" sx={{ height: '200px', width: '150px', borderRadius: '20px' }} />;
}

/**
 * Renders multiple skeleton cards in a grid layout.
 * @param count - The number of skeleton cards to render, defaults to 10.
 * @returns The JSX element representing the skeleton cards grid.
 */
function SkeletonCards({ count = 10 }: { count?: number }): React.JSX.Element {
  const skeletonItems = Array.from({ length: count }, () => _.uniqueId());
  return (
    <>
      {skeletonItems.map((key) => (
        <Grid key={key} item xs="auto" justifyContent="center" alignItems="center">
          <SkeletonCard />
        </Grid>
      ))}
    </>
  );
}
export default SkeletonCards;
