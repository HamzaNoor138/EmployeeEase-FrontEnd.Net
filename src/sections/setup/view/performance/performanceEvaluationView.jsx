import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { pdf } from '@react-pdf/renderer';
import { PerformanceFeedbackForm } from './350FormModal';
import { useUpdateEmployeeFormData } from 'src/api/performanceEvaluation';

import QuestionWeightageModal from './QuestionWeightageModal';
import { useAddPerformanceEvaluation } from 'src/api/performanceEvaluation';

import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import {
  useGetEmployeeFormData,
  useGetSelfEvaluationRecordPost,
  useGetAllEvaluationRecords,
  useGetTeamLeadEvaluationRecords,
  useGetAllCurrentEvaluationRecords,
  usegetEmployeePerformanceReportData,
} from 'src/api/performanceEvaluation';
import { useGetAllPerformanceQuestions } from 'src/api/performanceQuestion';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Spinner from '../../../../components/loading-screen/spinner';

import { PerformanceFeedbackFormWithoutModal } from './350FormModalWithoutModal';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EmployeeEvaluationPDF from './performance-pdf';
import { display } from '@mui/system';

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

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'Employee Name', flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 150, flex: 1 },
  { field: 'desginationName', headerName: 'Employee Designation', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 200, flex: 1 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150, flex: 1 },
  { field: 'evaluationDate', headerName: 'Evaluation Date', width: 150, flex: 1 },

  {
    field: 'evaluationStatus',
    headerName: 'Submission Status',
    width: 100,
    flex: 1,
    renderCell: (params) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: '25px',
          alignItems: 'center',
          height: '100%',
          marginLeft: '40px',
        }}
      >
        <Badge
          color={params.row.evaluationStatus == 'Submitted' ? 'success' : 'error'}
          badgeContent={params.row.evaluationStatus == 'Submitted' ? 'Submitted' : 'Not Submitted'}
        />
      </div>
    ),
    // This line hides the column if userType is not 'pe'
  },
];

