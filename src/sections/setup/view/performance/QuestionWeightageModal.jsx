import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  FormHelperText,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

import {
  useAddWeightsOne,
  useUpdateWeights,
  useGetQuestionWeights,
} from 'src/api/performanceWeight';
import { useGetAllPerformanceQuestions } from 'src/api/performanceQuestion';
import { useSnackbar } from 'src/components/snackbar';
import { Box } from '@mui/system';

const QuestionWeightageModal = ({ OpenQuestionModal, setOpenWeightageModal }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [weights, setWeights] = useState({});
  const [categoryWeights, setCategoryWeights] = useState({});
  const [totalWeightage, setTotalWeightage] = useState(0);
  const { submitFormAddWeight } = useAddWeightsOne();

  const [QuestionWeightList, setQuestionWeightList] = useState(null);
  const [performanceQuestionsList, setPerformanceQuestionsList] = useState(null);

  const [filledWithDefault, setFilledWithDefault] = useState(false);
  const { GetQuestionWeights } = useGetQuestionWeights();

  const { updateWeightages } = useUpdateWeights();

  const [error, setError] = useState('');
  const { PerformanceQuestions } = useGetAllPerformanceQuestions();

  useEffect(() => {
    if (OpenQuestionModal) {
      const getData = async () => {
        const responseQuestionWeight = await GetQuestionWeights();
        setQuestionWeightList(responseQuestionWeight.data);

        const responsePerformanceQuestion = await PerformanceQuestions();
        setPerformanceQuestionsList(responsePerformanceQuestion.data);
      };

      getData();
    }
  }, [OpenQuestionModal]);

  useEffect(() => {
    if (QuestionWeightList && performanceQuestionsList) {
      const loadWeights = async () => {
        try {
          const groupedCategories = performanceQuestionsList.reduce((acc, question) => {
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

          if (QuestionWeightList.length > 0) {
            const initialWeights = {};
            QuestionWeightList.forEach((record) => {
              initialWeights[record.performanceFeedbackQuestionId] = record.weightage;
            });

            const initialCategoryWeights = {};
            fetchedCategories.forEach((category) => {
              initialCategoryWeights[category.name] = calculateCategoryWeightage(category.name);
            });

            setWeights(initialWeights);
            setCategoryWeights(initialCategoryWeights);
            setTotalWeightage(
              Object.values(initialCategoryWeights).reduce(
                (sum, weight) => sum + (parseFloat(weight) || 0),
                0
              )
            );
          } else {
            fillDefaultWeights();
            setFilledWithDefault(true);
          }
          setError('');
        } catch (err) {
          setError('Failed to load weights.');
        }
      };

      loadWeights();
    }
  }, [QuestionWeightList, performanceQuestionsList]);

  const calculateCategoryWeightage = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (!category) return 0;

    return category.questions.reduce(
      (sum, question) => sum + (parseFloat(weights[question.performanceFeedbackQuestionId]) || 0),
      0
    );
  };

  useEffect(() => {
    const updatedCategoryWeights = {};
    categories.forEach((category) => {
      const weightage = calculateCategoryWeightage(category.name);
      updatedCategoryWeights[category.name] = weightage;
    });
    setCategoryWeights(updatedCategoryWeights);
  }, [weights, categories]);

  useEffect(() => {
    const total = Object.values(categoryWeights).reduce(
      (sum, weight) => sum + (parseFloat(weight) || 0),
      0
    );
    setTotalWeightage(total);
  }, [categoryWeights]);

  const handleCategoryWeightChange = (categoryName, value) => {
    const newWeight = parseFloat(value) || 0;
    setCategoryWeights((prev) => {
      const updatedCategoryWeights = { ...prev, [categoryName]: newWeight };
      const newWeights = { ...weights };

      categories.forEach((category) => {
        if (category.name === categoryName) {
          const questionWeight = newWeight / category.questions.length;
          category.questions.forEach((question) => {
            newWeights[question.performanceFeedbackQuestionId] = questionWeight;
          });
        }
      });

      setWeights(newWeights);
      return updatedCategoryWeights;
    });
  };

  const handleWeightChange = (id, value) => {
    setWeights((prev) => {
      const updatedWeights = { ...prev, [id]: parseFloat(value) || 0 };
      return updatedWeights;
    });
  };

  const handleNext = () => {
    const allWeightsAssigned = categories[activeStep]?.questions.every(
      (question) => weights[question.performanceFeedbackQuestionId] > 0
    );

    if (totalWeightage <= 100 && allWeightsAssigned) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    } else {
      setError('Please assign weightage to all questions and ensure total weightage is 100%');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (totalWeightage !== 100) {
      setError('Total weightage must be 100%');
      return;
    }
    try {
      const isDefaultWeights = Object.values(weights).every((weight) => weight === 5);

      if (isDefaultWeights && filledWithDefault) {
        enqueueSnackbar('Question Weights Has Been set to Default');

        setOpenWeightageModal(false);
        setActiveStep(0);
        setFilledWithDefault(false);
      } else {
        const username = sessionStorage.getItem('username');

        if (QuestionWeightList.length > 0) {
          const updatedWeights = QuestionWeightList.map((weight) => {
            return {
              performanceQuestionWeightageId: weight.performanceQuestionWeightageId,
              performanceFeedbackQuestionId: weight.performanceFeedbackQuestionId,
              weightage: weights[weight.performanceFeedbackQuestionId],
            };
          });

          const data = {
            updatedWeights,
            username,
            isDefaultWeights,
          };

          const response = await updateWeightages(data);
          if (response.code == '200') {
            enqueueSnackbar('Question Weights Has Been Updated');
          } else {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
          }
        } else {
          const weightsArray = Object.entries(weights).map(([key, value]) => ({
            PerformanceFeedbackQuestionId: key,
            Weightage: value,
          }));

          const data = {
            username,
            Weightage: weightsArray,
          };

          const response = await submitFormAddWeight(data);
          if (response.code == '200') {
            enqueueSnackbar('Question Weights Has Been Added');
          } else {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
          }
        }
        setActiveStep(0);
        setOpenWeightageModal(false);
        setFilledWithDefault(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit weightages. Please try again.');
    }
  };

  const fillDefaultWeights = () => {
    const defaultWeights = {};
    performanceQuestionsList.forEach((question) => {
      defaultWeights[question.performanceFeedbackQuestionId] = 5;
    });
    setWeights(defaultWeights);
    const defaultCategoryWeights = {};
    categories.forEach((category) => {
      defaultCategoryWeights[category.name] = calculateCategoryWeightage(category.name);
    });
    setCategoryWeights(defaultCategoryWeights);
    setTotalWeightage(
      Object.values(defaultCategoryWeights).reduce(
        (sum, weight) => sum + (parseFloat(weight) || 0),
        0
      )
    );
  };

  const isWeightageValid = totalWeightage <= 100;
  const allWeightsAssigned = categories[activeStep]?.questions.every(
    (question) => weights[question.performanceFeedbackQuestionId] > 0
  );

  const CloseDialog = () => {
    setWeights({});
    setCategoryWeights({});
    setTotalWeightage(0);
    setActiveStep(0);
    setOpenWeightageModal(false);
  };

  const SetWeightsToZero = () => {
    setWeights({});
    setCategoryWeights({});
    setTotalWeightage(0);
  };

  return (
    <Box>
      <Dialog open={OpenQuestionModal} onClose={CloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Assign Weightage to Questions</DialogTitle>
        <DialogContent sx={{ overflowX: 'hidden', overflow: 'hidden' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {categories.map((category) => (
              <Step key={category.name}>
                <StepLabel>{category.name}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {categories.length > 0 && (
            <div>
              {categories.map((category, index) => (
                <div key={category.name} hidden={activeStep !== index}>
                  <TextField
                    fullWidth
                    type="number"
                    label={`Category Weightage (${category.name})`}
                    value={categoryWeights[category.name] || ''}
                    onChange={(e) => handleCategoryWeightChange(category.name, e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    margin="normal"
                  />
                  {category.questions.map((question) => (
                    <Grid
                      container
                      spacing={2}
                      key={question.performanceFeedbackQuestionId}
                      alignItems="center"
                    >
                      <Grid item xs={8}>
                        <Typography variant="body1">{question.questionText}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Weightage (%)"
                          value={weights[question.performanceFeedbackQuestionId] || ''}
                          onChange={(e) =>
                            handleWeightChange(
                              question.performanceFeedbackQuestionId,
                              e.target.value
                            )
                          }
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Typography variant="h6" gutterBottom>
                    Total Weightage for {category.name}: {calculateCategoryWeightage(category.name)}
                    %
                  </Typography>
                </div>
              ))}
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: totalWeightage > 100 ? 'red' : 'inherit' }}
              >
                Overall Total Weightage: {totalWeightage}%
              </Typography>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => fillDefaultWeights()}>Set Default Weightage (5% each)</Button>
          <Button onClick={() => SetWeightsToZero()}> Set Weights To Zero</Button>

          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === categories.length - 1 ? (
            <Button onClick={handleSubmit} color="primary" disabled={!isWeightageValid}>
              Submit
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              color="primary"
              disabled={!allWeightsAssigned || !isWeightageValid}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionWeightageModal;
