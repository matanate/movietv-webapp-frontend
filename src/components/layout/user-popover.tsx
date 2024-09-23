import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';

/**
 * Props for the UserPopover component.
 */
export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

/**
 * UserPopover component displays a popover with user information and actions.
 *
 * @param anchorEl - The anchor element for the popover
 * @param onClose - The function to close the popover
 * @param open - Indicates whether the popover is open or not
 * @returns The UserPopover component
 */
export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { user, logoutUser } = useAuth();

  const { showAlert } = useAlert();

  /**
   * Handles the sign out action.
   */
  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      onClose();
      logoutUser();
      showAlert({ severity: 'success', message: 'You are now logged out!' });
    } catch (error) {
      showAlert({ severity: 'error', message: 'Sign out error' });
    }
  }, [onClose, logoutUser, showAlert]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.username ?? ''}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
