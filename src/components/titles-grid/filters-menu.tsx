import * as React from 'react';
import { FilterAlt } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, Menu, MenuItem, OutlinedInput, Select, Slider } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import _ from 'lodash';

import { useRecords } from '@/contexts/records-context';
import type { FiltersDataMap, RecordType, TitleFilters } from '@/contexts/records-context';

interface FiltersMenuProps<T extends RecordType> {
  filters: FiltersDataMap[T];
  setFilters: (filters: FiltersDataMap[T]) => void;
}

/**
 * Component for displaying and managing filters for titles.
 *
 * @param props - The component props
 * @returns The component
 */
function FiltersMenu({ filters, setFilters }: FiltersMenuProps<'title'>): React.JSX.Element {
  const { data: allGenres } = useRecords('genre', 'all');
  const [anchorElFilter, setAnchorElFilter] = React.useState<null | HTMLElement>(null);
  const [localYearRange, setLocalYearRange] = React.useState<number[]>(filters.yearRange || [1900, 2024]);
  const [localRatingRange, setLocalRatingRange] = React.useState<number[]>(filters.ratingRange || [0, 10]);
  const [localGenres, setLocalGenres] = React.useState<number[]>(filters.genres || []);

  // Create a debounced version of the setFilters function
  const debouncedSetFilters = _.debounce((value: TitleFilters) => {
    setFilters({
      ...filters,
      ...value,
    });
  }, 300); // Adjust the debounce delay (in milliseconds) as needed

  // Cleanup function to cancel debounce on unmount
  React.useEffect(() => {
    return () => {
      debouncedSetFilters.cancel();
    };
  }, []);

  const openFilter = Boolean(anchorElFilter);

  /**
   * Handles the click event for the filter button.
   *
   * @param event - The click event.
   */
  const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorElFilter(event.currentTarget);
  };

  /**
   * Closes the filter menu.
   */
  const handleCloseFilter = (): void => {
    setAnchorElFilter(null);
  };

  /**
   * Event handler for year range filter change.
   * @param event - The event object.
   * @param newValue - The new value of the year range.
   */
  const handleYearFilterChange = (event: Event, newValue: number | number[]): void => {
    setLocalYearRange(newValue as number[]);
    debouncedSetFilters({ yearRange: newValue as [number, number] });
  };

  /**
   * Event handler for rating range filter change.
   * @param event - The event object.
   * @param newValue - The new value of the rating range.
   */
  const handleRatingFilterChange = (event: Event, newValue: number | number[]): void => {
    setLocalRatingRange(newValue as number[]);
    debouncedSetFilters({ ratingRange: newValue as [number, number] });
  };

  /**
   * Event handler for genre filter change.
   * @param event - The event object.
   */
  const handleGenreFilterChange = (event: SelectChangeEvent<typeof filters.genres>): void => {
    const {
      target: { value },
    } = event;
    const genresValue = typeof value === 'string' ? [] : value;
    setLocalGenres(genresValue || []);
    debouncedSetFilters({ genres: Array.isArray(genresValue) ? genresValue : [] });
  };

  // Handle Filter reset
  React.useEffect(() => {
    if (!_.isEqual(localYearRange, filters.yearRange)) {
      setLocalYearRange(filters.yearRange || [1900, 2024]);
    }
    if (!_.isEqual(localRatingRange, filters.ratingRange)) {
      setLocalRatingRange(filters.ratingRange || [0, 10]);
    }
    if (!_.isEqual(localGenres, filters.genres)) {
      setLocalGenres(filters.genres || []);
    }
  }, [filters]);

  return (
    <>
      <Button
        id="filter-button"
        title="Filter titles"
        aria-controls={openFilter ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openFilter ? 'true' : undefined}
        onClick={handleClickFilter}
      >
        <FilterAlt />
      </Button>
      <Menu
        id="filter-menu"
        open={openFilter}
        anchorEl={anchorElFilter}
        onClose={handleCloseFilter}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
      >
        <div>
          <Box p={2} sx={{ width: '400px', maxWidth: '100%' }}>
            Release Year:
            <Slider
              size="small"
              getAriaLabel={() => 'Release Year'}
              value={localYearRange}
              onChange={handleYearFilterChange}
              valueLabelDisplay="auto"
              min={1900}
              max={2024}
              sx={{
                width: '90%',
              }}
            />
          </Box>
          <Box p={2} sx={{ width: '400px', maxWidth: '100%' }}>
            Rating:
            <Slider
              size="small"
              getAriaLabel={() => 'Rating'}
              value={localRatingRange}
              onChange={handleRatingFilterChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              sx={{
                width: '90%',
              }}
            />
          </Box>
          <Box p={2} sx={{ width: '400px', maxWidth: '100%' }}>
            <FormControl sx={{ width: '400px', maxWidth: '100%' }}>
              <InputLabel id="genres-filter-label">Genres</InputLabel>
              <Select
                labelId="genres-filter-label"
                id="genres-filter"
                multiple
                value={localGenres}
                onChange={handleGenreFilterChange}
                input={<OutlinedInput label="Genres" />}
              >
                {allGenres?.map((genre) => (
                  <MenuItem key={`genre-${genre.id?.toString() ?? ''}`} value={genre.id}>
                    {genre.genreName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </Menu>
    </>
  );
}

export default FiltersMenu;
