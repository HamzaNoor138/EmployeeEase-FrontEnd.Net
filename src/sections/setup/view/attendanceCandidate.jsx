import React, { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { getAllCandidateAttendanceRecord } from 'src/api/candidateAttendance';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { format } from 'date-fns';
export default function AttendanceCandidate() {
  const { CandidateDataView } = getAllCandidateAttendanceRecord();

  const [filteredData, setFilteredData] = useState([]);
  const [monthView, setMonthView] = useState(new Date().getMonth() + 1); // Default to current month

  function getTotalDaysOfMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  useEffect(() => {
    if (CandidateDataView) {
      // Filter attendance data for the specific candidate and selected month

      // const currentDate = new Date();
      // const totalDays = currentDate.getDate();

      // // Generate a list of all dates in the month up to the current date
      // const daysInMonth = Array.from(
      //   { length: totalDays },
      //   (_, i) => new Date(currentDate.getFullYear(), monthView - 1, i + 1)
      // );

      const currentDate = new Date();
      const totalDays = currentDate.getDate();
      let daysInMonth;
      // Generate a list of all dates in the month up to the current date
      if (monthView == currentDate.getMonth() + 1) {
        daysInMonth = Array.from(
          { length: totalDays },
          (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 - 1, i + 1)
        );
      } else {
        let total = getTotalDaysOfMonth(monthView - 1, currentDate.getFullYear());
        daysInMonth = Array.from(
          { length: total },
          (_, i) => new Date(currentDate.getFullYear(), monthView - 1, i + 1)
        );
      }

      const candidateData = CandidateDataView.filter(
        (attendance) => new Date(attendance.attendanceDate).getMonth() + 1 === monthView
      );
      if (candidateData.length == 0) {
        setFilteredData([]);
        return;
      }

      const filteredData2 = daysInMonth.map((date, index) => {
        const record = candidateData.find(
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
              status: 'A',
            };
      });

      setFilteredData(filteredData2);
    }
  }, [CandidateDataView, monthView]);

  const convertToDay = (value) => {
    return value.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const columns = [
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
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.value === 'P' ? 'success' : 'error'}
          style={{ width: '80px', textAlign: 'center' }}
        >
          {params.value === 'P' ? 'Present' : 'Absent'}
        </Button>
      ),
      headerAlign: 'left', // Align column header to the right
      align: 'left', // Align cell content to the right
    },
  ];

  // const totalPresent = filteredData
  //   .flatMap((data) => data.attendanceRecords)
  //   .filter((record) => record.status === 'P').length;
  // const totalAbsent = filteredData
  //   .flatMap((data) => data.attendanceRecords)
  //   .filter((record) => record.status === 'A').length;
  // const totalDays = totalPresent + totalAbsent;

  return (
    <>
      <Box sx={{ padding: 2, height: '100%' }}>
        <CustomBreadcrumbs
          heading="Employee Attendance"
          links={[{ name: 'Dashboard' }, { name: 'Employee Attendance' }]}
          sx={{
            mb: { xs: 3, md: 5, p: 2 },
          }}
        />
        <Grid container spacing={2}>
          {/* Month Selector */}
          <Grid item xs={12} md={12} container justifyContent="flex-end" mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={monthView} onChange={(e) => setMonthView(e.target.value)}>
                  {[...Array(12).keys()].map((month) => (
                    <MenuItem key={month + 1} value={month + 1}>
                      {new Date(0, month).toLocaleString('en-US', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Attendance DataGrid */}
          <Grid item xs={12}>
            <Card
              sx={{
                width: '100%',
                '& .MuiDataGrid-root': {
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                },
              }}
            >
              <Typography variant="h6" gutterBottom align="center" sx={{ padding: 2 }}>
                Attendance Records
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'auto',
                  '& .MuiDataGrid-root': {
                    minWidth: {
                      xs: '150%',
                      sm: '100%',
                    },
                  },
                }}
              >
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  disableSelectionOnClick
                  getRowId={(row) => row.attendanceDate}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start', // Adjust cell alignment
                    },
                    '& .MuiDataGrid-columnHeader': {
                      textAlign: 'center', // Center align column headers
                    },
                    '& .MuiDataGrid-cell--right': {
                      justifyContent: 'flex-end', // Right align status column
                    },
                    '& .MuiDataGrid-cell--center': {
                      justifyContent: 'center', // Center align day column
                    },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
