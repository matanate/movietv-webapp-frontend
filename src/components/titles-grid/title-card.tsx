import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Rating, Stack, Typography } from '@mui/material';
import { AxiosError } from 'axios';

import type { Title } from '@/types/title';
import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import useAxios from '@/hooks/use-axios';

interface TitleCardProps {
  title: Title; // The title object
  fetchTitles: () => void; // Function to fetch titles
}

/**
 * A card component to display a title.
 *
 * @param props - The props object
 * @returns The title card component
 */
function TitleCard({ title, fetchTitles }: TitleCardProps): React.JSX.Element {
  const router = useRouter();

  const { showAlert } = useAlert();
  const { user } = useAuth();
  const api = useAxios();

  /**
   * Handles the delete operation for the title.
   */
  const handleDelete = async (): Promise<void> => {
    try {
      await api.delete(`/titles/${title.id?.toString() ?? ''}`);
      showAlert({ message: 'Title deleted successfully', severity: 'success' });
      fetchTitles();
    } catch (error) {
      // Show an error alert
      if (error instanceof AxiosError) {
        if (typeof error.response?.data === 'string' || isStringRecord(error.response?.data)) {
          showAlert({ severity: 'error', message: error.response?.data });
        } else {
          showAlert({ severity: 'error', message: 'An error occurred.' });
        }
      } else {
        showAlert({ severity: 'error', message: 'An error occurred.' });
      }
    }
  };

  /**
   * Handles the delete button click event.
   * @param event - The click event
   */
  const handleDeleteClick = (event: React.MouseEvent): void => {
    event.stopPropagation(); // Prevent the card click event from firing
    showAlert({
      severity: 'warning',
      message: 'Are you sure you want to delete this title?',
      confirmationsNeeded: true,
      onConfirm: async () => {
        await handleDelete();
      },
    });
  };

  /**
   * Handles the card click event.
   */
  const handleCardClick = (): void => {
    router.push(`/${title.movieOrTv === 'movie' ? 'movies' : 'tv-shows'}/${title.id?.toString() ?? ''}`);
  };

  return (
    <Card
      className="card"
      sx={{ height: '200px', width: '150px', alignContent: 'center', textAlign: 'center' }}
      onClick={handleCardClick}
    >
      <div
        className="front"
        style={{
          backgroundImage: `url('${title.imgUrl ?? ''}')`,
        }}
      >
        <span>{title.movieOrTv}</span>
      </div>
      <div className="back">
        <Stack>
          <Typography fontWeight="bold" className="card-title">
            {title.title}
          </Typography>
          <hr style={{ width: '90%' }} />
          <Typography className="rating" fontWeight="bold">
            {title.rating}
          </Typography>
          <Rating size="small" max={5} value={(title.rating ?? 0) / 2} precision={0.5} readOnly />
          <hr style={{ width: '90%' }} />
          {user?.isStaff ? (
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              Delete
            </Button>
          ) : null}
        </Stack>
      </div>
    </Card>
  );
}

export default TitleCard;