export default function PerformanceEvaluationView() {
  const { enqueueSnackbar } = useSnackbar();

  const { submitFormAddEvaluation } = useAddPerformanceEvaluation();
  const { GetEmployeeFormData } = useGetEmployeeFormData();
  const { UpdateEmployeeFormData } = useUpdateEmployeeFormData();
  const { TeamLeadEvaluationRecords } = useGetTeamLeadEvaluationRecords();
  const { AllEvaluationRecords } = useGetAllEvaluationRecords();
  const [openWeightageModal, setOpenWeightageModal] = useState(false);
  const { GetSelfEvaluationRecordPost } = useGetSelfEvaluationRecordPost();
  const { EmployeePerformanceReportData } = usegetEmployeePerformanceReportData();
  const [open360Form, setOpen360Form] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const { AllCurrentEvaluationRecords } = useGetAllCurrentEvaluationRecords();
  const [employeeFormData, setEmployeeFormData] = useState(null);
  const [employeeSelfFormData, setEmployeeSelfFormData] = useState(null);
  const { PerformanceQuestions } = useGetAllPerformanceQuestions();

  const [performanceQuestionData, setPerformanceQuestionData] = useState(null);

  const [checkforEvaluation, setcheckforEvaluation] = useState(null);

  const [currentEvaluation, setCurrentEvaluation] = useState([]);

  const [userType, setUserType] = useState(null);

  const [teamLeadGridData, setGridData] = useState([]);

  const [columnsToDisplay, setColumnsToDisplay] = useState(TABLE_HEAD);

  const [employeeId, setEmployeeId] = useState(null);

  const HandleSubmit = async (data) => {
    const submitData = {
      QuestionRatings: data.ratingArray,
      finalComment: data.finalComment,
      employeeId: employeeId,
      leadUsername: sessionStorage.getItem('username'),
    };

    if (employeeFormData) {
      const response = await UpdateEmployeeFormData(submitData);
      setOpen360Form(false);
      if (response.code == '200') {
        enqueueSnackbar('Form has been updated successfully');
        setOpen360Form(false);
      } else {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      }

      console.log(response);
    } else {
      const response = await submitFormAddEvaluation(submitData);
      if (response.code == '200') {
        enqueueSnackbar('Form has been successfully Added');
        GetTeamLeadRecords();
        setOpen360Form(false);
      } else {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      }

      console.log(response);
    }
  };

  const EmployeeFormData = async (employeeId) => {
    const data = {
      date: null,
      employeeId,
    };

    const response = await GetEmployeeFormData(data);
    if (response.code == '200') {
      setEmployeeId(employeeId);
      setEmployeeFormData(response.data[0]);
      setOpen360Form(true);
    }
  };

  const SelfEmployeeFormData = async (employeeId) => {
    const response = await GetSelfEvaluationRecordPost(employeeId);
    if (response.code == '200' && response.data != null) {
      setEmployeeSelfFormData(response.data[0]);
      setOpen360Form(true);
    } else {
      enqueueSnackbar('Employee Self Record not Found', {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    }
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value == 1 && currentEvaluation.length == 0) {
      const GetTeamLeadRecords = async () => {
        const currentMembersForEvaluationList = await AllCurrentEvaluationRecords();
        setcheckforEvaluation(currentMembersForEvaluationList.code);

        if (currentMembersForEvaluationList.data.length > 0) {
          const gridData = currentMembersForEvaluationList.data.map((data, index) => ({
            id: index + 1,
            employeeId: data.employeeId,
            fullName: data.fullName.trim(),
            companyId: data.companyId,
            employeeCode: data.employeeCode?.trim(),
            email: data.email.trim(),
            evaluationStatus: data.evaluationStatus.trim(),
            phoneNumber: data.phoneNumber.trim(),
            desginationName: data.desginationName,
          }));

          setCurrentEvaluation(gridData);
          const columnsToDisplay = TABLE_HEAD.filter((column) => {
            if (column.field === 'evaluationDate') {
              return false;
            }

            return true;
          });
          setColumnsToDisplay(columnsToDisplay);
        }
      };
      GetTeamLeadRecords();
    } else if (value == 0 && userType == 'co') {
      const columnsToDisplay = TABLE_HEAD.filter((column) => {
        if (column.field === 'evaluationStatus') {
          return false;
        }

        return true;
      });
      setColumnsToDisplay(columnsToDisplay);
    } else if (value == 1 && currentEvaluation.length > 0) {
      const columnsToDisplay = TABLE_HEAD.filter((column) => {
        if (column.field === 'evaluationDate') {
          return false;
        }

        return true;
      });
      setColumnsToDisplay(columnsToDisplay);
    }
  }, [value]);

  const GetTeamLeadRecords = async () => {
    const currentMembersForEvaluationList = await TeamLeadEvaluationRecords();
    setcheckforEvaluation(currentMembersForEvaluationList.code);

    const gridData = currentMembersForEvaluationList.data.map((data, index) => ({
      id: index + 1,
      employeeId: data.employeeId,
      fullName: data.fullName.trim(),
      companyId: data.companyId,
      employeeCode: data.employeeCode?.trim(),
      email: data.email.trim(),
      evaluationStatus: data.evaluationStatus.trim(),
      desginationName: data.desginationName,
      phoneNumber: data.phoneNumber.trim(),
    }));

    setGridData(gridData);

    const columnsToDisplay = TABLE_HEAD.filter((column) => {
      if (column.field === 'evaluationDate') {
        return false;
      }
      return true;
    });

    setColumnsToDisplay(columnsToDisplay);
  };

  useEffect(() => {
    const userType = sessionStorage.getItem('userType');
    setUserType(userType);

    if (
      userType == 'pe' ||
      userType == 'Candidate_Performance' ||
      userType == 'interview_performance' ||
      userType == 'Candidate_interview_Performance'
    ) {
      GetTeamLeadRecords();
    } else if (userType == 'co') {
      const GetAllPerformanceRecords = async () => {
        const allPerformanceEvaluationList = await AllEvaluationRecords();

        const gridData = allPerformanceEvaluationList.data.map((data, index) => ({
          id: index + 1,
          performanceFeedbackId: data.performanceFeedbackId,
          fullName: data.fullName.trim(),
          companyId: data.companyId,
          employeeCode: data.employeeCode?.trim(),
          email: data.email.trim(),
          evaluationDate: data.evaluationDate,
          evaluationStatus: data.evaluationStatus.trim(),
          desginationName: data.desginationName,
          phoneNumber: data.phoneNumber.trim(),
        }));

        setGridData(gridData);

        const columnsToDisplay = TABLE_HEAD.filter((column) => {
          if (column.field === 'evaluationStatus') {
            return false;
          }
          return true;
        });

        setColumnsToDisplay(columnsToDisplay);
      };

      GetAllPerformanceRecords();
    }
  }, []);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const HandleEvalautionFormOpen = (employeeId) => {
    setOpen360Form(true);
    setEmployeeId(employeeId);
  };
  const [loading, setLoading] = useState(false);

  const fetchAndDownloadReport = async (row) => {
    setLoading(true);
    setLoadingRowId(row.id);

    try {
      // Fetch data
      const QuestionsData = await PerformanceQuestions();
      setPerformanceQuestionData(QuestionsData);

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
      setLoadingRowId(null);
    }
  };

  return (
    <Box
      sx={{ padding: 2, height: '100%' }}
      className={`main-container ${loadingSpinner ? 'blur' : ''}`}
    >
      {loadingSpinner && <Spinner />}
      <Helmet>PerformanceEvaluation</Helmet>
      <CustomBreadcrumbs
        heading="Performance Evaluation"
        links={[{ name: 'Dashboard' }, { name: 'Performance Evaluation' }, { name: 'List' }]}
        action={
          <>
            {userType == 'co' && (
              <Button
                component={RouterLink}
                onClick={() => {
                  setOpenWeightageModal(true);
                }}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add Questions Weightage
              </Button>
            )}
          </>
        }
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />
      {userType == 'co' && (
        <QuestionWeightageModal
          OpenQuestionModal={openWeightageModal}
          setOpenWeightageModal={setOpenWeightageModal}
        />
      )}

      {userType == 'co' ? (
        <Box sx={{ width: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Past Evaluation Records" {...a11yProps(0)} />
              <Tab label="Current Evaluation Status" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
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
                  rows={teamLeadGridData}
                  disableRowSelectionOnClick
                  onRowClick={(params, event) => event.stopPropagation()}
                  columns={[
                    ...columnsToDisplay,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      sortable: false,
                      flex: 1,
                      orderable: false,

                      renderCell: (params) => (
                        <Tooltip title="Fetch and Download Report">
                          <IconButton
                            onClick={() => fetchAndDownloadReport(params.row)}
                            disabled={loadingRowId === params.row.id} // Disable button only for the clicked row
                          >
                            {loadingRowId === params.row.id ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M6.5 20q-2.275 0-3.887-1.575T1 14.575q0-1.95 1.175-3.475T5.25 9.15q.425-1.8 2.125-3.425T11 4.1q.825 0 1.413.588T13 6.1v6.05l1.6-1.55L16 12l-4 4l-4-4l1.4-1.4l1.6 1.55V6.1q-1.9.35-2.95 1.838T7 11h-.5q-1.45 0-2.475 1.025T3 14.5t1.025 2.475T6.5 18h12q1.05 0 1.775-.725T21 15.5t-.725-1.775T18.5 13H17v-2q0-1.2-.55-2.238T15 7V4.675q1.85.875 2.925 2.588T19 11q1.725.2 2.863 1.488T23 15.5q0 1.875-1.312 3.188T18.5 20zm5.5-8.95"
                                />
                              </svg>
                            )}
                          </IconButton>
                        </Tooltip>
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
          <CustomTabPanel value={value} index={1}>
            {checkforEvaluation != 400 ? (
              <Card style={{ height: '100%', width: '100%' }}>
                <div style={{ height: '100%', width: '100%' }}>
                  <DataGrid
                    rows={currentEvaluation}
                    disableRowSelectionOnClick
                    onRowClick={(params, event) => event.stopPropagation()}
                    columns={columnsToDisplay}
                    getRowId={(row) => row.id}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 50, 100]}
                  />
                </div>
              </Card>
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
                {/* <Typography variant="subtitle1" gutterBottom>
                Time left until next evaluation Less Than:
                <span style={{ color: 'red' }}> {weeksLeft} weeks</span>
              </Typography> */}
              </Card>
            )}
          </CustomTabPanel>
        </Box>
      ) : checkforEvaluation == 400 ? (
        <Card
          sx={{
            width: '100%',

            maxWidth: 800,
            margin: 'auto',
            mt: 20,
            padding: 4,
            borderRadius: 2,
            height: 200,
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
          {/* <Typography variant="subtitle1" gutterBottom>
          Time left until next evaluation Less Than:
          <span style={{ color: 'red' }}> {weeksLeft} weeks</span>
        </Typography> */}
        </Card>
      ) : (
        <Card style={{ height: '100%', width: '100%' }}>
          <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={teamLeadGridData}
              disableRowSelectionOnClick
              onRowClick={(params, event) => event.stopPropagation()}
              columns={[
                ...columnsToDisplay,
                {
                  field: 'actions',
                  headerName: 'Actions',
                  sortable: false,
                  flex: 1,
                  orderable: false,

                  renderCell: (params) => (
                    <div>
                      {params.row.evaluationStatus == 'Submitted' ? (
                        <>
                          <Tooltip title="Edit Evaluation Form" placement="top" arrow>
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                EmployeeFormData(params.row.employeeId);
                              }}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Open 360 Evaluation Form" placement="top" arrow>
                            <IconButton
                              size="large"
                              color="primary"
                              onClick={() => HandleEvalautionFormOpen(params.row.employeeId)}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="See Self Review" placement="top" arrow>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            SelfEmployeeFormData(params.row.employeeId);
                          }}
                        >
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
                              stroke="green"
                              stroke-width="2"
                              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                            />
                            <path
                              stroke="green"
                              stroke-width="2"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </IconButton>
                      </Tooltip>
                    </div>
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
          </div>
        </Card>
      )}

      <PerformanceFeedbackForm
        open360Form={open360Form}
        setOpen360Form={setOpen360Form}
        handleFormSubmit={HandleSubmit}
        employeeFormData={employeeFormData}
        setEmployeeFormData={setEmployeeFormData}
        employeeSelfFormData={employeeSelfFormData}
        setEmployeeSelfFormData={setEmployeeSelfFormData}
      />
    </Box>
  );
}
