'use client';

import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import { useAuth } from '@/contexts/auth-context';
import { useRecordContext } from '@/contexts/record-context';
import { useRecordsContext } from '@/contexts/records-context';
import type { RecordsState } from '@/contexts/records-context';

/**
 * A progress bar component that displays a linear progress indicator
 * while certain loading states are active.
 *
 * @returns JSX.Element The progress bar component
 */
function ProgressBar(): React.JSX.Element | null {
  const { loading: authLoading } = useAuth();
  const { state: recordsStates } = useRecordsContext();
  const { state: recordStates } = useRecordContext();

  // Check if any records are currently loading
  const recordsLoading = Object.values(recordsStates).some(
    (state: RecordsState<'title' | 'genre' | 'review'>) => state.mounted && state.loading
  );

  // Check if a specific record is currently loading
  const recordLoading = Object.values(recordStates).some((state) => state.id && state.loading);

  // Determine if any loading state is active
  const loading = authLoading || recordsLoading || recordLoading;

  // Display the progress bar if loading is true, otherwise display nothing
  return loading ? <LinearProgress sx={{ position: 'relative', zIndex: 1200 }} /> : null;
}

export default ProgressBar;
