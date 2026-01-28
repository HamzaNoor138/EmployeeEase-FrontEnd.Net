import React, { useState, useEffect } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  FormHelperText,
  Tooltip,
  DialogTitle,
} from '@mui/material';

import { useGetAllPerformanceQuestions } from 'src/api/performanceQuestion';
import ComponentBlock from 'src/sections/_examples/component-block';
import Iconify from 'src/components/iconify';

export const PerformanceFeedbackFormWithoutModal = ({
  handleFormSubmit,
  employeeFormData = null,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState('');
  const [learningDone, setLearningDone] = useState('');
  const [futureLearning, setFutureLearning] = useState('');

  const { PerformanceQuestions } = useGetAllPerformanceQuestions();

  useEffect(() => {
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
                    rating.performanceFeedbackQuestionId === question.performanceFeedbackQuestionId
                );
                return feedback ? feedback.rating : '';
              }),
              ids: category.questions.map((q) => q.performanceFeedbackQuestionId),
            };
          });

          setFeedback(initialFeedback);
          setAssignments(employeeFormData.assignments || '');
          setLearningDone(employeeFormData.learningDone || '');
          setFutureLearning(employeeFormData.futureLearning || '');
        } else {
          setFeedback(
            fetchedCategories.map((category) => ({
              category: category.name,
              answers: category.questions.map(() => ''),
              ids: category.questions.map((q) => q.performanceFeedbackQuestionId),
            }))
          );
        }
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [employeeFormData]);

  const handleNext = () => {
    if (activeStep === categories.length) {
      // Final comments step
      if (assignments.trim() === '' || learningDone.trim() === '' || futureLearning.trim() === '') {
        alert('Please fill out all fields in the final step.');
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
    newFeedback[categoryIndex].answers[questionIndex] = value;
    setFeedback(newFeedback);
  };

  const handleAssignmentsChange = (e) => {
    setAssignments(e.target.value);
  };

  const handleLearningDoneChange = (e) => {
    setLearningDone(e.target.value);
  };

  const handleFutureLearningChange = (e) => {
    setFutureLearning(e.target.value);
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
      assignments,
      learningDone,
      futureLearning,
    };

    const response = await handleFormSubmit(data);

    if (response.code == '200') {
      setActiveStep(0);
    }
  };

  return (
    <div style={{ padding: '20px', width: '80%', margin: 'auto' }}>
      <Card variant="outlined" sx={{ padding: 2 }}>
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
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ padding: 2 }}>
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
            <Card sx={{ padding: 2, mb: 2, fontWeight: 'bolder', textAlign: 'center' }}>
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
                        <FormControlLabel value="1" control={<Radio />} label="1" />
                        <FormControlLabel value="2" control={<Radio />} label="2" />
                        <FormControlLabel value="3" control={<Radio />} label="3" />
                        <FormControlLabel value="4" control={<Radio />} label="4" />
                        <FormControlLabel value="5" control={<Radio />} label="5" />
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <div>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="Assignments"
              value={assignments}
              onChange={handleAssignmentsChange}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="Learning Done"
              value={learningDone}
              onChange={handleLearningDoneChange}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="Future Learning"
              value={futureLearning}
              onChange={handleFutureLearningChange}
              margin="normal"
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === categories.length ? (
            employeeFormData != null ? (
              <Button onClick={handleNext} color="primary">
                Update
              </Button>
            ) : (
              <Button onClick={handleNext} color="primary">
                Submit
              </Button>
            )
          ) : (
            <Button
              onClick={handleNext}
              color="primary"
              disabled={!feedback[activeStep]?.answers?.every((answer) => answer !== '')}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
