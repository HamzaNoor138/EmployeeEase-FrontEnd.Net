import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Box,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetAllCity, useAddOne, useUpdateOne } from 'src/api/addCity';

import { useGetAllState } from 'src/api/addState';
import Iconify from 'src/components/iconify';

import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from './add';
import Spinner from '../../../components/loading-screen/spinner';
import { useGetAllHrmsEmployeePaymentInfo } from 'src/api/HrmsEmployeepayment';
import Scrollbar from 'src/components/scrollbar';

import { Stack } from '@mui/system';
import InvoiceAnalytic from './CompanyPayroll/invoice-analytic';

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'companyName', headerName: 'Company Name', width: 200, flex: 1 },
  { field: 'employeeName', headerName: 'Employee Name', width: 200, flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 130, flex: 1 },
  { field: 'hrmsFee', headerName: 'HRMS Fee', width: 110, flex: 1 },
  { field: 'employeeNetSalary', headerName: 'EmployeeNet Salary', width: 130, flex: 1 },
  { field: 'previousMonthAbsent', headerName: 'Previous Month Absent', width: 160, flex: 1 },
  { field: 'attendanceDeduction', headerName: 'Attendance Deduction', width: 150, flex: 1 },
  { field: 'totalSalary', headerName: 'Total Salary', width: 130, flex: 1 },
  { field: 'bonusAmount', headerName: 'Bonus Amount', width: 120, flex: 0.8 },
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

