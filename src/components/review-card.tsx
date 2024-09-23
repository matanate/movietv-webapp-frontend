'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete as DeleteIcon, Edit as EditIcon, EditOff as EditOffIcon } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Rating,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';

import type { Review, ReviewFormValues } from '@/types/review';
import { reviewFormSchema } from '@/lib/zod-schemas';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useRecords } from '@/contexts/records-context';
import useAxios from '@/hooks/use-axios';

/**
 * Component for displaying a review card.
 *
 * @param review - The review object.
 * @param fetchReviews - The function to fetch reviews.
 * @param fetchTitle - The function to fetch the title.
 * @returns JSX.Element The review card component.
 */
function ReviewCard({
  review,
  fetchReviews,
  fetchTitle,
}: {
  review: Review;
  fetchReviews: () => void;
  fetchTitle: () => void;
}): React.JSX.Element {
  const [editReview, setEditReview] = React.useState<boolean>(false);
  const defaultReviewFormValues = {
    rating: review.rating,
    comment: review.comment,
  };
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({ defaultValues: defaultReviewFormValues, resolver: zodResolver(reviewFormSchema) });
  const { user } = useAuth();
  const { fetchData: fetchMovies } = useRecords('title', 'movie');
  const { fetchData: fetchTvShows } = useRecords('title', 'movie');

  const api = useAxios();

  const { showAlert } = useAlert();
  const ratingRef = React.useRef<number | null>(review.rating ?? null);

  /**
   * Toggles the edit mode for the review.
   */
  const handleEditSwitch = (): void => {
    setEditReview((prev) => !prev);
    setValue('rating', review.rating || 0);
    setValue('comment', review.comment || '');
  };

  /**
   * Deletes the review.
   */
  const handleReviewDelete = async (): Promise<void> => {
    try {
      await api.delete(`/reviews/${review.id?.toString() ?? ''}`);
      showAlert({ severity: 'success', message: 'Review deleted successfully.' });
      fetchTitle();
      fetchReviews();
      fetchMovies();
      fetchTvShows();
    } catch (error) {
      showAlert({ severity: 'error', message: 'Failed to delete review.' });
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
      message: 'Are you sure you want to delete this review?',
      confirmationsNeeded: true,
      onConfirm: async () => {
        await handleReviewDelete();
      },
    });
  };

  /**
   * Handles the form submission.
   * @param reviewFormValues - The form ReviewFormValues.
   */
  const onSubmit = async (reviewFormValues: ReviewFormValues): Promise<void> => {
    try {
      await api.patch(`reviews/${review.id?.toString() ?? ''}/`, { ...reviewFormValues });
      showAlert({ severity: 'success', message: 'Review updated successfully.' });
      fetchTitle();
      fetchReviews();
      fetchMovies();
      fetchTvShows();

      // close the form
      setEditReview(false);
    } catch (error) {
      showAlert({ severity: 'error', message: 'Failed to update review.' });
    }
  };

  return (
    <Stack direction="row" id={`review-${review.id?.toString() ?? ''}`} key={`review-${review.id?.toString() ?? ''}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs="auto">
            <Avatar sx={{ margin: '5px' }} aria-label="user-initials">
              {review.authorInitials}
            </Avatar>
          </Grid>
          <Grid item xs="auto">
            <Card sx={{ position: 'relative' }}>
              {user && user.id === review.author ? (
                <Tooltip title="Edit review">
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', right: '35px', top: '0px' }}
                    onClick={handleEditSwitch}
                  >
                    {editReview ? <EditOffIcon /> : <EditIcon />}
                  </IconButton>
                </Tooltip>
              ) : null}
              {user && (user?.isStaff || user?.id === review.author) ? (
                <Tooltip title="Delete review">
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ position: 'absolute', right: '0px', top: '0px' }}
                    onClick={handleDeleteClick}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}

              <CardHeader
                sx={{ padding: '10px' }}
                title={
                  <Box>
                    {editReview ? (
                      <Controller
                        control={control}
                        name="rating"
                        render={({ field }) => (
                          <>
                            <Typography variant="h6">
                              {review.authorName} - {field.value || review.rating}/10
                            </Typography>
                            <FormControl sx={{ textAlign: 'center' }} error={Boolean(errors.rating)}>
                              <Rating
                                {...field}
                                max={10}
                                precision={0.5}
                                value={Number(field.value) || review.rating} // Ensure the value is a number
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
                          </>
                        )}
                      />
                    ) : (
                      <Typography variant="h6">
                        {review.authorName} - {review.rating}/10
                      </Typography>
                    )}
                  </Box>
                }
                subheader={`🕒${new Date(!editReview ? review.datePosted || Date.now() : Date.now())
                  .toLocaleString('en-US', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .replace(' AM', 'AM')
                  .replace(' PM', 'PM')}`}
              />
              <CardContent sx={{ pt: 0, padding: '10px' }}>
                <Typography
                  component="div"
                  variant="body1"
                  fontSize="20px"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {editReview ? (
                    <Controller
                      control={control}
                      name="comment"
                      defaultValue={review.comment || ''} // Ensure default value is set
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.comment)} fullWidth>
                          <InputLabel htmlFor={`comment-${review.id?.toString() || ''}`}>Comment</InputLabel>
                          <OutlinedInput
                            {...field}
                            label="Comment"
                            id={`comment-${review.id?.toString() || ''}`} // Set a unique ID for accessibility
                            type="text"
                            multiline
                            rows={3}
                            value={field.value || ''} // Use the field's value from Controller
                            onChange={(e) => {
                              field.onChange(e.target.value); // Properly update the field's value
                            }}
                          />
                          {errors.comment ? <FormHelperText>{errors.comment.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  ) : (
                    review.comment
                  )}
                </Typography>
                {editReview ? (
                  <Grid margin={1}>
                    {/* Error message */}
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    {/* Submit button */}
                    <Button disabled={false} type="submit" variant="contained">
                      update review
                    </Button>
                  </Grid>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

export default ReviewCard;
