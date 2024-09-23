'use client';

import * as React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Grid, IconButton, Link, Rating, Skeleton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { AxiosError } from 'axios';
import _ from 'lodash';

import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useRecord } from '@/contexts/record-context';
import { useRecords } from '@/contexts/records-context';
import useAxios from '@/hooks/use-axios';

/**
 * Component to display information about a movie or TV show title.
 * @param id - The ID of the title.
 * @param movieOrTv - The type of the title ('movie' or 'tv').
 * @returns JSX.Element
 */
function TitleInfo({ id, movieOrTv }: { id: number; movieOrTv: 'movie' | 'tv' }): React.JSX.Element {
  const { data: title, loading: titleLoading } = useRecord('title', id);
  const { data: genres, loading: genresLoading } = useRecords('genre', 'all');
  const { fetchData: fetchTitles } = useRecords('title', movieOrTv);
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const api = useAxios();

  const router = useRouter();

  /**
   * Handles the delete action for a title.
   */
  const handleDelete = async (): Promise<void> => {
    try {
      if (title?.movieOrTv !== movieOrTv) {
        throw new Error('Invalid title type');
      }
      await api.delete(`/titles/${title?.id?.toString() ?? ''}`);
      showAlert({ message: 'Title deleted successfully', severity: 'success' });
      fetchTitles();
      router.push('/');
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
   * Handles the click event for the delete button.
   * @param event - The click event.
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

  const titleRef = React.useRef(title);

  React.useEffect(() => {
    if (title && !_.isEqual(title, titleRef.current)) {
      titleRef.current = title;
      if (!(titleLoading || genresLoading) && !title) {
        notFound();
      }
      if (title.movieOrTv !== movieOrTv) {
        notFound();
      }
    }
  }, [title, movieOrTv]);

  return titleLoading || genresLoading || !title ? ( // Card Skeleton
    <Card sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ marginBottom: '20px' }} />
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={40} sx={{ marginBottom: '20px' }} />
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton variant="text" width="30%" height={30} sx={{ marginRight: 2 }} />
              <Skeleton variant="circular" width={30} height={30} />
            </Box>
            <Skeleton variant="text" width="50%" height={20} sx={{ marginBottom: '10px' }} />
            <Skeleton variant="text" width="30%" height={20} sx={{ marginBottom: '10px' }} />
            <Skeleton variant="text" width="90%" height={100} />
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <Card
      sx={{
        width: '100%',
        position: 'relative',
      }}
    >
      {user?.isStaff ? (
        <Tooltip title="Delete title">
          <IconButton
            color="error"
            sx={{ position: 'absolute', right: '10px', top: '10px' }}
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <CardMedia
            sx={{ height: '100%', marginBottom: '20px' }}
            component="img"
            image={title.imgUrl}
            title={title.title}
          />
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <CardContent>
            <Typography variant="h4" component="div">
              {title.title} - {title.rating}/10
            </Typography>
            <Rating value={title.rating} max={10} precision={0.5} readOnly />
            <Typography gutterBottom variant="subtitle1" component="div">
              {title.releaseDate?.toString().split('-').reverse().join('/')} |{' '}
              {genres
                ?.filter((genre) => title.genres?.includes(genre.id || 0))
                .map((genre) => (
                  <Link href={`/search?g=${genre.id?.toString() ?? ''}`} key={genre.id?.toString() ?? ''}>
                    {genre.genreName}
                  </Link>
                ))
                .reduce((prev, curr) => (
                  <React.Fragment>
                    {prev}, {curr}
                  </React.Fragment>
                ))}
            </Typography>
            <Typography gutterBottom variant="subtitle2" component="div">
              {}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {title.overview}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}

export default TitleInfo;
