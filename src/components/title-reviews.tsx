'use client';

import * as React from 'react';
import { Card, CardHeader, Grid, Skeleton, TablePagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import { useRecord } from '@/contexts/record-context';
import { useRecords } from '@/contexts/records-context';

import ReviewCard from './review-card';
import FilterSortStack from './titles-grid/filter-sort-stack';

/**
 * Component for displaying reviews of a title.
 * @param id - The ID of the title.
 * @returns JSX.Element - The rendered component.
 */
function TitleReviews({ id }: { id: number }): React.JSX.Element {
  // Fetch reviews and title data using custom hooks
  const {
    data: reviews,
    count,
    page,
    orderBy,
    isAscending,
    setIsAscending,
    setOrderBy,
    filters,
    setFilters,
    pageSize,
    setPage,
    setPageSize,
    loading,
    fetchData: fetchReviews,
  } = useRecords('review', 'title', { title: id });
  const { fetchData: fetchTitle } = useRecord('title', id);

  return (
    <Stack direction="column" spacing={2} padding={2}>
      {/* Title */}
      <Typography gutterBottom variant="h5">
        Reviews:
      </Typography>

      {/* Loading state */}
      {!reviews || loading ? (
        <Stack direction="row" spacing={2}>
          <Grid item xs="auto">
            <Skeleton variant="circular" width={40} height={40} sx={{ margin: '5px' }} />
          </Grid>
          <Grid item xs="auto">
            <Card>
              <CardHeader
                sx={{ padding: '10px' }}
                title={
                  <Box>
                    <Skeleton variant="text" width={200} height={30} />
                    <Skeleton variant="text" width={100} height={20} sx={{ marginTop: '5px' }} />
                  </Box>
                }
                subheader={<Skeleton variant="text" width={150} height={20} />}
              />
            </Card>
          </Grid>
        </Stack>
      ) : reviews.length === 0 ? (
        // No reviews
        <Stack direction="row" spacing={2}>
          <Typography variant="h6" sx={{ paddingLeft: '20px' }}>
            No reviews have been posted yet.
          </Typography>
        </Stack>
      ) : (
        // Display reviews
        <>
          {/* Filter and sort options */}
          <FilterSortStack
            orderBy={orderBy}
            isAscending={isAscending}
            setOrderBy={setOrderBy}
            setIsAscending={setIsAscending}
            filters={filters}
            setFilters={setFilters}
            recordType="review"
            recordVariant="title"
          />

          {/* Review cards */}
          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} fetchReviews={fetchReviews} fetchTitle={fetchTitle} />
          ))}

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={Number(pageSize)}
            page={(page || 1) - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);
            }}
            onRowsPerPageChange={(event) => {
              setPageSize(Number(event.target.value));
            }}
            sx={{ alignSelf: 'center' }}
          />
        </>
      )}
    </Stack>
  );
}

export default TitleReviews;
