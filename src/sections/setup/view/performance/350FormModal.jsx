import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';

import { useGetAllPerformanceQuestions } from 'src/api/performanceQuestion';
import ComponentBlock from 'src/sections/_examples/component-block';
import Iconify from 'src/components/iconify';

export const PerformanceFeedbackForm = ({
  setOpen360Form,
  open360Form,
  handleFormSubmit,
  employeeFormData,
  setEmployeeFormData,
  employeeSelfFormData,
  setEmployeeSelfFormData,
}) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finalComment, setFinalComment] = useState('');
  const [assignments, setAssignments] = useState('');
  const [learningDone, setLearningDone] = useState('');
  const [futureLearning, setFutureLearning] = useState('');
  const [selfScore, setSelfScore] = useState('');

  const { PerformanceQuestions } = useGetAllPerformanceQuestions();

  useEffect(() => {
    if (open360Form) {
      const fetchQuestions = async () => {
        try {
          const questionsList = await PerformanceQuestions();
          const groupedCategories = questionsList.data.reduce((acc, question) => {
            if (!acc[question.categoryName]) {
              acc[question.categoryName] = [];
            }
            acc[question.categoryName].push(question);
            return acc;
          }, {});

          const fetchedCategories = Object.keys(groupedCategories).map((name) => ({
            name,
            questions: groupedCategories[name],
          }));

          setCategories(fetchedCategories);

          if (employeeFormData) {
            const initialFeedback = fetchedCategories.map((category) => {
              const existingCategoryFeedback = employeeFormData.questionRatings.filter((rating) =>
                category.questions.some(
                  (question) =>
                    question.performanceFeedbackQuestionId === rating.performanceFeedbackQuestionId
                )
              );

              return {
                category: category.name,
                answers: category.questions.map((question) => {
                  const feedback = existingCategoryFeedback.find(
                    (rating) =>
                      rating.performanceFeedbackQuestionId ===
                      question.performanceFeedbackQuestionId
                  );
                  return feedback ? feedback.rating : '';
                }),
                ids: category.questions.map((q) => q.performanceFeedbackQuestionId),
              };
            });

            setFeedback(initialFeedback);
          } else if (employeeSelfFormData) {
            const initialFeedback = fetchedCategories.map((category) => {
              const existingCategoryFeedback = employeeSelfFormData.questionRatings.filter(
                (rating) =>
                  category.questions.some(
                    (question) =>
                      question.performanceFeedbackQuestionId ===
                      rating.performanceFeedbackQuestionId
                  )
              );

              return {
                category: category.name,
                answers: category.questions.map((question) => {
                  const feedback = existingCategoryFeedback.find(
                    (rating) =>
                      rating.performanceFeedbackQuestionId ===
                      question.performanceFeedbackQuestionId
                  );
                  return feedback ? feedback.rating : '';
                }),
                ids: category.questions.map((q) => q.performanceFeedbackQuestionId),
              };
            });

            setFeedback(initialFeedback);
            setAssignments(employeeSelfFormData.assignments || '');
            setLearningDone(employeeSelfFormData.learningDone || '');
            setFutureLearning(employeeSelfFormData.futureLearning || '');
            setSelfScore(employeeSelfFormData.selfScore || '');
          } else {
            setFeedback(
              fetchedCategories.map((category) => ({
                category: category.name,
                answers: category.questions.map(() => ''),
                ids: category.questions.map((q) => q.performanceFeedbackQuestionId),
              }))
            );
          }

          setFinalComment(employeeFormData?.finalComment || '');
        } catch (err) {
          setError('Failed to load questions.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [open360Form, employeeFormData, employeeSelfFormData]);

  const handleNext = () => {
    if (activeStep === categories.length) {
      // Final comments step
      if (finalComment.trim() === '') {
        alert('Please provide a final comment.');
        return;
      }

      handleSubmit();
      return;
    }

    const currentCategory = categories[activeStep];
    if (feedback[activeStep] && feedback[activeStep].answers) {
      const allRated = feedback[activeStep].answers.every((answer) => answer !== '');
      if (allRated) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        alert('Please rate all questions in this category.');
      }
    } else {
      alert('Feedback data is missing.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (categoryIndex, questionIndex, value) => {
    const newFeedback = [...feedback];
    if (newFeedback[categoryIndex] && newFeedback[categoryIndex].answers) {
      newFeedback[categoryIndex].answers[questionIndex] = value;
      setFeedback(newFeedback);
    }
  };

  const handleCommentChange = (value) => {
    setFinalComment(value);
  };

  const handleSubmit = async () => {
    const ratingArray = feedback.flatMap((category) =>
      category.answers.map((rating, index) => ({
        performanceFeedbackQuestionId: category.ids[index],
        rating,
      }))
    );

    const data = {
      ratingArray,
      finalComment,
    };

    handleFormSubmit(data);
  };

  const handleClose = () => {
    setOpen360Form(false);
  };

  useEffect(() => {
    if (open360Form == false) {
      setEmployeeFormData(null);
      setEmployeeSelfFormData(null);

      setActiveStep(0);
    }
  }, [open360Form]);
  return (
    <div>
      <Dialog open={open360Form} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          {' '}
          <Typography>360 Performance Feedback Form</Typography>
          <Tooltip
            title={
              <div>
                <strong>Rating Criteria:</strong>
                <ul>
                  <li>1 - Poor</li>
                  <li>2 - Fair</li>
                  <li>3 - Good</li>
                  <li>4 - Very Good</li>
                  <li>5 - Excellent</li>
                </ul>
              </div>
            }
            arrow
          >
            <Button
              variant="outlined" // Use outlined to only highlight the border
              sx={{
                minWidth: 0, // Removes the default width
                padding: 1, // Adds padding around the icon
                borderRadius: '50%', // Makes the background circular
                width: 47, // Set a specific width
                height: 47, // Set a specific height to keep the button circular
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid transparent', // Start with no border
                '&:hover': {
                  borderColor: 'primary.main', // Change border color on hover
                  backgroundColor: 'transparent', // Keep background transparent on hover
                },
              }}
            >
              <Iconify icon="mdi:information" width={40} height={40} /> {/* Large icon */}
            </Button>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ padding: 6 }}>
          {error && <FormHelperText error>{error}</FormHelperText>}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ padding: 5 }}>
            {categories.map((category) => (
              <Step key={category.name}>
                <StepLabel>{category.name}</StepLabel>
              </Step>
            ))}
            <Step key="final-comments">
              <StepLabel>Final Comments</StepLabel>
            </Step>
          </Stepper>
          {activeStep < categories.length ? (
            <div>
              <Card
                sx={{ padding: 1, mb: 2, fontWeight: 'bolder', textAlign: 'center' }}
                variant="outlined"
              >
                Category: {categories[activeStep]?.name}
              </Card>
              <Grid container spacing={2}>
                {categories[activeStep]?.questions.map((question, qIndex) => (
                  <Grid item xs={6} key={qIndex}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body1">{question.questionText}</Typography>
                        <RadioGroup
                          row
                          value={feedback[activeStep]?.answers[qIndex] || ''}
                          onChange={(e) => handleInputChange(activeStep, qIndex, e.target.value)}
                        >
                          <FormControlLabel
                            disabled={!!employeeSelfFormData}
                            value="1"
                            control={<Radio />}
                            label="1"
                          />
                          <FormControlLabel
                            disabled={!!employeeSelfFormData}
                            value="2"
                            control={<Radio />}
                            label="2"
                          />
                          <FormControlLabel
                            disabled={!!employeeSelfFormData}
                            value="3"
                            control={<Radio />}
                            label="3"
                          />
                          <FormControlLabel
                            disabled={!!employeeSelfFormData}
                            value="4"
                            control={<Radio />}
                            label="4"
                          />
                          <FormControlLabel
                            disabled={!!employeeSelfFormData}
                            value="5"
                            control={<Radio />}
                            label="5"
                          />
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <div>
              {employeeSelfFormData ? (
                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    label="Assignments"
                    value={assignments}
                    disabled={!!employeeSelfFormData}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    label="Learning Done"
                    value={learningDone}
                    disabled={!!employeeSelfFormData}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    label="Future Learning"
                    value={futureLearning}
                    disabled={!!employeeSelfFormData}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    label="Self Score According to Company Weightages"
                    value={selfScore}
                    disabled={!!employeeSelfFormData}
                    margin="normal"
                  />
                </div>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Final Comments"
                  value={finalComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  margin="normal"
                />
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === categories.length ? (
            <Button disabled={!!employeeSelfFormData} onClick={handleNext} color="primary">
              Submit
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              color="primary"
              disabled={!feedback[activeStep]?.answers?.every((answer) => answer !== '')}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
