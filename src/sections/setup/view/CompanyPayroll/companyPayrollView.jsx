import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  Divider,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import { useGetAllState } from 'src/api/addState';
import Iconify from 'src/components/iconify';
import {
  GetInvoiceDetailsView,
  useGetAllCompanyPayrollInfo,
  useAddList,
} from 'src/api/salaryDistribute';
import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from '../add';
import Spinner from '../../../../components/loading-screen/spinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Slide from '@mui/material/Slide';

import InvoiceDetailsView from './invoice-details';

import { pdf } from '@react-pdf/renderer';
import InvoicePDFDownload from './InvoicePdfDownload';
import InvoiceEmployeeDetails from './invoice-employee';
import SalarySlipPDF from './invoice-employee-download';
import InvoiceAnalytic from './invoice-analytic';
import Scrollbar from 'src/components/scrollbar';
import { borderRadius, Box, Stack } from '@mui/system';
import { fPkrCurrency } from 'src/utils/format-number';

const WrapHeaderText = ({ text }) => (
  <div style={{ whiteSpace: 'normal', lineHeight: 'normal' }}>{text}</div>
);

const isJoinedLastMonth = (joinDate) => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const joinDateObj = new Date(joinDate);
  return joinDateObj >= lastMonth && joinDateObj < today;
};

function getTotalDaysOfMonth(companyJoinedDate) {
  const date = new Date(companyJoinedDate);

  return new Date(date.getFullYear(), date.getMonth() - 1, 0).getDate();
}

function getEmployeeJoinedDate(companyJoinedDate) {
  return new Date(companyJoinedDate).getDate();
}

