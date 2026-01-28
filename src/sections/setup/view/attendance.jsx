import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  IconButton,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormGroup,
  Select,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress, // Import LinearProgress
} from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { DataGrid } from '@mui/x-data-grid';
import MuiAlert from '@mui/material/Alert';
import { DatePicker } from '@mui/lab';
import { useAddAttendance } from 'src/api/attendance';
import {
  differenceInCalendarDays,
  differenceInMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  isValid,
  isSameMonth,
  format,
  min,
} from 'date-fns';
import { useGetAllAttenence, useUpdateOne } from 'src/api/attendance';
import { useLoadDataView } from 'src/api/attendance';
import { useDeleteOne } from 'src/api/attendance';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import { useMediaQuery, useTheme } from '@mui/material';
import { useCheckAttendance } from 'src/api/attendance';
import { preset } from 'swr/_internal';
import AttendancePDF from './AttendancePdf';
const CircularChart = ({ data }) => (
  <div style={{ marginBottom: '20px' }}>
    {/* Here you would render the actual chart based on the data */}
  </div>
);
const Attendance = () => {
  const [pending, setPending] = useState(true);
  const { data } = useGetAllAttenence();
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { updateAttendance } = useUpdateOne();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAddingAttendance, setIsAddingAttendance] = useState(false);
  const [isEditAttendance, setIsEditAttedance] = useState(false);
  const [isTodayMarked, setIsTodayMarked] = useState(false);
  const [isView, setIsView] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { employees, refetchAttendanceData } = useGetAllAttenence();
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [currentFirstName, setCurrentFirstName] = useState('');
  const navigate = useNavigate();
  const { handleSubmit } = useAddAttendance();
  const [action, setAction] = useState(false);
  const [box, setBox] = useState(false);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { refetchData, dataView, pendingView } = useLoadDataView();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [loadingView, setLoadingView] = useState(true);
  const [currentCandidateId, setCurrentCandidateId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  1100;
  const { attendanceData, employeesLoading, errors, validation } = useCheckAttendance();
  const [monthView, setMonthView] = useState(new Date().getMonth() + 1);
  const [yearCount, setYear] = useState(new Date().getFullYear());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [param, setParam] = useState('');
  const [selectAll, setSelectAll] = useState('');
  const [filteredData, setFilteredData] = useState(employees);
  const { deleteItem } = useDeleteOne();
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [employeeEditData, setEmployeeEditData] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleUpdate = async () => {
    selectedEdit.status = attendance;

    await updateAttendance(selectedEdit);
    refetchData();
    refetchAttendanceData();
  };
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setConfirmDialogOpen(true);
  };
  console.log('employee', employees);

  const handleDeleteConfirm = async () => {
    if (selectedRow) {
      await deleteItem(selectedRow.attendanceId, refetchData);
    }

    setConfirmDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
  };
  console.log('dataview', dataView);
  const convertToDay = (value) => {
    return value.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleButtonClick = (id, name) => {
    setIsView(true);
    setCurrentCandidateId(id);
    setCurrentFirstName(name);
  };
  useEffect(() => {
    if (attendanceData && Object.keys(attendanceData).length > 0) {
      setSnackbar({
        open: true,
        message: 'Attendance for today already exists. You can update the attendance.',
        severity: 'info',
      });
    }
  }, [attendanceData, setSnackbar]);

  useEffect(() => {
    refetchData();

    setTimeout(() => {
      setLoadingView(false);
    }, 500);
  }, [monthView]);

  useEffect(() => {
    if (action) {
      deleteAttendance();
      setAction(false);
    }
  }, [action]);
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    setMonth(currentMonth);
  }, []);

  useEffect(() => {
    setFilteredData(employees);
  }, [data]);

  useEffect(() => {
    const storedSearchText = window.sessionStorage.getItem('searchText');
    if (storedSearchText) {
      setSearchText(storedSearchText);
    }
  }, []);
  useEffect(() => {
    if (dataView) {
      console.log('check', dataView);

      const today = format(new Date(), 'yyyy-MM-dd');

      const attendanceData = dataView.reduce((acc, item) => {
        const attendanceDate = format(new Date(item.attendanceDate), 'yyyy-MM-dd');
        if (attendanceDate === today) {
          acc[item.candidateId] = {
            status: item.status,
            attendanceId: item.attendanceId,
          };
        }
        return acc;
      }, {});

      setAttendance(attendanceData);
      setIsTodayMarked(Object.keys(attendanceData).length > 0);
    }
  }, [dataView]);

  useEffect(() => {
    window.sessionStorage.setItem('searchText', searchText);
    if (searchText.trim() === '') {
      setFilteredData(employees);
    } else {
      const filtered = employees.filter(
        (item) => item.fullName && item.fullName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, employees]);

  function getTotalDaysOfMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  useEffect(() => {
    // If isView is true, ensure monthView is set to the current month

    if (dataView && isView) {
      const currentDate = new Date();
      const totalDays = currentDate.getDate();
      let daysInMonth;
      // Generate a list of all dates in the month up to the current date
      if (monthView == month) {
        daysInMonth = Array.from(
          { length: totalDays },
          (_, i) => new Date(yearCount, month - 1, i + 1)
        );
      } else {
        let total = getTotalDaysOfMonth(monthView, yearCount);
        daysInMonth = Array.from(
          { length: total },
          (_, i) => new Date(yearCount, monthView - 1, i + 1)
        );
      }

      const data = dataView.filter(
        (row) =>
          row.candidateId === currentCandidateId &&
          new Date(row.attendanceDate).getMonth() + 1 === monthView &&
          new Date(row.attendanceDate).getFullYear() === yearCount
      );

      if (data.length == 0) {
        setEmployeeEditData([]);
        return;
      }

      const filteredData2 = daysInMonth.map((date, index) => {
        const record = data.find(
          (item) =>
            format(new Date(item.attendanceDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        return record
          ? {
              ...record,
              id: index + 1,
            }
          : {
              id: index + 1,
              attendanceDate: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
              status: 'N',
              candidateId: currentCandidateId,
              attendanceId: null,
              companyId: null,
            };
      });

      setEmployeeEditData(filteredData2);
    }
  }, [isView, yearCount, monthView, dataView]);
  useEffect(() => {
    if (isAddingAttendance) {
      refetchData();
    } else {
      refetchData();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [month, isAddingAttendance, refetchData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  const onSubmit = async (e) => {
    console.log('e', attendance);
    await handleSubmit(e, attendance, employees, selectedDate, setSnackbar, setIsAddingAttendance);
    refetchData();
    refetchAttendanceData();
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleAttendanceEdit = (id, status) => {
    setAttendance((prevAttendance) => ({ ...prevAttendance, [id]: status }));
  };

  // const handleAttendanceChange = useCallback((row) => {
  //   console.log('check', attendance);
  //   setAttendance((prevAttendance) => ({
  //     ...prevAttendance,
  //     [row.id]: { attendanceId: row.attendanceId, status },
  //   }));
  // }, []);

  const [attendanceStatus, setAttendanceStatus] = useState({});

  const handleAttendanceChange = (row, status) => {
    setAttendanceStatus((prevStatus) => ({ ...prevStatus, [row.id]: status }));

    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [row.id]: { attendanceId: row.attendanceId, status },
    }));
  };

  {
    console.log('cureent employee', currentFirstName);
  }

  if (isView && currentCandidateId && currentFirstName && dataView) {
    const fetchAndDownloadReport = async (row) => {
      try {
        if (employeeEditData.length > 0) {
          const pdfDoc = (
            <AttendancePDF
              attendanceData={employeeEditData}
              candidateName={currentFirstName}
              month={monthView}
              year={yearCount}
            />
          );
          const pdfBlob = await pdf(pdfDoc).toBlob();

          // Create a download URL and trigger download
          const downloadUrl = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Attendance Report.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl); // Clean up the URL object
        } else {
          enqueueSnackbar('Attendance Record Doesnt Exist', {
            variant: 'border',
            style: { backgroundColor: '#FF5630', color: '#fff' },
          });
        }
      } catch (error) {
        console.error('Error fetching or generating report:', error);
      } finally {
        //   setLoading(false);
      }
    };

    return (
      <Box sx={{ padding: 2, height: '100%' }}>
        <CustomBreadcrumbs
          heading="Attendance Detail"
          links={[{ name: 'Dashboard' }, { name: 'Employee Attedance' }, { name: 'List' }]}
          sx={{
            mb: { xs: 3, md: 5, p: 2 },
          }}
        />

        <Card elevation={13} style={{ padding: 20, width: '100%', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom>
            {`All Attendance Records of ${dataView.length !== 0 ? currentFirstName : 'Employee'}`}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },

              padding: '10px',
            }}
          >
            <Box>
              <Button
                sx={{ width: 150 }}
                variant="contained"
                color="primary"
                onClick={() => setIsView(false)}
              >
                &#8249; Back
              </Button>
            </Box>
            <Box sx={{ mt: { xs: 5 } }}>
              <FormControl variant="outlined" size="small" sx={{ width: { xs: '100%', md: 200 } }}>
                <InputLabel id="select-month-label">Select Month</InputLabel>
                <Select
                  labelId="select-month-label"
                  value={monthView}
                  onChange={(e) => setMonthView(e.target.value)}
                  label="Select Month"
                >
                  <MenuItem value={1}>January</MenuItem>
                  <MenuItem value={2}>February</MenuItem>
                  <MenuItem value={3}>March</MenuItem>
                  <MenuItem value={4}>April</MenuItem>
                  <MenuItem value={5}>May</MenuItem>
                  <MenuItem value={6}>June</MenuItem>
                  <MenuItem value={7}>July</MenuItem>
                  <MenuItem value={8}>August</MenuItem>
                  <MenuItem value={9}>September</MenuItem>
                  <MenuItem value={10}>October</MenuItem>
                  <MenuItem value={11}>November</MenuItem>
                  <MenuItem value={12}>December</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: { xs: '100%', md: 200 }, mt: { xs: 2, md: 0 }, ml: { xs: 0, md: 2 } }}
                variant="outlined"
                size="small"
              >
                <InputLabel id="select-year-label">Select Year</InputLabel>
                <Select
                  labelId="select-year-label"
                  value={yearCount}
                  onChange={(e) => setYear(e.target.value)}
                  label="Select year"
                >
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                  <MenuItem value={2030}>2030</MenuItem>
                </Select>
              </FormControl>

              <Button
                sx={{
                  mt: { xs: 2, md: 0 },
                  ml: { xs: 0, md: 2 },

                  width: { xs: '100%', md: 200 },
                  height: 40,
                  whiteSpace: 'nowrap',
                }}
                variant="outlined"
                onClick={fetchAndDownloadReport}
              >
                {' '}
                Download Attendance Report
              </Button>
            </Box>
          </Box>

          {dataView.length !== 0 && <CircularChart dataView={dataView} />}

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
                rows={employeeEditData}
                disableRowSelectionOnClick
                onRowClick={(params, event) => event.stopPropagation()}
                columns={[
                  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
                  {
                    field: 'attendanceDate',
                    headerName: 'Date',
                    flex: 1,
                    valueGetter: (params) => {
                      const date = new Date(params.value);
                      return !isNaN(date.getTime()) ? format(date, 'yyyy-MM-dd') : 'Invalid Date';
                    },
                  },
                  {
                    field: 'day',
                    headerName: 'Day',
                    flex: 1,
                    valueGetter: (params) => {
                      const date = new Date(params.row.attendanceDate);
                      return !isNaN(date.getTime()) ? convertToDay(date) : 'Invalid Day';
                    },
                  },
                  {
                    field: 'status',
                    headerName: 'Attendance Status',
                    flex: 1,
                    renderCell: (params) =>
                      params.value === 'P' ? (
                        <Button sx={{ width: 110 }} variant="contained" color="success">
                          Present
                        </Button>
                      ) : params.value === 'N' ? (
                        <Button variant="contained" color="warning">
                          Not Avaliable
                        </Button>
                      ) : (
                        <Button sx={{ width: 110 }} variant="contained" color="error">
                          Absent
                        </Button>
                      ),
                  },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    sortable: false,
                    renderCell: (params) => (
                      <div>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setBox(true);
                              setSelectedEdit(params.row);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none" stroke="currentColor" strokeWidth="1">
                                <path
                                  strokeLinecap="round"
                                  d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"
                                />
                                <path
                                  strokeLinecap="round"
                                  d="m2 12.5l1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5"
                                  opacity="0.5"
                                />
                                <path d="m18.562 2.935l.417-.417a1.77 1.77 0 0 1 2.503 2.503l-.417.417m-2.503-2.503s.052.887.834 1.669c.782.782 1.669.834 1.669.834m-2.503-2.503L14.727 6.77c-.26.26-.39.39-.5.533a2.948 2.948 0 0 0-.338.545c-.078.164-.136.338-.252.686l-.372 1.116m7.8-4.212L17.23 9.273c-.26.26-.39.39-.533.5a2.946 2.946 0 0 1-.545.338c-.164.078-.338.136-.686.252l-1.116.372m0 0l-.722.24a.477.477 0 0 1-.604-.603l.241-.722m1.085 1.085L13.265 9.65" />
                              </g>
                            </svg>
                          </IconButton>
                        </Tooltip>
                        <ConfirmDialog
                          open={box}
                          onClose={() => setBox(false)}
                          title="Edit Attendance"
                          content={
                            <>
                              <RadioGroup
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                              >
                                <FormControlLabel value="A" control={<Radio />} label="Absent" />
                                <FormControlLabel value="P" control={<Radio />} label="Present" />
                              </RadioGroup>
                            </>
                          }
                          action={
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handleUpdate();
                                setBox(false);
                              }}
                            >
                              Update
                            </Button>
                          }
                        />
                        <Tooltip title="Delete" placement="top" arrow>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDeleteClick(params.row)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 32 32"
                            >
                              <path
                                fill="#fb7a7a"
                                d="M13.5 6.5V7h5v-.5a2.5 2.5 0 0 0-5 0m-2 .5v-.5a4.5 4.5 0 1 1 9 0V7H28a1 1 0 1 1 0 2h-1.508L24.6 25.568A5 5 0 0 1 19.63 30h-7.26a5 5 0 0 1-4.97-4.432L5.508 9H4a1 1 0 0 1 0-2zm2.5 6.5a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0zm5-1a1 1 0 0 0-1 1v10a1 1 0 1 0 2 0v-10a1 1 0 0 0-1-1"
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
            </Box>
          </Card>

          <ConfirmDialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            title="Delete"
            content={<>Are you sure you want to delete?</>}
            action={
              <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            }
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Card>
      </Box>
    );
  }

  if (isAddingAttendance) {
    return (
      <div style={{ padding: '20px', position: 'relative' }}>
        <CustomBreadcrumbs
          heading="Add Attendance"
          links={[
            { name: 'Dashboard' },
            { name: 'Employee Attendance' },
            { name: 'Add Attendance' },
          ]}
          sx={{
            mb: { xs: 3, md: 5, p: 2 },
          }}
        />
        <Helmet>Attendance</Helmet>
        <Button variant="contained" color="primary" onClick={() => setIsAddingAttendance(false)}>
          &#8249; Back
        </Button>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '10px',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <Box sx={{ position: 'relative', top: { xs: '-50px', md: '-70px' } }}>
            <p>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                Marking Attendance for{' '}
              </span>
              {format(selectedDate, 'PP')}
            </p>
          </Box>
        </div>

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
                  xs: '130%',
                  sm: '100%',
                },
              },
            }}
          >
            <DataGrid
              rows={employees.map((employee, i) => ({
                ids: i + 1,
                id: employee.candidateId,
                attendanceId: employee.attendanceId,
                name: `${employee.fullName}`,
                present: attendance[employee.candidateId]?.status == 'P',
                absent:
                  !attendance[employee.candidateId]?.status ||
                  attendance[employee.candidateId]?.status === 'A',
              }))}
              columns={[
                { field: 'ids', headerName: 'Sr. #', width: 70 },
                {
                  field: 'name',
                  headerName: 'Employee Name',
                  minWidth: 250,
                  flex: isSmallScreen ? 0 : 1,
                },
                {
                  field: 'attendance',
                  headerName: 'Attendance',
                  flex: isSmallScreen ? 0.3 : 1,

                  renderCell: (params) => (
                    <FormGroup
                      row
                      sx={{
                        whiteSpace: 'wrap',
                        height: 70,
                        alignItems: 'center', // Optional: To align items vertically
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={attendanceStatus[params.row.id] === 'P' || params.row.present}
                            onChange={() => handleAttendanceChange(params.row, 'P')}
                          />
                        }
                        label="Present"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            checked={attendanceStatus[params.row.id] === 'A' || params.row.absent}
                            onChange={() => handleAttendanceChange(params.row, 'A')}
                          />
                        }
                        label="Absent"
                      />
                    </FormGroup>
                  ),
                },
              ]}
              disableRowSelectionOnClick
            />
          </Box>
        </Card>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 20,
          }}
        >
          <Button
            sx={{ width: isSmallScreen ? '100%' : 300 }}
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calculateAttendance = (candidateId) => {
    const attendanceRecords = dataView.filter(
      (attendance) =>
        attendance.candidateId === candidateId &&
        new Date(attendance.attendanceDate).getMonth() === currentMonth &&
        new Date(attendance.attendanceDate).getFullYear() === currentYear
    );

    const presentDays = attendanceRecords.filter((record) => record.status === 'P').length;
    const totalDays = Math.min(daysInMonth, currentDate.getDate());

    return Math.round((presentDays / totalDays) * 100);
  };

  const rows = filteredData.map((data, index) => ({
    ids: index + 1,
    id: data.candidateId,
    name: `${data.fullName}`,
    role: data.designation,
    attendance: calculateAttendance(data.candidateId),
  }));

  const columns = [
    { field: 'ids', headerName: 'Sr. #', width: 70, flex: 0.25 },
    { field: 'name', headerName: 'Name', flex: 2, minWidth: 250 },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 150 },
    {
      field: 'attendance',
      headerName: 'Attendance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            style={{
              height: 10,
              backgroundColor: params.value < 80 ? '#f44336' : '#4caf50',
              borderRadius: 5,
            }}
          />
          <Typography
            variant="caption"
            color={params.value < 80 ? 'error' : 'success'}
            style={{ textAlign: 'center' }}
          >
            {params.value}%
          </Typography>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title="View" placement="top" arrow>
          <IconButton
            color="primary"
            onClick={() => handleButtonClick(params.row.id, params.row.name)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
              />
            </svg>
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <CustomBreadcrumbs
        heading="Employee Attendance"
        links={[{ name: 'Dashboard' }, { name: 'Employee Attendance' }]}
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />
      <Helmet>Attendance</Helmet>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end', // Aligns content to the right
          marginBottom: '20px',
        }}
      >
        <Button variant="contained" color="primary" onClick={() => setIsAddingAttendance(true)}>
          Add New Attendance
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '10px',
          gap: '10px',
        }}
      >
        <div style={{ flex: 1 }}>
          <TextField
            variant="outlined"
            label="Search by Name"
            value={searchText}
            onChange={handleSearchChange}
            fullWidth
          />
        </div>
      </div>

      <Card style={{ width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[5, 10, 50, 100]}
        />
      </Card>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 20,
        }}
      ></div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Attendance;
