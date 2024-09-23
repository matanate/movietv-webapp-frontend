import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton, Tooltip } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import SearchInput from '@/components/layout/search-input';

/**
 * SearchBar component.
 *
 * @returns The SearchBar component.
 */
function SearchBar(): React.JSX.Element {
  // State for controlling the search input visibility
  const [openSearch, setOpenSearch] = useState(false);
  const router = useRouter();

  // Function to handle search button click
  const handleSearchClick = (value: string | null = null): void => {
    if (!openSearch) {
      setOpenSearch(true);
    } else {
      if (value && value !== '') {
        router.push(`/search/?q=${value}`);
      }
      setOpenSearch(false);
    }
  };

  // Function to handle key press event on search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      handleSearchClick(value);
    }
  };

  return (
    <>
      {/* SearchInput component */}
      <SearchInput openSearch={openSearch} setOpenSearch={setOpenSearch} handleKeyPress={handleKeyPress} />

      {/* Search button */}
      <Tooltip title="Search">
        <IconButton
          onClick={() => {
            handleSearchClick((document.getElementById('search-input') as HTMLInputElement)?.value);
          }}
          id="search-button"
        >
          <MagnifyingGlassIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default SearchBar;
