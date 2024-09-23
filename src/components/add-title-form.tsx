'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { borderTop } from '@mui/system';
import { AxiosError } from 'axios';

import type { Title } from '@/types/title';
import isStringRecord from '@/lib/is-string-record';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useRecords } from '@/contexts/records-context';
import useAxios from '@/hooks/use-axios';

interface AddTitleFormProps {
  searchInput?: string;
  movieOrTv?: 'movie' | 'tv';
  title?: Title;
  titles?: Title[];
  titleId?: number;
}

interface FormField {
  name: 'searchInput' | 'movieOrTv';
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: { label: string; value: string }[];
}

/**
 * Renders the AddTitleForm component.
 *
 * @returns JSX.Element - The rendered AddTitleForm component.
 */
function AddTitleForm(): React.JSX.Element | null {
  // State variables
  const [openSpeedDial, setOpenSpeedDial] = React.useState<boolean>(false);
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<AddTitleFormProps>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [loading, setLoading] = React.useState<boolean>(false);

  const { fetchData: fetchMovies } = useRecords('title', 'movie');
  const { fetchData: fetchTvShows } = useRecords('title', 'tv');

  // Other hooks
  const { user } = useAuth();
  const api = useAxios();
  const { showAlert } = useAlert();
  const router = useRouter();

  // SpeedDial actions
  const actions = [{ icon: <LibraryAddIcon />, name: 'Add Title' }];

  // Stepper steps
  const steps = [
    { title: 'Search for title', optional: false },
    { title: 'Select title from list', optional: false },
    { title: 'Confirm Title', optional: false },
  ];

  // Form fields
  const formFields: FormField[] = [
    { name: 'searchInput', label: 'Search input', type: 'text', required: true },
    {
      name: 'movieOrTv',
      label: 'Movie or Tv Show',
      type: 'select',
      required: true,
      options: [
        { label: 'Movie', value: 'movie' },
        { label: 'Tv Show', value: 'tv' },
      ],
    },
  ];

  // Handle form field changes
  const handleChange = (field: string, value: string | number | Title | Title[]): void => {
    setFormData({ ...formData, [field]: value });
  };

  // Check if step is skipped
  const isStepSkipped = (step: number): boolean => {
    return skipped.has(step);
  };

  // Handle next step
  const handleNext = (): void => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // Handle previous step
  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle skip step
  const handleSkip = (): void => {
    if (steps[activeStep].optional) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // Handle form reset
  const handleReset = (): void => {
    setActiveStep(0);
    setFormData({});
  };

  // Handle opening of SpeedDial
  const handleOpenSpeedDial = (): void => {
    setOpenSpeedDial(true);
  };

  // Handle closing of SpeedDial
  const handleCloseSpeedDial = (): void => {
    setOpenSpeedDial(false);
  };

  // Handle opening of form
  const handleFormOpen = (): void => {
    handleReset();
    setOpenForm(true);
  };

  // Handle closing of form
  const handleFormClose = (): void => {
    setOpenForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Submit search form
    const submitSearchForm = async (): Promise<void> => {
      setLoading(true);
      if (!formData.searchInput || !formData.movieOrTv) {
        setLoading(false);
        showAlert({ severity: 'warning', message: 'Search input and movie or tv must be provided' });
        return;
      }
      const queryParams = new URLSearchParams({ searchTerm: formData.searchInput, movieOrTv: formData.movieOrTv });
      try {
        const response = await api.get(`get-tmdb-search/?${queryParams.toString()}`);
        const responseData = (await response.data) as Title[];
        handleChange('titles', responseData);
        setLoading(false);
        handleNext();
      } catch (error) {
        setLoading(false);
        showAlert({ severity: 'error', message: 'Failed to fetch search result. Please try again.' });
      }
    };

    // Submit title selection
    const submitTitleSelection = async (): Promise<void> => {
      setLoading(true);
      if (!formData.titleId) {
        setLoading(false);
        showAlert({ severity: 'warning', message: 'Title must be selected' });
        return;
      }
      const selectedTitle = formData.titles?.find((title: Title) => title.id === formData.titleId);
      if (!selectedTitle) {
        setLoading(false);
        showAlert({ severity: 'warning', message: 'Title must be selected' });
        return;
      }
      const title = {
        id: selectedTitle.id,
        title: formData.movieOrTv === 'movie' ? selectedTitle.title : selectedTitle.name,
        releaseDate: formData.movieOrTv === 'movie' ? selectedTitle.releaseDate : selectedTitle.firstAirDate,
        overview: selectedTitle.overview,
        imgUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${selectedTitle.posterPath ?? ''}`,
        movieOrTv: formData.movieOrTv,
        genres: selectedTitle.genreIds,
      };
      handleChange('title', title);
      setLoading(false);
      handleNext();
    };

    // Submit title confirmation
    const submitTitleConfirmation = async (): Promise<void> => {
      setLoading(true);
      const title = formData.title;
      if (!title) {
        setLoading(false);
        showAlert({ severity: 'warning', message: 'Title must be confirmed' });
        return;
      }

      try {
        await api.post(`titles/`, title);
        setLoading(false);
        handleFormClose();
        router.push(`/${title.movieOrTv === 'movie' ? 'movies' : 'tv-shows'}/${title.id?.toString() ?? ''}`);
        // Fetch titles again to include the new title
        if (title.movieOrTv === 'movie') {
          fetchMovies();
        } else {
          fetchTvShows();
        }
        showAlert({
          severity: 'success',
          message: 'Title added successfully, Would you like to add another title?',
          confirmationsNeeded: true,
          onConfirm: () => {
            handleFormOpen();
          },
        });
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
        setLoading(false);
      }
    };

    // Handle form submission based on active step
    if (activeStep === 0) {
      await submitSearchForm();
    } else if (activeStep === 1) {
      await submitTitleSelection();
    } else if (activeStep === 2) {
      await submitTitleConfirmation();
    }
  };
  // Check if the user is staff and render the form if true
  return user?.isStaff ? (
    <>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openForm}>
        <Box
          sx={{
            width: '90vw',
            bgcolor: 'background.paper',
            borderRadius: '10px',
            position: 'relative',
            p: 4,
            height: '80vh',
          }}
        >
          {loading ? (
            <LinearProgress
              sx={{
                top: '-32px',
                marginRight: '-29px',
                marginLeft: '-29px',
                borderTopRightRadius: '32px',
                borderTopLeftRadius: '32px',
              }}
            />
          ) : null}
          <IconButton
            aria-label="close"
            onClick={handleFormClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Stack spacing={2}>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                if (step.optional) {
                  labelProps.optional = <Typography variant="caption">Optional</Typography>;
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={step.title} {...stepProps}>
                    <StepLabel {...labelProps}>{step.title}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Stack>
          {activeStep === steps.length ? (
            <Stack spacing={2}>
              <Typography sx={{ mt: 2, mb: 1 }}>Title added!</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Add another title</Button>
              </Box>
            </Stack>
          ) : (
            <Stack
              spacing={2}
              margin={2}
              sx={{
                maxHeight: '90%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  flexGrow: 1,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {activeStep === 0 ? (
                    formFields.map((field) => (
                      <Grid item md={6} xs={12} key={field.name}>
                        <FormControl margin="normal" fullWidth required={field.required}>
                          {field.type === 'select' ? (
                            <>
                              <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                              <Select
                                labelId={`${field.name}-label`}
                                id={field.name}
                                value={formData[field.name] ?? ''}
                                onChange={(e) => {
                                  handleChange(field.name, e.target.value);
                                }}
                                input={<OutlinedInput label={field.label} />}
                              >
                                {!field.required && (
                                  <MenuItem key="" value="">
                                    None
                                  </MenuItem>
                                )}
                                {field.options?.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          ) : field.type === 'textarea' ? (
                            <TextField
                              id={field.name}
                              value={formData[field.name] ?? ''}
                              label={field.label}
                              name={field.name}
                              multiline
                              rows={4}
                              onChange={(e) => {
                                handleChange(field.name, e.target.value);
                              }}
                            />
                          ) : (
                            <TextField
                              id={field.name}
                              value={formData[field.name] ?? ''}
                              label={field.label}
                              name={field.name}
                              type={field.type}
                              InputLabelProps={
                                field.type === 'date'
                                  ? {
                                      shrink: true,
                                    }
                                  : {}
                              }
                              onChange={(e) => {
                                handleChange(field.name, e.target.value);
                              }}
                            />
                          )}
                        </FormControl>
                      </Grid>
                    ))
                  ) : activeStep === 1 ? (
                    <FormControl margin="normal" required>
                      {formData.titles && formData.titles.length > 0 ? (
                        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                          {formData.titles?.map((title: Title) => (
                            <FormControlLabel
                              key={title.id}
                              value={title.id}
                              control={<Radio />}
                              checked={formData.titleId === title.id}
                              onClick={() => {
                                if (title.id) {
                                  handleChange('titleId', title.id);
                                }
                              }}
                              label={`${formData.movieOrTv === 'movie' ? title.title ?? '' : title.name ?? ''} - ${formData.movieOrTv === 'movie' ? title.releaseDate?.toString() ?? '' : title.firstAirDate?.toString() ?? ''}`}
                            />
                          ))}
                        </RadioGroup>
                      ) : (
                        <Typography variant="h6">No titles found</Typography>
                      )}
                    </FormControl>
                  ) : (
                    activeStep === 2 &&
                    formData.title && (
                      <Card
                        sx={{
                          width: '80%',
                          margin: 'auto',
                          marginTop: '1%',
                          marginBottom: '1%',
                        }}
                      >
                        <Grid container>
                          <Grid item xs={12} md={3} lg={3}>
                            <CardMedia
                              sx={{ height: '100%' }}
                              component="img"
                              image={formData.title.imgUrl}
                              title={formData.title.title}
                            />
                          </Grid>
                          <Grid item xs={12} md={9} lg={9}>
                            <CardContent>
                              <Typography gutterBottom variant="h5" component="div">
                                {formData.title.title}
                              </Typography>
                              <Typography gutterBottom variant="caption" component="div">
                                {formData.title.releaseDate?.toString().split('-').reverse().join('/')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                {formData.title.overview}
                              </Typography>
                            </CardContent>
                          </Grid>
                        </Grid>
                      </Card>
                    )
                  )}
                </Grid>
                <Box sx={{ pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  {steps[activeStep].optional ? (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  ) : null}
                  <Button type="submit" disabled={loading || (activeStep === 1 && formData.titles?.length === 0)}>
                    {activeStep === steps.length - 1 ? 'Add Title' : 'Next'}
                  </Button>
                </Box>
              </form>
            </Stack>
          )}
        </Box>
      </Backdrop>
      <Box
        sx={{
          height: 330,
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Backdrop open={openSpeedDial} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleCloseSpeedDial}
          onOpen={handleOpenSpeedDial}
          open={openSpeedDial}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={handleFormOpen}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  ) : null;
}
export default AddTitleForm;
