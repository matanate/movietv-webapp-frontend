'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuth } from '@/contexts/auth-context';

/**
 * AccountInfo component displays the user's account information.
 *
 * @returns JSX.Element
 */
export function AccountInfo(): React.JSX.Element {
  // Contexts
  const { user } = useAuth();
  // Router
  const router = useRouter();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          {/* User avatar */}
          <div>
            <Avatar sx={{ height: '80px', width: '80px', fontSize: '2rem' }}>
              {user?.firstName?.[0]?.toUpperCase()}
              {user?.lastName?.[0]?.toUpperCase()}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            {/* User username */}
            <Typography variant="h5">{user?.username}</Typography>
            {/* User full name */}
            <Typography color="text.secondary" variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        {/* Button to reset password */}
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            router.push('/auth/reset-password');
          }}
        >
          Reset password
        </Button>
      </CardActions>
    </Card>
  );
}