export default function AddCityView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const { stateList, refetchDatta } = useGetAllState();
  const { cityList, refetchData } = useGetAllCity();
  const { submitFormAdd } = useAddOne();
  const { submitFormUpdate } = useUpdateOne();
  const { HrmsPaymentList } = useGetAllHrmsEmployeePaymentInfo();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [monthView, setMonthView] = useState(() => {
    const currentMonth = new Date().getMonth(); // Get zero-based month
    return currentMonth === 0 ? 12 : currentMonth; // If it's January, return 12
  });

  const [yearCount, setYear] = useState(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Get zero-based month
    const currentYear = currentDate.getFullYear();
    return currentMonth === 0 ? currentYear - 1 : currentYear; // Decrement year if month is January
  });

  const theme = useTheme();
  const fields = [
    {
      name: 'fullName',
      label: 'City Name',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },
    {
      name: 'code',
      label: 'City Code',
      mandatory: true,
      type: 'text',
      maxLength: 6,
    },

    {
      name: 'stateId',
      label: 'State',
      mandatory: true,
      type: 'dropdown',
      options: stateList.map((state) => ({
        key: state.stateId,
        value: state.fullName,
      })),
    },
    // {
    //   name: 'stateIds',
    //   label: 'states',
    //   mandatory: false,
    //   type: 'multiselect',
    //   options: dummyMultiselectObj,
    //   defaultValue: dummyDefaultValue,
    // },
    { name: 'statusId', label: 'Status', mandatory: false, type: 'switch' },
  ];

  const handleDropdownChange = (event, data) => {
    if (event.target.name === 'businessUnitId') {
      const updatedData = {
        campusId: data?.campusId,
        businessUnitId: event.target.value,
        cityId: data?.cityId || '',
        territoryId: data?.territoryId || '',
        fullName: data?.fullName.trim() || '',
        code: data?.code.trim() || '',
        email: data?.email.trim() || '',
        primaryContact: data?.primaryContact || '',
        secondaryContact: data?.secondaryContact || '',
        description: data?.description || '',
        statusId: data?.statusId || 0,
        address: data?.address,
        longitude: data?.longitude,
        latitude: data?.latitude,
        franchiseId: data?.franchiseId,
        customerCode: data?.customerCode,
        emailPrefix: data?.emailPrefix,
        testCampus: data?.testCampus || 0,
        feeCategoryId: data.feeCategoryId,
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'cityId') {
      if (Territors !== undefined && Territors.length) {
        const newterritorOptn = Territors.filter((item) => item.cityId === event.target.value).map(
          (territor) => ({
            key: territor.territoryId,
            value: territor.fullName.trim(),
          })
        );
        setTerritoryOptions(newterritorOptn);
      }

      console.log(data);
      const updatedData = {
        campusId: data?.campusId,
        businessUnitId: data?.businessUnitId,
        cityId: event.target.value,
        fullName: data?.fullName.trim() || '',
        code: data?.code.trim() || '',
        email: data?.email.trim() || '',
        primaryContact: data?.primaryContact || '',
        secondaryContact: data?.secondaryContact || '',
        description: data?.description || '',
        statusId: data?.statusId || 0,
        address: data?.address,
        longitude: data?.longitude,
        latitude: data?.latitude,
        franchiseId: data?.franchiseId,
        customerCode: data?.customerCode,
        emailPrefix: data?.emailPrefix,
        testCampus: data?.testCampus || 0,
        feeCategoryId: data.feeCategoryId,
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'franchiseId') {
      const updatedData = {
        campusId: data?.campusId,
        businessUnitId: data?.businessUnitId,
        cityId: data?.cityId,
        territoryId: data?.territoryId,
        fullName: data?.fullName.trim() || '',
        code: data?.code.trim() || '',
        email: data?.email.trim() || '',
        primaryContact: data?.primaryContact || '',
        secondaryContact: data?.secondaryContact || '',
        description: data?.description || '',
        statusId: data?.statusId || 0,
        address: data?.address,
        longitude: data?.longitude,
        latitude: data?.latitude,
        franchiseId: event.target.value,
        customerCode: data?.customerCode,
        emailPrefix: data?.emailPrefix,
        testCampus: data?.testCampus || 0,
        feeCategoryId: data.feeCategoryId,
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'feeCategoryIdId') {
      const updatedData = {
        campusId: data.campusId,
        businessUnitId: data.businessUnitId,
        cityId: data.cityId,
        territoryId: data.territoryId,
        fullName: data.fullName.trim(),
        code: data.code.trim(),
        email: data.email.trim(),
        primaryContact: data.primaryContact,
        secondaryContact: data.secondaryContact,
        description: data.description,
        statusId: data.statusId,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        franchiseId: data.franchiseId,
        customerCode: data.customerCode,
        emailPrefix: data.emailPrefix,
        testCampus: data.testCampus,
        feeCategoryId: event.target.value,
      };
      setSelectedRow(updatedData);
    }

    console.log(event.target.name);

    // if (event.target.name === 'stateIds') {
    //   console.log(event.target);
    //   const updatedData = {
    //     ...selectedRow,
    //     cityId: data?.cityId,
    //     fullName: data?.fullName.trim() || '',
    //     code: data?.code.trim() || '',
    //     stateIds: event.target.value,
    //     statusId: data?.statusId || 0,
    //   };

    //   setSelectedRow(updatedData);
    //   // setDummyDefaultValue(event.target.value);
    //   setMultiSelectValues(event.target.value, dummyMultiselectObj, setDummyDefaultValue);
    // }
  };

  // const setMultiSelectValues = (value, ArrayObj, setter) => {
  //   if (value.includes(',')) {
  //     const selectedArray = value.split(',');
  //     const newOptn = ArrayObj.filter((item) => selectedArray.includes(item.key)).map((e) => ({
  //       key: e.key,
  //       value: e.value.trim(),
  //     }));
  //     setter(newOptn);
  //   } else {
  //     const newOptn = ArrayObj.filter((item) => value === item.key).map((e) => ({
  //       key: e.key,
  //       value: e.value.trim(),
  //     }));
  //     setter(newOptn);
  //   }
  // };

  const handleAddClick = async () => {
    setTitle('Add City');
    setErrors('');
    setSelectedRow(null);
    setIsAddMode(true);
    // setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Update City');
    console.log('row is ', row);
    setSelectedRow(row);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    // setMultiSelectValues(row.stateIds, dummyMultiselectObj, setDummyDefaultValue);
    quickEdit.onTrue();
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

  const hiddenFields = ['id', 'action'];

  const getTogglableColumns = () =>
    TABLE_HEAD.filter((TABLE_HEAD) => !hiddenFields.includes(TABLE_HEAD.field)).map(
      (TABLE_HEAD) => TABLE_HEAD.field
    );

  useEffect(() => {
    if (HrmsPaymentList.length > 0) {
      // Get current date for comparison
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12 format
      const currentYear = currentDate.getFullYear();

      const newGrid = HrmsPaymentList.map((data, index) => ({
        bonusAmount: data.bonusAmount || 0,
        attendanceDeduction: data.attendanceDeduction || 0,
        employeeNetSalary: data.employeeNetSalary || 'N/A',
        totalSalary: data.totalSalary || 0,
        paymentStatus: data.paymentStatus,
        previousMonthAbsent: data.previousMonthAbsent || 'N/A',
        hrmsFee: data.hrmsFee,
        companyName: data.companyName,
        employeeName: data.employeeName,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        employeeCode: data.employeeCode,
      })).filter((data) => {
        // First check if selected month/year is current or future
        if (yearCount > currentYear || (yearCount === currentYear && monthView >= currentMonth)) {
          return false; // Don't show any records for current/future months
        }

        // Check if selected month is immediately previous month
        const isPreviousMonth =
          (monthView === 12 && currentMonth === 1 && yearCount === currentYear - 1) ||
          (monthView === currentMonth - 1 && yearCount === currentYear);

        if (isPreviousMonth) {
          // For immediately previous month:
          // Show records with no payment date OR records with payment in current month
          if (!data.paymentDate) {
            return true;
          }
          const paymentMonth = data.paymentDate.getMonth() + 1;
          const paymentYear = data.paymentDate.getFullYear();
          return paymentMonth === currentMonth && paymentYear === currentYear;
        } else {
          // For all other past months:
          // Only show records with payment dates matching that month
          if (!data.paymentDate) return false;

          const paymentMonth = data.paymentDate.getMonth() + 1;
          const paymentYear = data.paymentDate.getFullYear();
          return paymentMonth === monthView && paymentYear === yearCount;
        }
      });

      setTableData(
        newGrid.map((e, index) => ({
          ...e,
          id: index + 1,
        }))
      );
    }
  }, [HrmsPaymentList, monthView, yearCount]);

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const previousMonthName = previousMonth.toLocaleString('default', { month: 'long' });

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
    <div className={`main-container ${loadingSpinner ? 'blur' : ''}`}>
      {loadingSpinner && <Spinner />}
      <Helmet>Addcity</Helmet>
      <CustomBreadcrumbs
        heading="HRMS Employee Payment Information"
        links={[
          { name: 'Dashboard' },
          { name: 'HRMS Employee Payment Information' },
          { name: 'List' },
        ]}
        action={
          <Box>
            <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
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
            <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
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
        }
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

      <Card style={{ width: '100%' }}>
        <Typography sx={{ padding: 2, textAlign: 'right', mr: 5 }}>
          Current Billing Month: {previousMonthName}
        </Typography>
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={tableData}
            disableRowSelectionOnClick
            onRowClick={(params, event) => event.stopPropagation()}
            columns={[...TABLE_HEAD]}
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
        </div>
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
    </div>
  );
}
