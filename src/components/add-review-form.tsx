'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  OutlinedInput,
  Rating,
  Skeleton,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useRecord } from '@/contexts/record-context';
import { useRecords } from '@/contexts/records-context';
import useAxios from '@/hooks/use-axios';

// Define the validation schema for the form fields
const schema = zod.object({
  rating: zod.number().min(1, { message: 'Rating is required' }),
  comment: zod.string().min(1, { message: 'Comment is required' }),
});

// Define the default values for the form fields
const defaultValues = {
  rating: 0,
  comment: '',
};

// Define the type for the form values
export type Values = zod.infer<typeof schema>;

/**
 * Component for adding a review.
 * @param id - The ID of the title to add the review to.
 * @returns The JSX element representing the add review form.
 */
function AddReviewForm({ id }: { id: number }): React.JSX.Element {
  // Fetch the title and reviews using custom hooks
  const { fetchData: fetchTitle } = useRecord('title', id);
  const { fetchData: fetchReviews } = useRecords('review', 'title', { title: id });

  const { fetchData: fetchMovies } = useRecords('title', 'movie');
  const { fetchData: fetchTvShows } = useRecords('title', 'tv');

  // Get the user and loading state from the auth context
  const { user, loading } = useAuth();

  // Create an instance of the Axios API client
  const api = useAxios();

  // Initialize the form using the useForm hook from react-hook-form
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  // Get the showAlert function from the alert context
  const { showAlert } = useAlert();

  // Create a ref to store the current rating value
  const ratingRef = React.useRef<number | null>(0);

  // Handle form submission
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // Send a POST request to the API to submit the review
        await api.post('reviews/', { ...values, title: id });

        // Show a success alert
        showAlert({ severity: 'success', message: 'Review submitted successfully.' });

        // Fetch the updated reviews and title
        fetchReviews();
        fetchTitle();
        fetchMovies();
        fetchTvShows();

        // Clear the form
        ratingRef.current = 0;
        setValue('comment', '', { shouldValidate: false });
        setValue('rating', 0, { shouldValidate: false });

        // Scroll to the top of the page
        window.scrollTo(0, 0);
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
    },
    [api, fetchReviews, fetchTitle, id, showAlert, setValue, fetchMovies, fetchTvShows]
  );

  return (
    <Stack direction="column" spacing={2} padding={2}>
      <Typography variant="h5">Add Review:</Typography>
      {loading ? (
        // Show a skeleton loading state while the data is being fetched
        <form>
          <Stack direction="row" spacing={2} margin={2}>
            <FormControl sx={{ textAlign: 'center' }}>
              <Typography>
                <Skeleton width={200} />
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Skeleton variant="rectangular" width={210} height={34} />
              </Box>
            </FormControl>
          </Stack>
          <Grid margin={2}>
            <Button disabled variant="contained">
              <Skeleton width={100} />
            </Button>
          </Grid>
        </form>
      ) : user ? (
        // Show the review form if the user is logged in
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={2} margin={2}>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => {
                return (
                  <FormControl sx={{ textAlign: 'center' }} error={Boolean(errors.rating)}>
                    <Typography>{field.value}/10</Typography>
                    <Rating
                      {...field}
                      max={10}
                      precision={0.5}
                      value={Number(field.value) || 0} // Ensure the value is a number
                      onChange={(event, newValue) => {
                        field.onChange(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        if (newHover !== -1) {
                          // Temporarily set the value to show the hovered rating, but don't persist it
                          field.onChange(newHover);
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        ratingRef.current = field.value;
                      }}
                      onMouseLeave={() => {
                        // Revert to the actual value on mouse leave
                        field.onChange(ratingRef.current);
                      }}
                    />
                    {errors.rating ? <FormHelperText>{errors.rating.message}</FormHelperText> : null}
                  </FormControl>
                );
              }}
            />
          </Stack>
          <Stack spacing={2} margin={2} direction="row">
            <Controller
              control={control}
              name="comment"
              render={({ field }) => (
                <FormControl error={Boolean(errors.comment)}>
                  <InputLabel>Comment</InputLabel>
                  <OutlinedInput {...field} label="Comment" type="text" multiline rows={3} />
                  {errors.comment ? <FormHelperText>{errors.comment.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Stack>
          <Grid margin={2}>
            {/* Show an error message if there is a root error */}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            {/* Show the submit button */}
            <Button disabled={loading} type="submit" variant="contained">
              Submit review
            </Button>
          </Grid>
        </form>
      ) : (
        // Show a message to prompt the user to sign in or sign up
        <Stack sx={{ paddingLeft: '20px' }}>
          <Typography color="text.secondary" variant="body1">
            <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
              Sign in
            </Link>
            {' to add a review.'}
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
              Sign up
            </Link>
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

export default AddReviewForm;
