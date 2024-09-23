'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import _ from 'lodash';

import type { Title } from '@/types/title';
import { useRecords } from '@/contexts/records-context';

interface SearchInputProps {
  openSearch: boolean; // Indicates whether the search input is open or not
  setOpenSearch: (open: boolean) => void; // Function to set the open state of the search input
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Event handler for key press events
}

/**
 * SearchInput component for searching titles.
 */
function SearchInput({ openSearch, setOpenSearch, handleKeyPress }: SearchInputProps): React.ReactElement {
  // State to control the open state of the autocomplete dropdown
  const [open, setOpen] = React.useState(false);
  // Custom hook for fetching search results
  const { data: searchResults, setFilters, filters, loading } = useRecords('title', 'searchBar');
  // State to store the search input value
  const [searchInput, setSearchInput] = React.useState<string>('');
  // State to store the selected option value
  const [optionValue, setOptionValue] = React.useState<Title | null>(null);
  // Reference to the search input element
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  // Next.js router
  const router = useRouter();

  // Determine the options for the autocomplete dropdown
  const options: Title[] = searchResults && filters?.search && filters?.search !== '' && !loading ? searchResults : [];

  // Create a debounced version of the setFilters function
  const debouncedSetFilters = _.debounce((value: string): void => {
    setFilters({
      ...filters,
      search: value,
    });
  }, 300); // Adjust the debounce delay (in milliseconds) as needed

  // Cleanup function to cancel debounce on unmount
  React.useEffect(() => {
    return () => {
      debouncedSetFilters.cancel();
    };
  }, []);

  // Focus the search input when the search is open
  React.useEffect(() => {
    if (openSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openSearch]);

  // Handle input change event
  const handleInputChange = (event: React.ChangeEvent<object>, value: string): void => {
    setSearchInput(value);
    debouncedSetFilters(value);
    setOpen(value !== '');
  };

  const handleFocus = (): void => {
    if (filters.search && filters.search !== '') {
      setOpen(true);
    }
  };

  const handleOptionChange = (event: React.SyntheticEvent, value: Title | null): void => {
    event.preventDefault();
    if (value) {
      router.push(`/${value.movieOrTv === 'movie' ? 'movies' : 'tv-shows'}/${value.id?.toString() ?? ''}`);
      setFilters({});
      setOpenSearch(false);
      setOpen(false);
      setSearchInput('');
      setOptionValue(null);
    }
  };

  return (
    <Autocomplete
      id="search-input"
      size="small"
      onBlur={() => {
        setTimeout((): void => {
          if (!document.activeElement || document.activeElement.id !== 'search-button') {
            setOpenSearch(false);
          }
        }, 0);
      }}
      sx={{
        width: openSearch ? '300px' : '0px',
        transition: 'width 0.5s ease-in-out',
        overflow: 'hidden',
        marginLeft: openSearch ? '8px' : '0px',
        padding: openSearch ? '8px' : '0px',
        visibility: openSearch ? 'visible' : 'hidden',
      }}
      open={open}
      onOpen={(): void => {
        setOpen(true);
      }}
      onClose={(): void => {
        setOpen(false);
      }}
      onFocus={handleFocus}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value): boolean => option && option.title === value.title}
      getOptionLabel={(option): string => searchInput ?? option?.title ?? ''}
      noOptionsText={filters?.search && filters.search !== '' ? 'No results found' : ''}
      onChange={handleOptionChange}
      inputValue={searchInput}
      value={optionValue}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          id="search-input"
          label="Search..."
          inputRef={searchInputRef}
          onKeyDown={handleKeyPress}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            sx: {
              '&& .MuiAutocomplete-endAdornment': {
                display: 'none',
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const key = `option-${option.id?.toString() ?? ''}`;
        return (
          <li {...props} key={key} style={{ display: 'flex', alignItems: 'center' }}>
            {option.imgUrl && option.imgUrl !== '' ? (
              <img
                src={option.imgUrl}
                alt={option.title}
                height={40}
                width={30}
                loading="lazy"
                style={{ marginRight: 8, borderRadius: '2px' }}
              />
            ) : null}
            {option.title}
          </li>
        );
      }}
    />
  );
}

export default SearchInput;
