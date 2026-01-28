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
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  useGetAllInternalCompanyEmployee,
  useEmployeeUpdateOne,
  useUploadExcelOne,
  useGetOnBoardingEmployee,
  useConfirmEmployeeJoined,
  useAddOne,
} from 'src/api/companyEmployee';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

import { useDownloadExcelSample } from 'src/api/companyEmployee';

import Iconify from 'src/components/iconify';
import FileManagerNewFolderDialog from 'src/sections/file-manager/file-manager-new-folder-dialog';
import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery, useTheme } from '@mui/material';
import Add from './add';
import Spinner from '../../../components/loading-screen/spinner';
import {
  getCompanyOutsourcedEmployeeView,
  useUpdateOutsourcedEmployee,
} from 'src/api/companyOutSourcedEmployee';
import { parse, format } from 'date-fns';

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
  { field: 'fullName', headerName: 'Employee Name', width: 210, flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 200, flex: 1 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150, flex: 1 },
  { field: 'cnic', headerName: 'CNIC', width: 150, flex: 1 },
  { field: 'employeeType', headerName: 'Employee Type', width: 150, flex: 1 },

  {
    field: 'employeeStatus',
    headerName: 'Employee Status',
    width: 100,
    flex: 1,
    renderCell: (params) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: '50px',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Badge
          color={
            params.row.employeeStatus == 1 ||
            params.row.employeeStatus === 'hired' ||
            params.row.employeeStatus === 'joined'
              ? 'success'
              : params.row.employeeStatus === 'InNoticePeriod'
              ? 'warning'
              : 'error'
          }
          badgeContent={
            params.row.employeeStatus == 1
              ? 'Active'
              : params.row.employeeStatus == 0
              ? 'InActive'
              : params.row.employeeStatus === 'hired'
              ? 'Hired'
              : params.row.employeeStatus === 'InNoticePeriod'
              ? 'In Notice Period'
              : params.row.employeeStatus === 'DelayedOnboarding'
              ? 'Delayed Onboarding'
              : params.row.employeeStatus === 'joined'
              ? 'Joined'
              : ''
          }
        />
      </div>
    ),
  },
];

const TABLE_HEAD_OnBorading = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'Full Name', width: 210, flex: 1 },
  { field: 'jobTitle', headerName: 'Job Title', width: 150, flex: 1 },
  { field: 'designationName', headerName: 'Employee Designation', width: 200, flex: 1 },
  { field: 'email', headerName: 'Email', width: 200, flex: 1 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150, flex: 1 },
  {
    field: 'approvalStatus',
    headerName: 'Approval Status',
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: '50px',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Badge
          color={
            params.row.approvalStatus === 'InNoticePeriod'
              ? 'warning'
              : params.row.approvalStatus === 'Approved'
              ? 'success'
              : 'error'
          }
          badgeContent={
            params.row.approvalStatus === 'InNoticePeriod'
              ? 'In Notice Period'
              : params.row.approvalStatus === 'Approved'
              ? 'Approved'
              : params.row.approvalStatus === 'DelayedOnboarding'
              ? 'Delayed Onboarding'
              : params.row.approvalStatus === 'Resign'
              ? 'Delayed Onboarding'
              : params.row.approvalStatus === 'Rejected'
              ? 'Rejected'
              : ''
          }
        />
      </div>
    ),
  },
];

const TABLE_HEAD_outsourced = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },

  { field: 'fullName', headerName: 'Full Name', width: 210, flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 150, flex: 1 },
  {
    field: 'averagePerformanceScore',
    headerName: 'Avg. Performance Score',
    width: 150,
    flex: 1,
  },
  {
    field: 'baseSalary',
    headerName: 'Base Salary',
    width: 150,
    flex: 1,
  },
  { field: 'clockInTime', headerName: 'Clock In Time', width: 150, flex: 1 },
  { field: 'clockOutTime', headerName: 'Clock Out Time', width: 150, flex: 1 },

  {
    field: 'contract',
    headerName: 'contract',
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
        }}
      >
        <Badge
          color={params.row.contract === 1 ? 'success' : 'error'}
          badgeContent={params.row.contract === 1 ? 'Yes' : 'No'}
        >
          {/* {params.row.statusId === 1 ? 'Active' : 'Inactive'} */}
        </Badge>
      </div>
    ),
  },
  {
    field: 'contractDuration',
    headerName: 'Contract Duration',
    width: 150,
    flex: 1,
    renderCell: (params) => <span>{`${params.row.contractDuration} months`}</span>,
  },
];

