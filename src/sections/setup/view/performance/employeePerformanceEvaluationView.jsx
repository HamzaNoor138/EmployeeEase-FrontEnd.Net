import React, { useEffect, useState } from 'react';

import {
  useGetSelfEvaluationRecord,
  useAddSelfEvaluationRecord,
  useUpdateSelfEvaluationRecord,
} from 'src/api/selfPerformanceEvaluation';
import Tabs from '@mui/material/Tabs';
import { DataGrid } from '@mui/x-data-grid';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { useSnackbar } from 'src/components/snackbar';
import { useGetAllPerformanceQuestions } from 'src/api/performanceQuestion';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { PerformanceFeedbackFormWithoutModal } from './350FormModalWithoutModal';
import { GetEmployeePastEvaluationRecords } from 'src/api/selfPerformanceEvaluation';
import {
  Card,
  Typography,
  Box,
  Tooltip,
  Badge,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  Button,
} from '@mui/material';
import { usegetEmployeePerformanceReportData } from 'src/api/performanceEvaluation';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import EmployeeEvaluationPDF from './performance-pdf';
import { useBoolean } from 'src/hooks/use-boolean';
import { whitespace } from 'stylis';
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SelfPerformanceEvaluationView() {
  const { enqueueSnackbar } = useSnackbar();
  const { selfEvaluationRecord, refetchData } = useGetSelfEvaluationRecord();
  const { AddSelfEvaluationRecord } = useAddSelfEvaluationRecord();
  const { EmployeePastEvaluationRecords } = GetEmployeePastEvaluationRecords();
  const { UpdateSelfEvaluationRecord } = useUpdateSelfEvaluationRecord();
  const { EmployeePerformanceReportData } = usegetEmployeePerformanceReportData();
  const evaluationMonths = [3, 6, 9, 12]; // Define the evaluation months
  const currentDate = new Date(); // Get the current date
  const currentMonth = currentDate.getMonth() + 1; // Get the current month (1-12)
  const currentYear = currentDate.getFullYear();
  const { PerformanceQuestions } = useGetAllPerformanceQuestions();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const view = useBoolean();

  const [questionData, setQuestionData] = useState(null);
  const [employeedata, setEmployeedata] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TABLE_HEAD_Evaluation = [
    { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
    { field: 'reviewerName', headerName: 'Reviewer Name', width: 200, flex: 1 },
    { field: 'companyName', headerName: 'Company Name', width: 200, flex: 1 },
    { field: 'finalScore', headerName: 'Final Score', width: 150, flex: 1 },
    {
      field: 'evaluationDate',
      headerName: 'Evaluation Date',
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginLeft: '50px',
          }}
        >
          <Badge color="info" badgeContent={params.row.evaluationDate} />
        </div>
      ),
    },
  ];

  const [employeePastDataGrid, setEmployeePastDataGrid] = useState([]);

  const FetchEmployeePastData = async () => {
    const response = await EmployeePastEvaluationRecords();

    const gridData = response.data.map((data, index) => ({
      id: index + 1,
      performanceFeedbackId: data.performanceFeedbackId,
      reviewerName: data.reviewerName?.trim(),
      companyName: data.companyName?.trim(),
      finalScore: data.finalScore,
      evaluationDate: data.evaluationDate,
    }));

    setEmployeePastDataGrid(gridData);
  };

  useEffect(() => {
    if (value == 1) {
      FetchEmployeePastData();
    }
  }, [value]);

  const fetchAndDownloadReport = async (row) => {
    setLoading(true);

    try {
      // Fetch data
      const QuestionsData = await PerformanceQuestions();

      const Employeedata = await EmployeePerformanceReportData(row.performanceFeedbackId);
      const pdfDoc = (
        <EmployeeEvaluationPDF
          Employeedata={Employeedata.data[0]}
          questionData={QuestionsData.data}
        />
      );
      const pdfBlob = await pdf(pdfDoc).toBlob();

      // Create a download URL and trigger download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Evaluation Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up the URL object
    } catch (error) {
      console.error('Error fetching or generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find the next evaluation month and year
  let nextEvaluationMonth, nextEvaluationYear;
  if (currentMonth > evaluationMonths[evaluationMonths.length - 1]) {
    nextEvaluationMonth = evaluationMonths[0];
    nextEvaluationYear = currentYear + 1;
  } else {
    nextEvaluationMonth = evaluationMonths.find((month) => month > currentMonth);
    nextEvaluationYear = currentYear;
  }

  // Calculate the time left until the next evaluation in weeks
  const weeksLeft = Math.ceil(
    (new Date(nextEvaluationYear, nextEvaluationMonth - 1) - currentDate) /
      (7 * 24 * 60 * 60 * 1000)
  );

  const HandleSubmit = async (data) => {
    const submitData = {
      QuestionRatings: data.ratingArray,
      assignments: data.assignments,
      learningDone: data.learningDone,
      futureLearning: data.futureLearning,
      leadUsername: sessionStorage.getItem('username'),
    };

    if (selfEvaluationRecord.data.length > 0) {
      const response = await UpdateSelfEvaluationRecord(submitData);

      if (response.code == '200') {
        enqueueSnackbar('Form has been updated successfully');
        refetchData();
      } else {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      }
      return response;
    } else {
      const response = await AddSelfEvaluationRecord(submitData);
      if (response.code == '200') {
        enqueueSnackbar('Form has been successfully Added');
        refetchData();
      } else {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      }
      return response;
    }
  };

  useEffect(() => {
    if (selfEvaluationRecord) {
      console.log(selfEvaluationRecord);
    }
  }, [selfEvaluationRecord]);

  const handlePdfView = async (row) => {
    const QuestionsData = await PerformanceQuestions();

    setQuestionData(QuestionsData);

    const Employeedata = await EmployeePerformanceReportData(row.performanceFeedbackId);

    setEmployeedata(Employeedata);

    view.onTrue();
  };

  return (
    <>
      <Box sx={{ padding: 2, height: '100%' }}>
        <CustomBreadcrumbs
          heading="Performance Evaluation"
          links={[{ name: 'Dashboard' }, { name: 'Performance Evaluation' }, { name: 'List' }]}
          sx={{
            mb: { xs: 3, md: 5, p: 2 },
          }}
        />
        <Dialog fullScreen open={view.value}>
          <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
            <DialogActions
              sx={{
                p: 1.5,
              }}
            >
              <Button color="inherit" variant="contained" onClick={view.onFalse}>
                Close
              </Button>
            </DialogActions>

            <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <EmployeeEvaluationPDF
                  Employeedata={employeedata?.data[0]}
                  questionData={questionData?.data}
                />
              </PDFViewer>
            </Box>
          </Box>
        </Dialog>

        <Box sx={{ width: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Employee Self Evaluation" {...a11yProps(0)} />
              <Tab label="Past Evaluation Results" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {selfEvaluationRecord.data?.length >= 0 && selfEvaluationRecord.code != 404 ? (
              <PerformanceFeedbackFormWithoutModal
                handleFormSubmit={HandleSubmit}
                employeeFormData={selfEvaluationRecord.data[0]}
              />
            ) : (
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 800,
                  margin: 'auto',
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ whiteSpace: 'nowrap' }} variant="h5" gutterBottom>
                  Evaluation Month has not Started yet
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Time left until next evaluation Less Than:
                  <span style={{ color: 'red' }}> {weeksLeft} weeks</span>
                </Typography>
              </Card>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Card
              sx={{
                width: '100%',
                '& .MuiDataGrid-root': {
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'auto',
                  '& .MuiDataGrid-root': {
                    minWidth: {
                      xs: '800px',
                      sm: '100%',
                    },
                  },
                }}
              >
                <DataGrid
                  rows={employeePastDataGrid}
                  disableRowSelectionOnClick
                  onRowClick={(params, event) => event.stopPropagation()}
                  columns={[
                    ...TABLE_HEAD_Evaluation,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      sortable: false,
                      flex: 1,
                      orderable: false,

                      renderCell: (params) => (
                        <>
                          <Tooltip title="Fetch and Download Report">
                            <IconButton
                              onClick={() => fetchAndDownloadReport(params.row)}
                              disabled={loading}
                            >
                              {loading ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                <Iconify icon="eva:cloud-download-fill" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View">
                            <IconButton onClick={() => handlePdfView(params.row)}>
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-width="2"
                                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                />
                                <path
                                  stroke="currentColor"
                                  stroke-width="2"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                            </IconButton>
                          </Tooltip>
                        </>
                      ),
                    },
                  ]}
                  getRowId={(row) => row.id}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 50, 100]}
                />
              </Box>
            </Card>
          </CustomTabPanel>
        </Box>
      </Box>
    </>
  );
}
