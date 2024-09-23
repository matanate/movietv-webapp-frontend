'use client';

import * as React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton, useColorScheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import EmotionCache from './emotion-cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ModeSwitcher component provides a button to switch between light and dark mode.
 *
 * @returns JSX.Element The rendered ModeSwitcher component.
 */
export const ModeSwitcher = React.forwardRef<HTMLButtonElement>((props, ref) => {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      {...props}
      ref={ref}
      sx={{ ml: 1 }}
      onClick={
        mode === 'light'
          ? () => {
              setMode('dark');
            }
          : () => {
              setMode('light');
            }
      }
      color="inherit"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
});
ModeSwitcher.displayName = 'ModeSwitcher';

/**
 * ThemeProvider component provides a theme for the application.
 *
 * @param  children - The children components.
 * @returns JSX.Element The rendered ThemeProvider component.
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = createTheme();
  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
}
