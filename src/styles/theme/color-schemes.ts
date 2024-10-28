import type { ColorSystemOptions } from '@mui/material/styles';

import { california, kepple, neonBlue, nevada, redOrange, shakespeare, stormGrey } from './colors';
import type { ColorScheme } from './types';

export const colorSchemes = {
  dark: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.12)' },
      background: {
        default: '#2e2e2e', // Replace with a valid color value
        defaultChannel: '9 10 11',
        paper: '#3a3a3a', // Replace with a valid color value
        paperChannel: '9 10 11',
        level1: '#444444',
        level2: '#555555',
        level3: '#666666',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: '#707070', // Replace with a valid color value
      dividerChannel: '50 56 62',
      error: {
        ...redOrange,
        light: redOrange[300],
        main: redOrange[400],
        dark: redOrange[500],
        contrastText: '#000000',
      },
      info: {
        ...shakespeare,
        light: shakespeare[300],
        main: shakespeare[400],
        dark: shakespeare[500],
        contrastText: '#000000',
      },
      neutral: { ...nevada },
      primary: {
        ...neonBlue,
        light: neonBlue[300],
        main: neonBlue[400],
        dark: neonBlue[500],
        contrastText: '#000000',
      },
      secondary: {
        ...nevada,
        light: nevada[100],
        main: nevada[200],
        dark: nevada[300],
        contrastText: '#000000',
      },
      success: {
        ...kepple,
        light: kepple[300],
        main: kepple[400],
        dark: kepple[500],
        contrastText: '#000000',
      },
      text: {
        primary: '#f0f4f8',
        primaryChannel: '240 244 248',
        secondary: '#9fa6ad',
        secondaryChannel: '159 166 173',
        disabled: '#666666',
      },
      warning: {
        ...california,
        light: california[300],
        main: california[400],
        dark: california[500],
        contrastText: '#000000',
      },
    },
  },
  light: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
      background: {
        default: '#ffffff', // Replace with a valid color value
        defaultChannel: '255 255 255',
        paper: '#ffffff', // Replace with a valid color value
        paperChannel: '255 255 255',
        level1: '#f5f5f5',
        level2: '#eeeeee',
        level3: '#e0e0e0',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: '#e0e0e0', // Replace with a valid color value
      dividerChannel: '220 223 228',
      error: {
        ...redOrange,
        light: redOrange[400],
        main: redOrange[500],
        dark: redOrange[600],
        contrastText: '#ffffff',
      },
      info: {
        ...shakespeare,
        light: shakespeare[400],
        main: shakespeare[500],
        dark: shakespeare[600],
        contrastText: '#ffffff',
      },
      neutral: { ...stormGrey },
      primary: {
        ...neonBlue,
        light: neonBlue[400],
        main: neonBlue[500],
        dark: neonBlue[600],
        contrastText: '#ffffff',
      },
      secondary: {
        ...nevada,
        light: nevada[600],
        main: nevada[700],
        dark: nevada[800],
        contrastText: '#ffffff',
      },
      success: {
        ...kepple,
        light: kepple[400],
        main: kepple[500],
        dark: kepple[600],
        contrastText: '#ffffff',
      },
      text: {
        primary: '#212636',
        primaryChannel: '33 38 54',
        secondary: '#667085',
        secondaryChannel: '102 112 133',
        disabled: '#666666',
      },
      warning: {
        ...california,
        light: california[400],
        main: california[500],
        dark: california[600],
        contrastText: '#ffffff',
      },
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
