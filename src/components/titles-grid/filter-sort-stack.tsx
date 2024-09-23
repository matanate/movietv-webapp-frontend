import * as React from 'react';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';

import { useRecords } from '@/contexts/records-context';
import type { FiltersDataMap, RecordType, RecordVariant, TitleFilters } from '@/contexts/records-context';
import FiltersMenu from '@/components/titles-grid/filters-menu';
import SortMenu from '@/components/titles-grid/sort-menu';

interface FilterSortStackProps<T extends RecordType> {
  orderBy: string | null; // The current sorting order
  isAscending: boolean; // Whether the sorting order is ascending or descending
  setOrderBy: (orderBy: string) => void; // Function to set the sorting order
  setIsAscending: (isAscending: boolean) => void; // Function to set the sorting order direction
  filters: FiltersDataMap[T]; // The current filters applied
  setFilters: (filters: FiltersDataMap[T]) => void; // Function to set the filters
  recordType: T; // The type of record (e.g., title, review)
  recordVariant: RecordVariant; // The variant of the record
}

/**
 * Component for displaying and managing filter and sort options.
 *
 * @param orderBy - The current sorting order
 * @param isAscending - Whether the sorting order is ascending or descending
 * @param setOrderBy - Function to set the sorting order
 * @param setIsAscending - Function to set the sorting order direction
 * @param filters - The current filters applied
 * @param setFilters - Function to set the filters
 * @param recordType - The type of record (e.g., title, review)
 * @param recordVariant - The variant of the record
 *
 * @returns JSX.Element - The filter and sort options stack component
 */
function FilterSortStack<T extends RecordType>({
  orderBy,
  isAscending,
  setOrderBy,
  setIsAscending,
  filters,
  setFilters,
  recordType,
  recordVariant,
}: FilterSortStackProps<T>): React.JSX.Element {
  /**
   * Determines if the filters are for titles.
   *
   * @param filters - The filters to check
   * @returns Whether the filters are for titles
   */
  function isTitleFilters(_filters: FiltersDataMap[T]): _filters is TitleFilters {
    return recordType === 'title';
  }
  /**
   * Resets the filters and sorting options to their default values.
   */
  const handleFilterReset = (): void => {
    if (isTitleFilters(filters)) {
      const { genres: _genres, yearRange: _yearRange, ratingRange: _ratingRange, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({});
    }
    setOrderBy(recordType === 'title' ? 'rating' : recordType === 'review' ? 'datePosted' : '');
    setIsAscending(false);
  };

  const { data: allGenres } = useRecords('genre', 'all');

  return (
    <Stack direction="row" justifyContent="left" spacing={1}>
      <Grid container spacing={1} sx={{ marginRight: 'auto', verticalAlign: 'middle' }}>
        {orderBy ? (
          <Grid item xs="auto">
            {/* Display the current sorting order */}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.secondary"
              sx={{ marginRight: 'auto', verticalAlign: 'middle' }}
            >
              {`Sort by: ${orderBy.replace(/[a-z][A-Z]/g, (match) => `${match[0]} ${match[1]}`).replace(/^\w/, (char) => char.toUpperCase())}`}
              <IconButton
                size="small"
                onClick={() => {
                  setIsAscending(!isAscending);
                }}
              >
                {/* Display the sorting order direction */}
                {isAscending ? (
                  <KeyboardDoubleArrowDown fontSize="small" sx={{ verticalAlign: 'middle' }} />
                ) : (
                  <KeyboardDoubleArrowUp fontSize="small" sx={{ verticalAlign: 'middle' }} />
                )}
              </IconButton>
            </Typography>
            <Button
              id="remove-sort"
              size="small"
              title="Remove sort"
              aria-controls="remove-sort"
              sx={{ verticalAlign: 'middle', minWidth: '10px', width: '25px', height: '25px' }}
              onClick={() => {
                // Reset the sorting options
                setOrderBy(recordType === 'title' ? 'rating' : recordType === 'review' ? 'datePosted' : '');
                setIsAscending(false);
              }}
            >
              X
            </Button>
          </Grid>
        ) : null}
        {isTitleFilters(filters) && (
          <>
            {filters?.yearRange ? (
              <Grid item xs="auto">
                {/* Display the year filter */}
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ marginRight: 'auto', verticalAlign: 'middle' }}
                >
                  {`Year: ${filters?.yearRange[0].toString()} - ${filters?.yearRange[1].toString()}`}
                </Typography>
                <Button
                  id="remove-year-filter"
                  size="small"
                  title="Remove year filter"
                  aria-controls="remove-year-filter"
                  sx={{ verticalAlign: 'middle', minWidth: '10px', width: '25px', height: '25px' }}
                  onClick={() => {
                    const { yearRange: _yearRange, ...rest } = filters;
                    setFilters(rest);
                  }}
                >
                  X
                </Button>
              </Grid>
            ) : null}
            {filters?.ratingRange ? (
              <Grid item xs="auto">
                {/* Display the rating filter */}
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ marginRight: 'auto', verticalAlign: 'middle' }}
                >
                  {`Rating: ${filters?.ratingRange[0].toString()} - ${filters?.ratingRange[1].toString()}`}
                </Typography>
                <Button
                  id="remove-rating-filter"
                  size="small"
                  title="Remove rating filter"
                  aria-controls="remove-rating-filter"
                  sx={{ verticalAlign: 'middle', minWidth: '10px', width: '25px', height: '25px' }}
                  onClick={() => {
                    const { ratingRange: _ratingRange, ...rest } = filters;
                    setFilters(rest);
                  }}
                >
                  X
                </Button>
              </Grid>
            ) : null}
            {filters?.genres ? (
              <Grid item xs="auto">
                {/* Display the genre filter */}
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ marginRight: 'auto', verticalAlign: 'middle' }}
                >
                  {`Genres: ${filters?.genres
                    ?.map((genreId: number) => allGenres?.find((g) => g.id === genreId)?.genreName)
                    .join(', ')}`}
                </Typography>
                <Button
                  id="remove-genre-filter"
                  size="small"
                  title="Remove genre filter"
                  aria-controls="remove-genre-filter"
                  sx={{ verticalAlign: 'middle', minWidth: '10px', width: '25px', height: '25px' }}
                  onClick={() => {
                    const { genres: _genres, ...rest } = filters;
                    setFilters(rest);
                  }}
                >
                  X
                </Button>
              </Grid>
            ) : null}
          </>
        )}
      </Grid>
      {recordType === 'title' ? (
        <Button
          id="filter-reset"
          title="Reset filter"
          aria-controls="filter-reset"
          aria-haspopup="true"
          onClick={handleFilterReset}
        >
          Reset
        </Button>
      ) : null}
      {isTitleFilters(filters) && <FiltersMenu filters={filters} setFilters={setFilters} />}
      <SortMenu
        orderBy={orderBy}
        isAscending={isAscending}
        setOrderBy={setOrderBy}
        setIsAscending={setIsAscending}
        recordType={recordType}
        recordVariant={recordVariant}
      />
    </Stack>
  );
}

export default FilterSortStack;
