'use client';

import React, { createContext, useCallback, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import type { ProviderContext, SnackbarKey, SnackbarProviderProps } from 'notistack';

type SnackbarProviderContext = ProviderContext & SnackbarProviderProps;

// Type Definitions
type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertOptions {
  severity: AlertSeverity; // The severity level of the alert (error, warning, info, success)
  message: string | Record<string, string | string[]>; // The message to be displayed in the alert
  confirmationsNeeded?: boolean; // Whether or not the alert requires user confirmation
  onConfirm?: () => void; // Callback function to be executed when the user confirms the alert
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void; // Function to show an alert with the specified options
}

// Context Creation
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Action Component for Snackbar
function SnackbarAction({
  snackbarKey,
  confirmationsNeeded,
  onConfirm,
  closeSnackbar,
}: {
  snackbarKey: SnackbarKey;
  confirmationsNeeded?: boolean;
  onConfirm?: () => void;
  closeSnackbar: (snackbarKey: SnackbarKey) => void;
}): React.JSX.Element {
  return (
    <>
      {confirmationsNeeded ? (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            if (onConfirm) onConfirm();
            closeSnackbar(snackbarKey);
          }}
        >
          Yes
        </Button>
      ) : null}
      <Button
        color="inherit"
        size="small"
        onClick={() => {
          closeSnackbar(snackbarKey);
        }}
      >
        {confirmationsNeeded ? 'Cancel' : 'Close'}
      </Button>
      <IconButton
        color="inherit"
        size="small"
        onClick={() => {
          closeSnackbar(snackbarKey);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
}

// Helper function to create the action component
const createSnackbarAction = (
  snackbarKey: SnackbarKey,
  confirmationsNeeded?: boolean,
  onConfirm?: () => void,
  closeSnackbar?: (snackbarKey: SnackbarKey) => void
): React.JSX.Element => (
  <SnackbarAction
    snackbarKey={snackbarKey}
    confirmationsNeeded={confirmationsNeeded}
    onConfirm={onConfirm}
    closeSnackbar={closeSnackbar!}
  />
);

// Provider Component
function AlertProviderComponent({
  children,
  enqueueSnackbar,
  closeSnackbar,
}: SnackbarProviderContext): React.JSX.Element {
  // Function to show an alert with the specified options
  const showAlert = useCallback(
    ({ severity, message, confirmationsNeeded, onConfirm }: AlertOptions) => {
      const severityMessage = `${severity.replace(/(?:[A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: `;
      let formatMessage = '';
      if (typeof message === 'string') {
        formatMessage = message;
      } else {
        for (const snackbarKey in message) {
          if (Object.prototype.hasOwnProperty.call(message, snackbarKey)) {
            const value = message[snackbarKey];
            if (Array.isArray(value)) {
              formatMessage += `${value.join(', ')}\n`;
            } else {
              formatMessage += `${value}\n`;
            }
          }
        }
      }
      formatMessage = severityMessage + formatMessage;

      enqueueSnackbar(formatMessage, {
        variant: severity,
        autoHideDuration: 6000,
        action: (snackbarKey: SnackbarKey) =>
          createSnackbarAction(snackbarKey, confirmationsNeeded, onConfirm, closeSnackbar),
      });
    },

    [enqueueSnackbar, closeSnackbar]
  );

  return <AlertContext.Provider value={{ showAlert }}>{children}</AlertContext.Provider>;
}

// Provider Component
function AlertProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <AlertProviderComponent enqueueSnackbar={enqueueSnackbar} closeSnackbar={closeSnackbar}>
      {children}
    </AlertProviderComponent>
  );
}

// Wrapper Component
function AlertProviderWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <AlertProvider>{children}</AlertProvider>
    </SnackbarProvider>
  );
}

// Custom Hook
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Export
export default AlertProviderWrapper;
