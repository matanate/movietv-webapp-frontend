import * as React from 'react';

// Interface for the PopoverController
interface PopoverController<T> {
  anchorRef: React.MutableRefObject<T | null>; // Reference to the anchor element
  handleOpen: () => void; // Function to open the popover
  handleClose: () => void; // Function to close the popover
  handleToggle: () => void; // Function to toggle the popover open/close state
  open: boolean; // Boolean indicating whether the popover is open or not
}

/**
 * Custom hook for managing a popover.
 * @returns PopoverController object
 */
export function usePopover<T = HTMLElement>(): PopoverController<T> {
  const anchorRef = React.useRef<T>(null); // Reference to the anchor element
  const [open, setOpen] = React.useState<boolean>(false); // State to track the popover open/close state

  // Function to open the popover
  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  // Function to close the popover
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  // Function to toggle the popover open/close state
  const handleToggle = React.useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  // Return the PopoverController object
  return { anchorRef, handleClose, handleOpen, handleToggle, open };
}
