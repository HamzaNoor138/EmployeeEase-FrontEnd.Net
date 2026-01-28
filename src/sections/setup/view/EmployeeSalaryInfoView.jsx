import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import { useGetAllEmployeeSalaryInfo, GetInvoiceDetailsView } from 'src/api/EmployeeSalaryInfo';

import Iconify from 'src/components/iconify';
import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Spinner from '../../../components/loading-screen/spinner';
import InvoiceEmployeeDetails from './CompanyPayroll/invoice-employee';
import SalarySlipPDF from './CompanyPayroll/invoice-employee-download';
import { pdf } from '@react-pdf/renderer';
const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'companyName', headerName: 'Company Name', width: 200, flex: 1 },
  { field: 'totalSalary', headerName: 'Total Salary', width: 150, flex: 1 },
  { field: 'previousMonthAbsent', headerName: 'Absences (Previous Month)', width: 200, flex: 1 },
  { field: 'attendanceDeduction', headerName: 'Attendance Deduction', width: 150, flex: 1 },
  { field: 'bonusAmount', headerName: 'Bonus Amount', width: 150, flex: 1 },
  { field: 'employeeNetSalary', headerName: 'Net Salary', width: 150, flex: 1 },
  { field: 'paymentDateDisplay', headerName: 'Payment Date', width: 200, flex: 1 },

  {
    field: 'paymentStatus',
    headerName: 'Payment Status',
    width: 100,
    flex: 0.9,
    renderCell: (params) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: '25px',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Badge
          color={
            params.row.paymentStatus == 'p'
              ? 'success'
              : params.row.paymentStatus == 'np'
              ? 'warning'
              : 'error'
          }
          badgeContent={
            params.row.paymentStatus == 'p'
              ? 'Paid'
              : params.row.paymentStatus == 'np'
              ? 'Not Paid'
              : 'Over Due'
          }
        />
      </div>
    ),
  },
];

export default function EmployeeSalaryInfoView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { EmployeeSalaryinfoList } = useGetAllEmployeeSalaryInfo();

  const { InvoiceDetails } = GetInvoiceDetailsView();

  const quickEdit = useBoolean();

  const [slipData, setSlipData] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [yearCount, setYear] = useState(new Date().getFullYear());

  const hiddenFields = ['id', 'action'];

  const getTogglableColumns = () =>
    TABLE_HEAD.filter((TABLE_HEAD) => !hiddenFields.includes(TABLE_HEAD.field)).map(
      (TABLE_HEAD) => TABLE_HEAD.field
    );

  const fetchAndDownloadReport = async () => {
    try {
      const pdfDoc = <SalarySlipPDF invoice={slipData} employeePageInvoice={true} />;
      const pdfBlob = await pdf(pdfDoc).toBlob();

      // Create a download URL and trigger download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error fetching or generating report:', error);
    }
  };

  const GetInvoiceData = async (row) => {
    const responseData = await InvoiceDetails(row.candidateId);
    const SalaryDetail = tableData.find((e) => e.transactionId == row.transactionId);
    const SlipData = {
      ...responseData,
      ...SalaryDetail,
    };
    setSlipData(SlipData);
    setOpen(true);
  };

  useEffect(() => {
    if (EmployeeSalaryinfoList.length > 0) {
      const currentYear = new Date().getFullYear();
      const newGrid = EmployeeSalaryinfoList.map((data, index) => ({
        bonusAmount: data.bonusAmount || 0,
        attendanceDeduction: data.attendanceDeduction || 0,
        candidateId: data.candidateId,
        employeeNetSalary: data.employeeNetSalary || 'N/A',
        totalSalary: data.employeeNetSalary + data.attendanceDeduction,
        paymentStatus: data.paymentStatus,
        previousMonthAbsent: data.previousMonthAbsent || 'N/A',
        companyName: data.companyName,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        paymentDateDisplay: data.paymentDate
          ? new Date(data.paymentDate).toLocaleDateString()
          : 'N/A',
      })).filter(
        (data) =>
          (!data.paymentDate && currentYear == yearCount) ||
          (data.paymentDate && data.paymentDate.getFullYear() === yearCount)
      );

      setTableData(newGrid.map((e, index) => ({ ...e, id: index + 1 })));
    }
  }, [EmployeeSalaryinfoList, yearCount]);

  const handleClose3 = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      {loadingSpinner && <Spinner />}
      <Helmet>Employee Salary Information</Helmet>
      <CustomBreadcrumbs
        heading="Employee Salary Information"
        links={[{ name: 'Dashboard' }, { name: 'Employee Salary Information' }, { name: 'List' }]}
        // action={
        // //   <Button
        // //     component={RouterLink}
        // //     onClick={() => {
        // //       handleAddClick();
        // //     }}
        // //     variant="contained"
        // //     startIcon={<Iconify icon="mingcute:add-line" />}
        // //   >
        // //     Add
        // //   </Button>
        // }
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />

      <Dialog open={open} onClose={handleClose3} fullWidth maxWidth={'md'}>
        <DialogTitle>Employee Invoice</DialogTitle>

        <DialogContent
          sx={{
            pb: 5,
            overflowY: 'auto', // Enables vertical scrolling
            '&::-webkit-scrollbar': {
              width: '8px', // Width of the scrollbar
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0', // Track color
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // Scrollbar thumb color
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555', // Thumb color on hover
              },
            },
          }}
        >
          <InvoiceEmployeeDetails invoice={slipData} employeePageInvoice={true} />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose3}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={fetchAndDownloadReport}>
            Download Invoice
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        sx={{
          width: '100%',
          '& .MuiDataGrid-root': {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          },
        }}
      >
        <Box sx={{ padding: 3 }}>
          {' '}
          <FormControl
            sx={{ width: { xs: '100%', md: 300 } }}
            variant="outlined"
            size="small"
            style={{ minWidth: 200 }}
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
        </Box>
        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            '& .MuiDataGrid-root': {
              minWidth: {
                xs: '300%',
                sm: '100%',
              },
            },
          }}
        >
          <DataGrid
            rows={tableData}
            disableRowSelectionOnClick
            onRowClick={(params, event) => event.stopPropagation()}
            columns={[
              ...TABLE_HEAD,
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                orderable: false,

                renderCell: (params) => (
                  <div>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        disabled={params.row.paymentStatus == 'p' ? false : true}
                        color="primary"
                        onClick={() => GetInvoiceData(params.row)}
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
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteItem(selectedRow);
              setConfirmDialogOpen(false);
            }}
          >
            Delete
          </Button>
        }
      />
    </Box>
  );
}
