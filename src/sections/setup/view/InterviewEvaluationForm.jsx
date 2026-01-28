import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  TextField,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';

import { useGetAllQuestion } from 'src/api/interviewQuestion';

const CustomDialogContent = styled(DialogContent)`
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: darkgrey;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const InterviewEvaluationForm = ({ open, onClose, handleFeedbackSubmit }) => {
  const [responses, setResponses] = useState({});
  const [finalComments, setFinalComments] = useState('');
  const [finalDecision, setFinalDecision] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { questionList } = useGetAllQuestion();

  useEffect(() => {
    if (questionList) {
      const initialResponses = {};
      questionList.forEach((q) => {
        initialResponses[q.interviewQuestionId] = '';
      });
      setResponses(initialResponses);
    }
  }, [questionList]);

  useEffect(() => {
    if (!open) {
      resetFields();
    }
  }, [open]);

  useEffect(() => {
    validateForm();
  }, [responses, finalComments, finalDecision]);

  const handleChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleFinalDecisionChange = (event) => {
    setFinalDecision(event.target.value);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      const questionIds = Object.keys(responses).join(',');
      const ratings = Object.values(responses).join(',');
      const data = {
        interviewQuestionId: questionIds,
        ratings,
        finalComments,
        finalDecision,
      };

      handleFeedbackSubmit(data);
      onClose();
    }
  };

  const validateForm = () => {
    const allQuestionsAnswered = Object.values(responses).every((response) => response !== '');
    const allFieldsFilled = finalComments.trim() !== '' && finalDecision !== '';
    setIsFormValid(allQuestionsAnswered && allFieldsFilled);
  };

  const resetFields = () => {
    if (questionList) {
      const initialResponses = {};
      questionList.forEach((q) => {
        initialResponses[q.interviewQuestionId] = '';
      });
      setResponses(initialResponses);
    }
    setFinalComments('');
    setFinalDecision('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ padding: 5 }}>
      <DialogTitle>Interview Evaluation Form</DialogTitle>
      <Divider />
      <CustomDialogContent>
        {questionList.map((question) => (
          <FormControl
            component="fieldset"
            key={question.interviewQuestionId}
            fullWidth
            margin="normal"
            sx={{ mt: 5 }}
          >
            <FormLabel component="legend">
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                {question.question}
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-label={`question-${question.interviewQuestionId}`}
              name={`question-${question.interviewQuestionId}`}
              value={responses[question.interviewQuestionId]}
              onChange={(e) => handleChange(question.interviewQuestionId, e.target.value)}
            >
              <FormControlLabel value="5" control={<Radio />} label="5 – Exceptional" />
              <FormControlLabel value="4" control={<Radio />} label="4 – Above Average" />
              <FormControlLabel value="3" control={<Radio />} label="3 – Average" />
              <FormControlLabel value="2" control={<Radio />} label="2 – Satisfactory" />
              <FormControlLabel value="1" control={<Radio />} label="1 – Unsatisfactory" />
            </RadioGroup>
          </FormControl>
        ))}
        <FormControl component="fieldset" fullWidth margin="normal" sx={{ mt: 5 }}>
          <TextField
            label="Final Comments"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            required
            value={finalComments}
            onChange={(e) => setFinalComments(e.target.value)}
          />
        </FormControl>
        <FormControl component="fieldset" fullWidth margin="normal" sx={{ mt: 5 }}>
          <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Final Candidate Decision for Job
          </FormLabel>
          <RadioGroup
            row
            aria-label="final-decision"
            name="final-decision"
            value={finalDecision}
            onChange={handleFinalDecisionChange}
          >
            <FormControlLabel value="Recommended" control={<Radio />} label="Recommended" />
            <FormControlLabel value="NotRecommended" control={<Radio />} label="Not Recommended" />
            <FormControlLabel value="Deferred" control={<Radio />} label="Deferred" />
          </RadioGroup>
        </FormControl>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!isFormValid}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterviewEvaluationForm;
