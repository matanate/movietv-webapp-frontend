'use client';

import * as React from 'react';
import { Box, Grid, TablePagination, Typography } from '@mui/material';

import { useRecords } from '@/contexts/records-context';
import type { FiltersDataMap, RecordVariant } from '@/contexts/records-context';
import FilterSortStack from '@/components/titles-grid/filter-sort-stack';
import SkeletonCards from '@/components/titles-grid/skeleton-card';
import TitleCard from '@/components/titles-grid/title-card';

/**
 * Component for displaying a grid of titles.
 *
 * @param recordVariant - The variant of titles to display ('movie', 'tv', 'all', 'search').
 * @param paginate - Whether to enable pagination.
 * @param filterSort - Whether to enable filtering and sorting.
 * @param initialFilters - Initial filters to apply.
 * @returns The JSX element representing the titles grid.
 */
function TitlesGrid({
  recordVariant,
  paginate = false,
  filterSort = false,
  initialFilters = {},
}: {
  recordVariant: RecordVariant;
  paginate?: boolean;
  filterSort?: boolean;
  initialFilters?: FiltersDataMap['title'];
}): React.JSX.Element {
  // Fetch titles and related data using the useRecords hook
  const {
    data: allTitles,
    count,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    orderBy,
    setOrderBy,
    isAscending,
    setIsAscending,
    loading,
    fetchData,
  } = useRecords('title', recordVariant, initialFilters);

  return (
    <>
      {/* Render filter and sort stack if enabled */}
      {filterSort && allTitles ? (
        <FilterSortStack
          orderBy={orderBy}
          isAscending={isAscending}
          setOrderBy={setOrderBy}
          setIsAscending={setIsAscending}
          filters={filters}
          setFilters={setFilters}
          recordType="title"
          recordVariant={recordVariant}
        />
      ) : null}
      {/* Render grid of title cards */}

      <Grid container spacing={2} my={4} justifyContent="center" alignItems="center">
        {loading ? (
          <SkeletonCards count={count < Number(pageSize) ? count : Number(pageSize)} />
        ) : !allTitles ? (
          <Typography variant="h5">No results found.</Typography>
        ) : (
          allTitles.map((title) => (
            <Grid
              item
              xs="auto"
              justifyContent="center"
              alignItems="center"
              key={`title-${title.id?.toString() ?? ''}`}
            >
              <TitleCard title={title} fetchTitles={fetchData} />
            </Grid>
          ))
        )}
      </Grid>

      {/* Render pagination component if enabled */}
      {paginate && allTitles ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={Number(pageSize)}
            page={(page || 1) - 1}
            onPageChange={(_event, newPage) => {
              setPage(newPage + 1);
            }}
            onRowsPerPageChange={(event) => {
              setPageSize(Number(event.target.value));
            }}
          />
        </Box>
      ) : null}
    </>
  );
}

export default TitlesGrid;
