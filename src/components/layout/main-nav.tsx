'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { paths } from '@/paths';
import { useAuth } from '@/contexts/auth-context';
import { usePopover } from '@/hooks/use-popover';
import { ModeSwitcher } from '@/components/core/theme-provider/theme-provider';

import { MobileNav } from './mobile-nav';
import SearchBar from './search-bar';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { user, loading } = useAuth();

  const userPopover = usePopover<HTMLDivElement>();
  const router = useRouter();

  // Render the main navigation component
  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* Button to open the navigation menu */}
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            {/* Search bar component */}
            <SearchBar />
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* Color mode switcher */}
            <Tooltip title="ColorMode">
              <ModeSwitcher />
            </Tooltip>
            {loading ? (
              // Show a loading skeleton while user data is being fetched
              <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
            ) : user ? (
              // Show user avatar if user is logged in
              <Avatar onClick={userPopover.handleOpen} ref={userPopover.anchorRef} sx={{ cursor: 'pointer' }}>
                {user.firstName ? user.firstName[0].toUpperCase() : ''}
                {user.lastName ? user.lastName[0].toUpperCase() : ''}
              </Avatar>
            ) : (
              // Show sign in and sign up buttons if user is not logged in
              <>
                <Button
                  onClick={() => {
                    router.push(paths.auth.signIn);
                  }}
                  variant="contained"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    router.push(paths.auth.signUp);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
      {/* User popover component */}
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      {/* Mobile navigation component */}
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
