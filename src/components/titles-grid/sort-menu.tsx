import * as React from 'react';
import { KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, Sort } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';

import type { RecordType, RecordVariant } from '@/contexts/records-context';

interface SortMenuProps {
  orderBy: string | null; // The current sorting order
  isAscending: boolean; // Whether the sorting order is ascending or descending
  setOrderBy: (orderBy: string) => void; // Function to update the sorting order
  setIsAscending: (isAscending: boolean) => void; // Function to update the sorting direction
  recordType: RecordType; // The type of record being sorted (e.g., 'title', 'review')
  recordVariant: RecordVariant; // The variant of the record being sorted (e.g., 'search')
}

/**
 * A menu component for sorting titles.
 *
 * @param orderBy - The current sorting order
 * @param isAscending - Whether the sorting order is ascending or descending
 * @param setOrderBy - Function to update the sorting order
 * @param setIsAscending - Function to update the sorting direction
 * @param recordType - The type of record being sorted (e.g., 'title', 'review')
 * @param recordVariant - The variant of the record being sorted (e.g., 'search')
 *
 * @returns The component
 */
function SortMenu({
  orderBy,
  isAscending,
  setOrderBy,
  setIsAscending,
  recordType,
  recordVariant,
}: SortMenuProps): React.JSX.Element {
  const [anchorElSort, setAnchorElSort] = React.useState<null | HTMLElement>(null);
  const openSort = Boolean(anchorElSort);

  /**
   * Handles the click event on the sort button.
   * Opens the sort menu.
   */
  const handleClickSort = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorElSort(event.currentTarget);
  };

  /**
   * Handles the close event of the sort menu.
   * Closes the sort menu.
   */
  const handleCloseSort = (): void => {
    setAnchorElSort(null);
  };

  /**
   * Handles the selection of a sort option.
   * Updates the sorting order and direction.
   * Closes the sort menu.
   * @param orderByParam - The new sorting order
   */
  const handleSortSelect = (orderByParam: string): void => {
    if (orderBy === orderByParam) {
      setIsAscending(!isAscending);
    } else {
      setOrderBy(orderByParam);
      setIsAscending(false);
    }
    handleCloseSort();
  };

  return (
    <>
      <Button
        id="sort-button"
        title="Sort titles"
        aria-controls={openSort ? 'sort-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openSort ? 'true' : undefined}
        onClick={handleClickSort}
      >
        <Sort />
      </Button>
      <Menu
        id="sort-menu"
        open={openSort}
        anchorEl={anchorElSort}
        onClose={handleCloseSort}
        MenuListProps={{
          'aria-labelledby': 'sort-button',
        }}
      >
        <div>
          {recordVariant === 'search' && (
            <MenuItem
              onClick={() => {
                handleSortSelect('rating');
              }}
            >
              {orderBy === 'bestMatch' && (!isAscending ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />)}
              Best Match
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              handleSortSelect('rating');
            }}
          >
            {orderBy === 'rating' && (!isAscending ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />)}
            Rating
          </MenuItem>
          {recordType === 'title' && (
            <>
              <MenuItem
                onClick={() => {
                  handleSortSelect('title');
                }}
              >
                {orderBy === 'title' && (!isAscending ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />)}
                Title Name
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSortSelect('releaseDate');
                }}
              >
                {orderBy === 'releaseDate' && (!isAscending ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />)}
                Release Date
              </MenuItem>
            </>
          )}
          {recordType === 'review' && (
            <MenuItem
              onClick={() => {
                handleSortSelect('datePosted');
              }}
            >
              {orderBy === 'datePosted' && (!isAscending ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />)}
              Date Posted
            </MenuItem>
          )}
        </div>
      </Menu>
    </>
  );
}

export default SortMenu;