const TABLE_HEAD = [
  {
    field: 'id',
    headerName: 'Sr. #',
    flex: 0.25,
    renderHeader: () => <WrapHeaderText text="Sr. #" />,
  },
  {
    field: 'fullName',
    headerName: 'Employee Name',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Employee Name" />,
  },
  {
    field: 'employeeCode',
    headerName: 'Employee Code',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Employee Code" />,
  },
  {
    field: 'grossSalary',
    headerName: 'Employee Gross Salary',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Employee Gross Salary" />,
  },
  {
    field: 'hrmsFee',
    headerName: 'HRMS Fee',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="HRMS Fee" />,
  },
  {
    field: 'previousMonthAbsent',
    headerName: 'Previous Month Absent',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Previous Month Absent" />,
  },

  {
    field: 'currentGrossSalary',
    headerName: 'Employee Salary',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Employee Salary" />,
    renderCell: (params) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{params.value}</span>
        {isJoinedLastMonth(params.row.companyJoinedDate) && (
          <Tooltip
            title={`Employee joined last month on ${new Date(
              params.row.companyJoinedDate
            ).toLocaleDateString()} only  ${
              getTotalDaysOfMonth(params.row.companyJoinedDate) -
              getEmployeeJoinedDate(params.row.companyJoinedDate)
            } days salary is calculated`}
            placement="top"
            arrow
          >
            <Iconify
              icon="ic:outline-info"
              style={{ color: 'red', marginLeft: '20px' }} // marginLeft: 'auto' pushes the icon to the right
            />
          </Tooltip>
        )}
      </div>
    ),
  },

  {
    field: 'totalAbsent',
    headerName: 'Total Absent',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Total Absent" />,
  },
  {
    field: 'attendanceDeduction',
    headerName: 'Attendance Deduction',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Attendance Deduction" />,
  },
  {
    field: 'bonus',
    headerName: 'Bonus',
    flex: 0.8,
    renderHeader: () => <WrapHeaderText text="Bonus" />,
  },
  {
    field: 'totalNetSalary',
    headerName: 'Employee Net Salary',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Employee Net Salary" />,
  },
  {
    field: 'totalSalary',
    headerName: 'Total Net Salary',
    flex: 1,
    renderHeader: () => <WrapHeaderText text="Total Salary" />,
  },
  {
    field: 'paymentStatus',
    headerName: 'Status',
    flex: 0.7,
    renderHeader: () => <WrapHeaderText text="Status" />,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompanyPayrollView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const { companyPayrollList, refetchData } = useGetAllCompanyPayrollInfo();
  const { CompanyPaymentInfoAddList } = useAddList();
  const { InvoiceDetails } = GetInvoiceDetailsView();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [bonus, setBonus] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const theme = useTheme();
  const handleClickOpen = (employeeId) => {
    setEmployeeId(employeeId);
    setBonus('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBonus('');
  };

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', padding: 2 }}>
      <GridToolbar sx={{ backgroundColor: 'inherit', borderRadius: 2, padding: 1 }} />{' '}
      {/* Existing export button */}
      {rowSelectionModel.length > 0 && (
        <Button
          component={RouterLink}
          onClick={() => {
            handleAddClick();
          }}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Process To Transaction
        </Button>
      )}
    </GridToolbarContainer>
  );

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  useEffect(() => {
    console.log('row model', rowSelectionModel);
  }, [rowSelectionModel]);

  const handleBonusClick = () => {
    const updatedtable = tableData.map((record) => {
      const emp = companyPayrollList.find((emp) => emp.employeeId == record.employeeId);

      if (record.employeeId == employeeId) {
        record.bonus = bonus;
        record.totalSalary =
          parseInt(emp.currentGrossSalary - emp.attendanceDeduction) + parseInt(bonus);
      }
      return record;
    });

    setTableData(updatedtable);
    setOpen(false);
  };

  const fetchAndDownloadReport = async () => {
    try {
      const pdfDoc = <InvoicePDFDownload invoice={invoiceData} />;
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

  const DownloadEmoloyeeInvoice = async () => {
    try {
      const pdfDoc = <SalarySlipPDF invoice={invoiceData} />;
      const pdfBlob = await pdf(pdfDoc).toBlob();

      // Create a download URL and trigger download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Employee-Invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error fetching or generating report:', error);
    }
  };

  const handleAddClick = async () => {
    const data = {
      employees: rowSelectionModel,
      companyUsername: sessionStorage.getItem('username'),
    };

    const response = await InvoiceDetails(data);

    const responseData = response.data[0];

    const invoiceEmployeeData = tableData.flatMap((emp) => {
      const accountData = responseData.employeeData.find(
        (emps) => emps.employeeId === emp.employeeId
      );
      return accountData ? { ...emp, ...accountData } : []; // Return an array if found, empty array if not
    });

    const invoiceData = {
      invoiceEmployeeData,
      companyAddress: responseData.companyAddress,
      companyName: responseData.companyName,
      companyPhoneNo: responseData.companyPhoneNo,
    };

    console.log('inv', invoiceData);
    setInvoiceData(invoiceData);
    setOpen2(true);
  };

  const handleOpenEmployeeInvoice = async (employeeId) => {
    const data = {
      employees: [employeeId],
      companyUsername: sessionStorage.getItem('username'),
    };

    const response = await InvoiceDetails(data);

    const responseData = response.data[0];

    const invoiceEmployeeData = tableData.flatMap((emp) => {
      const accountData = responseData.employeeData.find(
        (emps) => emps.employeeId === emp.employeeId
      );
      return accountData ? { ...emp, ...accountData } : []; // Return an array if found, empty array if not
    });

    const invoiceData = {
      invoiceEmployeeData,
      companyAddress: responseData.companyAddress,
      companyName: responseData.companyName,
      companyPhoneNo: responseData.companyPhoneNo,
    };

    console.log('inv', invoiceData);
    setInvoiceData(invoiceData);
    setOpen3(true);
  };

  const handleFormSubmit = async (data) => {
    const updatedData = {
      cityId: data?.cityId,
      fullName: data?.fullName.trim(),
      code: data?.code.trim(),
      stateId: data?.stateId,
      statusId: data?.statusId || 0,
    };

    let newErrorDetails = '';

    if (
      cityList.some(
        (item) =>
          item.fullName.toLowerCase().trim() === data.fullName.toLowerCase().trim() &&
          item.cityId !== data.cityId
      )
    ) {
      newErrorDetails = 'City Already Exists';
    } else if (
      cityList.some(
        (item) =>
          item.code.toLowerCase().trim() === data.code.toLowerCase().trim() &&
          item.cityId !== data.cityId
      )
    ) {
      newErrorDetails = 'City Code Already Exists';
    }

    setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormAdd(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRow(null);
        await refetchData();
      } else {
        try {
          const response = await submitFormUpdate(updatedData);
          if (response && response.code === '201' && response.message) {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
            await refetchData();
          } else {
            quickEdit.onFalse();
            enqueueSnackbar('Record has been updated successfully');
            setSelectedRow(null);
            await refetchData();
          }
        } catch (error) {
          console.error('Error Updating record:', error);
        }
      }
    }
  };

  const Transaction = async () => {
    const data = invoiceData.invoiceEmployeeData.map((e) => {
      return {
        payrollId: e.payrollId,
        totalSalary: e.totalSalary,
        employeeNetSalary: e.totalNetSalary,
        attendanceDeduction: e.attendanceDeduction,
        previousMonthAbsent: e.previousMonthAbsent,
        bonusAmount: e.bonus,
        paymentStatus: 'p',
      };
    });

    const response = await CompanyPaymentInfoAddList(data);

    if (response.code == '200') {
      enqueueSnackbar(response.message);

      handleClose2();
      refetchData();
      setRowSelectionModel([]);
    } else {
      enqueueSnackbar(response.message, {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    }
  };

  const deleteItem = async (e) => {
    e.statusId = 2;

    const data = e;

    try {
      const response = await submitFormUpdate(data);

      if (response && response.code === '201' && response.message) {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
        await refetchData();
      } else {
        enqueueSnackbar('Record Deleted');
        await refetchData();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      await refetchData();
    }
  };

  const hiddenFields = ['field', 'action'];

  const getTogglableColumns = () =>
    TABLE_HEAD.filter((TABLE_HEAD) => !hiddenFields.includes(TABLE_HEAD.field)).map(
      (TABLE_HEAD) => TABLE_HEAD.field
    );

  useEffect(() => {
    const gridData = companyPayrollList.map((data, index) => ({
      id: index + 1,
      employeeId: data.employeeId,
      fullName: data.fullName.trim(),
      companyId: data.companyId.trim(),
      companyJoinedDate: data.companyJoinedDate,
      employeeCode: data.employeeCode,
      grossSalary: parseInt(data.currentGrossSalary),
      hrmsFee: parseInt(data.hrmsFee),
      totalAbsent: data.totalAbsent,
      attendanceDeduction: parseInt(data.attendanceDeduction),
      currentGrossSalary: parseInt(data.currentGrossSalary) - parseInt(data.hrmsFee),
      totalNetSalary: parseInt(data.currentGrossSalary - data.attendanceDeduction - data.hrmsFee),
      totalSalary: parseInt(data.currentGrossSalary - data.attendanceDeduction),
      bonus: data?.bonusAmount ? data.bonusAmount : 0,
      previousMonthAbsent: data.previousMonthAbsent,
      payrollId: data.payrollId,
      transactionId: data.transactionId,
      paymentStatus: data.paymentStatus,
    }));

    setTableData(gridData);
  }, [companyPayrollList]);

  const calulatePrice = (status) => {
    const TotalPrice = tableData.reduce((acc, data) => {
      if (status === 'total') {
        return acc + data.totalSalary;
      } else if (status === 'paid' && data.paymentStatus === 'p') {
        return acc + data.totalSalary;
      } else if (status === 'pending' && data.paymentStatus === 'np') {
        return acc + data.totalSalary;
      } else if (status === 'overdue' && data.paymentStatus === 'od') {
        return acc + data.totalSalary;
      }

      return acc; // Return accumulator if no condition is met
    }, 0);

    return TotalPrice;
  };

  const calulateLength = (status) => {
    const TotalPrice = tableData.filter((data) => data.paymentStatus == status).length;

    return TotalPrice;
  };

  const calulatePercentage = (status) => {
    let length = 0;

    if (status === 'total') {
      length = tableData.length;
    } else {
      length = tableData.filter((data) => data.paymentStatus == status).length;
    }

    return (length * 100) / tableData.length;
  };

  return (
    <>
      <Dialog open={open2} onClose={handleClose2} fullWidth maxWidth={'xl'}>
        <DialogTitle>Company Invoice</DialogTitle>

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
          <InvoiceDetailsView invoice={invoiceData} />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose2}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={fetchAndDownloadReport}>
            Download Invoice
          </Button>
          <Button variant="contained" onClick={Transaction}>
            Process Transaction
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open3} onClose={handleClose3} fullWidth maxWidth={'md'}>
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
          <InvoiceEmployeeDetails invoice={invoiceData} />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose3}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={DownloadEmoloyeeInvoice}>
            Download Invoice
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ padding: 2, height: '100%' }}>
        <Helmet>Company Payroll</Helmet>
        <CustomBreadcrumbs
          heading="Company Payroll"
          links={[{ name: 'Dashboard' }, { name: 'Company Payroll' }, { name: 'List' }]}
          sx={{
            mb: { xs: 3, md: 5, p: 2 },
          }}
        />

        <Card>
          {quickEdit.value && (
            <Add
              currentUser={isAddMode ? null : selectedRow}
              onClose={quickEdit.onFalse}
              open={quickEdit.value}
              onSubmitInsert={handleFormSubmit}
              title={addTitle}
              fields={fields}
              selectedObj={selectedRow}
              onFieldChange={handleDropdownChange}
              errorMessage={errorDetails}
            />
          )}
        </Card>

        {tableData.length > 0 && (
          <Card
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            <Scrollbar>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <InvoiceAnalytic
                  title="Total"
                  total={tableData.length}
                  percent={calulatePercentage('total')}
                  price={calulatePrice('total')}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.info.main}
                />

                <InvoiceAnalytic
                  title="Paid"
                  total={calulateLength('p')}
                  percent={calulatePercentage('p')}
                  price={calulatePrice('paid')}
                  icon="solar:file-check-bold-duotone"
                  color={theme.palette.success.main}
                />

                <InvoiceAnalytic
                  title="Pending"
                  total={calulateLength('np')}
                  percent={calulatePercentage('np')}
                  price={calulatePrice('pending')}
                  icon="solar:sort-by-time-bold-duotone"
                  color={theme.palette.warning.main}
                />

                <InvoiceAnalytic
                  title="Overdue"
                  total={calulateLength('od')}
                  percent={calulatePercentage('od')}
                  price={calulatePrice('overdue')}
                  icon="solar:bell-bing-bold-duotone"
                  color={theme.palette.error.main}
                />
              </Stack>
            </Scrollbar>
          </Card>
        )}

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
                  xs: '400%',
                  sm: '100%',
                },
              },
            }}
          >
            <DataGrid
              checkboxSelection
              onRowSelectionModelChange={(newRowSelectionModel) => {
                const updateddata = newRowSelectionModel.filter((elem) =>
                  tableData.some(
                    (tb) =>
                      elem == tb.employeeId &&
                      (tb.paymentStatus == 'np' || tb.paymentStatus == 'od')
                  )
                );

                setRowSelectionModel(updateddata);
              }}
              rowSelectionModel={rowSelectionModel}
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
                  flex: 0.7,

                  renderCell: (params) => (
                    <div>
                      {params.row.paymentStatus == 'p' ? (
                        <Tooltip title="View Employee Reciept" placement="top" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEmployeeInvoice(params.row.employeeId)}
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
                      ) : (
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => handleClickOpen(params.row.employeeId)}
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
                      )}
                    </div>
                  ),
                },
              ]}
              getRowId={(row) => row.employeeId}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  onButtonClick: () => {
                    alert('Custom Action Clicked!');
                  },
                },
              }}
              pageSizeOptions={[5, 10, 50, 100]}
            />
          </Box>
        </Card>

        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
        >
          <DialogTitle>Enter Bonus</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the Bonus Price for:</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="bonus"
              label="Enter Bonus"
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              fullWidth
              sx={{ mt: 3 }}
              variant="standard"
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleBonusClick} type="submit">
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
    </>
  );
}