export default function CompanyEmployeeView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [outsourcedEdit, setOutsourcedEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const upload = useBoolean();
  const { CompanyOutsourcedEmployeeView } = getCompanyOutsourcedEmployeeView();
  const { companyInternalEmployeeList, refetchData } = useGetAllInternalCompanyEmployee();
  const { submitExcel } = useUploadExcelOne();
  const { ConfirmEmployeeJoined } = useConfirmEmployeeJoined();
  const { submitFormEmployeeUpdate } = useEmployeeUpdateOne();
  const { submitFormAdd } = useAddOne();
  const { UpdateOutsourcedEmployee } = useUpdateOutsourcedEmployee();
  const { GetOnBoardingEmployee } = useGetOnBoardingEmployee();
  const { downloadExcelSample } = useDownloadExcelSample();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [onboardingDataGrid, setOnboardingDataGrid] = useState([]);
  const [companyOutSourcedEmployee, setCompanyOutSourcedEmployee] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const FetchOnbording = async () => {
    const response = await GetOnBoardingEmployee();

    const gridData = response.data.map((data, index) => ({
      id: index + 1,
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email.trim(),
      jobTitle: data.jobTitle.trim(),
      designationName: data.designationName.trim(),
      companyId: data.companyId,
      scheduleInterviewId: data.scheduleInterviewId,
      approvalStatus: data.approvalStatus.trim(),
    }));

    setOnboardingDataGrid(gridData);
  };

  const FetchOutsourcedEmployee = async () => {
    const response = await CompanyOutsourcedEmployeeView();

    const gridData = response.data.map((data, index) => ({
      id: index + 1,
      candidateId: data.candidateId,
      companyId: data.companyId,
      fullName: data.fullName.trim(),
      averagePerformanceScore: data.averagePerformanceScore,
      employeeCode: data.employeeCode.trim(),
      employeeNetSalary: data.baseSalary * (1 - data.hrmsPercentage / 100),
      baseSalary: data.baseSalary,
      clockInTime: data.clockInTime,
      clockOutTime: data.clockOutTime,
      contract: data.contract,
      contractDuration: data.contractDuration,
      hrmsPercentage: data.hrmsPercentage,
    }));

    setCompanyOutSourcedEmployee(gridData);
  };

  useEffect(() => {
    if (value == 2) {
      FetchOnbording();
    } else if (value == 1) {
      setOutsourcedEdit(true);
      FetchOutsourcedEmployee();
    } else if (value == 0) {
      setOutsourcedEdit(false);
    }
  }, [value]);

  const fieldsOutSourced = [
    {
      name: 'baseSalary',
      label: 'Base Salary',
      mandatory: false,
      type: 'number',
    },
    {
      name: 'employeeNetSalary',
      label: `Employee Net Salary (Deducting ${
        companyOutSourcedEmployee.length > 0 && companyOutSourcedEmployee[0].hrmsPercentage
      }% HRMS Fee ) `,
      mandatory: false,
      disabled: true,
      type: 'number',
    },
    {
      name: 'clockInTime',
      label: 'Clock In Time',
      mandatory: false,
      type: 'time',
    },
    {
      name: 'clockOutTime',
      label: 'Clock Out Time',
      mandatory: false,
      type: 'time',
    },
    {
      name: 'contract',
      label: 'Contract base',
      mandatory: false,
      type: 'switch',
    },
    {
      name: 'contractDuration',
      label: 'Contract Duration',
      mandatory: false,
      type: 'number',
    },
  ];

  const fields = [
    {
      name: 'fullName',
      label: 'Employee Name',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },
    {
      name: 'employeeCode',
      label: 'Employee Code',
      mandatory: true,
      type: 'text',
      maxLength: 6,
    },

    {
      name: 'email',
      label: 'Employee Email',
      mandatory: true,
      type: 'email',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      mandatory: true,
      type: 'contactNumberField',
    },

    {
      name: 'cnic',
      label: 'CNIC',
      mandatory: true,
      type: 'text',
    },
    {
      name: 'username',
      label: 'User name',
      mandatory: true,
      type: 'text',
    },

    {
      name: 'password',
      label: 'Encrypted',
      mandatory: isAddMode ? true : false,
      type: 'password',
      minLength: 6,
    },

    { name: 'employeeStatus', label: 'Emoloyee Status', mandatory: false, type: 'switch' },
  ];

  const handleDropdownChange = (event, data) => {
    if (event.target.name === 'businessUnitId') {
      const updatedData = {
        employeeId: data?.employeeId,
        fullName: data?.fullName.trim(),
        companyId: data?.companyId,
        employeeCode: data?.employeeCode?.trim(),
        email: data?.email.trim(),
        phoneNumber: data?.phoneNumber.trim(),
        cnic: data?.cnic.trim(),
        employeeStatus: data?.employeeStatus.trim() || 0,
        employeeType: data?.employeeType.trim(),
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'baseSalary') {
      const updatedData = {
        ...selectedRow,
        baseSalary: event.target.value,
        employeeNetSalary: parseInt(event.target.value * (1 - data.hrmsPercentage / 100)),
      };

      setSelectedRow(updatedData);
    }

    console.log(event.target.name);
  };

  useEffect(() => {
    if (companyInternalEmployeeList.length) {
      setTableData(companyInternalEmployeeList);
    }
  }, [companyInternalEmployeeList, tableData]);

  const handleAddClick = async () => {
    setTitle('Add Internal Employee');
    setErrors('');
    setOutsourcedEdit(false);
    setSelectedRow(null);
    setIsAddMode(true);
    // setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Edit Internal Employee');
    console.log('row is ', row);
    setSelectedRow(row);
    setOutsourcedEdit(false);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    // setMultiSelectValues(row.stateIds, dummyMultiselectObj, setDummyDefaultValue);
    quickEdit.onTrue();
  };

  const handleEditOutsourced = async (row) => {
    setErrors('');
    setTitle('Edit Outsourced Employee');
    console.log('row is ', row);

    (row.clockInTime = parse(row.clockInTime, 'HH:mm:ss', new Date())),
      (row.clockOutTime = parse(row.clockOutTime, 'HH:mm:ss', new Date())),
      setSelectedRow(row);
    setOutsourcedEdit(true);
    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    if (outsourcedEdit) {
      const updatedData = {
        candidateId: data.candidateId,
        netSalary: data.baseSalary * (1 - data.hrmsPercentage / 100),
        hrmsFee: data.baseSalary * (data.hrmsPercentage / 100),
        baseSalary: data.baseSalary,
        clockInTime: format(new Date(data.clockInTime), 'HH:mm:ss'),
        clockOutTime: format(new Date(data.clockOutTime), 'HH:mm:ss'),
        contract: data.contract,
        contractDuration: data.contractDuration,
      };

      let newErrorDetails = '';

      setErrors(newErrorDetails);

      try {
        const response = await UpdateOutsourcedEmployee(updatedData);
        if (response && response.code === '201' && response.message) {
          enqueueSnackbar(response.message, {
            variant: 'border',
            style: { backgroundColor: '#FF5630', color: '#fff' },
          });
          await FetchOutsourcedEmployee();
        } else {
          quickEdit.onFalse();
          enqueueSnackbar('Record has been updated successfully');
          setSelectedRow(null);
          await FetchOutsourcedEmployee();
        }
      } catch (error) {
        console.error('Error Updating record:', error);
      }
    } else {
      const bcryptHashRegex = /^\$2[aby]?\$\d{2}\$.{53}$/;

      const employeeExist = companyInternalEmployeeList.find(
        (comp) => data.employeeId == comp.employeeId
      );

      if (employeeExist && bcryptHashRegex.test(employeeExist.password)) {
        data.password = employeeExist.password;
      }

      const updatedData = {
        companyEmployeeId: data?.employeeId,
        fullName: data?.fullName.trim(),
        companyId: data?.companyId,
        username: data?.username,
        password: data?.password,
        employeeCode: data?.employeeCode?.trim(),
        email: data?.email.trim(),
        phoneNumber: data?.phoneNumber.trim(),
        cnic: data?.cnic.trim(),
        status: data?.employeeStatus || 0,
      };

      let newErrorDetails = '';

      if (
        companyInternalEmployeeList.some(
          (item) =>
            item.fullName.toLowerCase().trim() === data.fullName.toLowerCase().trim() &&
            item.employeeId !== data.employeeId
        )
      ) {
        newErrorDetails = 'Employee Already Exists';
      } else if (
        companyInternalEmployeeList.some(
          (item) =>
            item.employeeCode?.toLowerCase().trim() === data.employeeCode?.toLowerCase().trim() &&
            item.employeeId !== data.employeeId
        )
      ) {
        newErrorDetails = 'Employee Code Already Exists';
      } else if (
        companyInternalEmployeeList.some(
          (item) =>
            item.cnic?.toLowerCase().trim() === data.cnic?.toLowerCase().trim() &&
            item.employeeId !== data.employeeId
        )
      ) {
        newErrorDetails = 'Cnic Already Exists';
      } else if (
        companyInternalEmployeeList.some(
          (item) =>
            item.email?.toLowerCase().trim() === data.email?.toLowerCase().trim() &&
            item.employeeId !== data.employeeId
        )
      ) {
        newErrorDetails = 'Email Already Exists';
      } else if (
        companyInternalEmployeeList.some(
          (item) =>
            item.phoneNumber?.toLowerCase().trim() === data.phoneNumber?.toLowerCase().trim() &&
            item.employeeId !== data.employeeId
        )
      ) {
        newErrorDetails = 'phoneNumber Already Exists';
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
            const response = await submitFormEmployeeUpdate(updatedData);
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
    }
  };

  const deleteItem = async (e) => {
    (e.companyEmployeeId = e.employeeId), (e.status = 2);

    const data = e;

    try {
      const response = await submitFormEmployeeUpdate(data);

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

  const handleUploads = async (files) => {
    const formDataObject = new FormData();

    formDataObject.append('username', sessionStorage.getItem('username'));
    formDataObject.append('excel', files[0]);

    // Extract the file extension
    const validExtensions = ['xlsx'];
    const file = files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      enqueueSnackbar('Unsupported File Type. Please upload a Excel file.', {
        variant: 'error',
        style: { backgroundColor: 'white', color: 'red' },
      });
      return;
    }

    const response = await submitExcel(formDataObject);

    if (response.code == 200) {
      if (response.data.length <= 0) {
        enqueueSnackbar('please Fill the Fields in Excel Sheet', {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      } else {
        enqueueSnackbar('Records Has Been Added');
        refetchData();
      }
    } else if (response.code == 400) {
      enqueueSnackbar(response.message, {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    }
  };

  const ConfirmEmployeeJoin = async ({ companyId, scheduleInterviewId }) => {
    const data = {
      scheduleInterviewId,
      companyId,
    };

    const response = await ConfirmEmployeeJoined(data);

    if (response.code == 200) {
      FetchOnbording();
    }
  };

  const gridData = companyInternalEmployeeList.map((data, index) => ({
    id: index + 1,
    employeeId: data.employeeId,
    fullName: data.fullName.trim(),
    companyId: data.companyId,
    employeeCode: data.employeeCode?.trim(),
    email: data.email.trim(),
    phoneNumber: data.phoneNumber.trim(),
    cnic: data.cnic.trim(),
    password: '',
    username: data.username,
    employeeStatus: isNaN(data.employeeStatus)
      ? data.employeeStatus.trim()
      : Number(data.employeeStatus),
    employeeType: data.employeeType.trim(),
  }));

  const closebox = () => {
    upload.onFalse;
    setSpinner(false);
  };

  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      {loadingSpinner && <Spinner />}
      <Helmet>CompanyEmployee</Helmet>
      <CustomBreadcrumbs
        heading="Company Employee"
        links={[{ name: 'Dashboard' }, { name: 'CompanyEmployee' }, { name: 'List' }]}
        action={
          <>
            {!outsourcedEdit && !isSmallScreen && (
              <>
                <Button
                  component={RouterLink}
                  onClick={handleAddClick}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add One
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  component={RouterLink}
                  onClick={() => {
                    upload.onTrue();
                  }}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add Excel Sheet
                </Button>

                <Button
                  sx={{ ml: 2 }}
                  component={RouterLink}
                  onClick={async () => {
                    setSpinner(true);
                    await downloadExcelSample();
                    setSpinner(false);
                  }}
                  variant="contained"
                  startIcon={
                    loadingSpinner ? '' : <Iconify icon="material-symbols:download-sharp" />
                  }
                >
                  {loadingSpinner ? (
                    <CircularProgress sx={{ height: 20 }} />
                  ) : (
                    <>Download Sample Template of Excel</>
                  )}
                </Button>
              </>
            )}
          </>
        }
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />

      {isSmallScreen && (
        <>
          {' '}
          <Button
            sx={{ width: '100%', mt: 2 }}
            component={RouterLink}
            onClick={handleAddClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add One
          </Button>
          <Button
            sx={{ width: '100%', mt: 2 }}
            component={RouterLink}
            onClick={() => {
              upload.onTrue();
            }}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Excel Sheet
          </Button>
          <Button
            sx={{ width: '100%', mt: 2, mb: 5 }}
            component={RouterLink}
            onClick={async () => {
              setSpinner(true);
              await downloadExcelSample();
              setSpinner(false);
            }}
            variant="contained"
            startIcon={loadingSpinner ? '' : <Iconify icon="material-symbols:download-sharp" />}
          >
            {loadingSpinner ? (
              <CircularProgress sx={{ height: 20 }} />
            ) : (
              <>Download Sample Template of Excel</>
            )}
          </Button>
        </>
      )}
      <FileManagerNewFolderDialog
        open={upload.value}
        onClose={upload.onFalse}
        onUpload={handleUploads}
        title="Upload Excel Sheet"
        UploadButtonName="Upload Excel File"
        multiple={false}
        heading="Drop or Select your Excel Sheet to add Employees"
      />

      <Card>
        {quickEdit.value && (
          <Add
            currentUser={isAddMode ? null : selectedRow}
            onClose={quickEdit.onFalse}
            open={quickEdit.value}
            onSubmitInsert={handleFormSubmit}
            title={addTitle}
            fields={outsourcedEdit ? fieldsOutSourced : fields}
            selectedObj={selectedRow}
            onFieldChange={handleDropdownChange}
            errorMessage={errorDetails}
          />
        )}
      </Card>

      <Box sx={{ width: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Company Employee" {...a11yProps(0)} />
            <Tab label="Company Outsourced Employee" {...a11yProps(1)} />
            <Tab label="OnBoarding Employees" {...a11yProps(2)} />
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
                    xs: '320%',
                    sm: '100%',
                  },
                },
              }}
            >
              <DataGrid
                rows={gridData}
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
                        {params.row.employeeStatus == 1 || params.row.employeeStatus == 0 ? (
                          <>
                            <Tooltip title="Edit" placement="top" arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handleEditClick(params.row)}
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
                            <Tooltip title="Delete" placement="top" arrow>
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  setConfirmDialogOpen(true);
                                  setSelectedRow(params.row);
                                }}
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
                          </>
                        ) : null}
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
                    xs: '300%',
                    sm: '100%',
                  },
                },
              }}
            >
              <DataGrid
                rows={companyOutSourcedEmployee}
                disableRowSelectionOnClick
                onRowClick={(params, event) => event.stopPropagation()}
                columns={[
                  ...TABLE_HEAD_outsourced,
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    sortable: false,
                    orderable: false,

                    renderCell: (params) => (
                      <div>
                        <>
                          <Tooltip title="Edit" placement="top" arrow>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditOutsourced(params.row)}
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
                          <Tooltip title="Delete" placement="top" arrow>
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                setConfirmDialogOpen(true);
                                setSelectedRow(params.row);
                              }}
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
                        </>
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
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
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
                    xs: '260%',
                    sm: '100%',
                  },
                },
              }}
            >
              <DataGrid
                rows={onboardingDataGrid}
                disableRowSelectionOnClick
                onRowClick={(params, event) => event.stopPropagation()}
                columns={[
                  ...TABLE_HEAD_OnBorading,
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    sortable: false,
                    flex: 1,
                    orderable: false,

                    renderCell: (params) => (
                      <Tooltip title="Confirm Employee Join">
                        <IconButton onClick={() => ConfirmEmployeeJoin(params.row)}>
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
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
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
      </Box>

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
