import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetAllPerformanceTeam } from 'src/api/performanceTeam';
import { useGetAllinterview, useAddOne, useUpdateOne } from 'src/api/interviewPanel';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetAllCompanyEmployee } from 'src/api/companyEmployee';
import Add from './add';
import Spinner from '../../../components/loading-screen/spinner';
import { UseGetAllUserProfileNames } from 'src/api/userprofile';
const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'Full Name', width: 210, flex: 1 },

  { field: 'email', headerName: 'Email', width: 210, flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 210, flex: 1 },
  {
    field: 'statusId',
    headerName: 'Status',
    width: 100,
    flex: 0.5,
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
          color={params.row.statusId === 1 ? 'success' : 'error'}
          badgeContent={params.row.statusId === 1 ? 'Active' : 'Inactive'}
        >
          {/* {params.row.statusId === 1 ? 'Active' : 'Inactive'} */}
        </Badge>
      </div>
    ),
  },
];

export default function interviewPanelView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const { performanceTeamList } = useGetAllPerformanceTeam();
  const { companyEmployeeList } = useGetAllCompanyEmployee();
  const { getAllUsernames } = UseGetAllUserProfileNames();
  const { interviewList, refetchData } = useGetAllinterview();
  const { submitFormAdd } = useAddOne();
  const { submitFormUpdate } = useUpdateOne();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [disableUsername, setDisableUsername] = useState(false);
  const [edit, setEdit] = useState(false);
  const [filterEmployee, setfilterEmployee] = useState([]);

  const fields = [
    {
      name: 'employeeId',
      label: 'Interview Name',
      mandatory: true,
      type: 'dropdown',
      options: filterEmployee,
    },

    { name: 'statusId', label: 'Status', mandatory: false, type: 'switch' },
  ];
  const handleDropdownChange = (event, data) => {
    if (event.target.name === 'businessUnitId') {
      const updatedData = {
        interviewPanelId: data?.interviewPanelId,
        fullName: data?.fullName.trim(),
        interviewerId: data?.interviewerId,
        phoneNo: data?.phoneNo,
        statusId: data?.statusId || 0,
        username: sessionStorage.getItem('username'), // add email to updatedData
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'franchiseId') {
      const updatedData = {
        interviewPanelId: data?.interviewPanelId,
        fullName: data?.fullName.trim(),
        employeeId: data?.employeeId,
        phoneNo: data?.phoneNo,
        password: data?.password,
        username: data?.username,
        statusId: data?.statusId || 0,
        companyUsername: sessionStorage.getItem('username'), // add email to updatedData
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'feeCategoryIdId') {
      const updatedData = {
        interviewPanelId: data?.interviewPanelId,
        fullName: data?.fullName.trim(),
        employeeId: data?.employeeId,
        phoneNo: data?.phoneNo,
        password: data?.password,
        username: data?.username,
        statusId: data?.statusId || 0,
        companyUsername: sessionStorage.getItem('username'), // add email to updatedData
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'employeeId') {
      const updatedData = {
        interviewPanelId: data?.interviewPanelId,
        employeeId: event.target.value,
        statusId: data?.statusId || 0,
        companyId: data?.companyId,
      };
      setSelectedRow(updatedData);

      // let hasUsername = false;

      // const isOutsourced = companyEmployeeList.some(
      //   (e) => e.employeeId == event.target.value && e.employeeType == 'Outsourced'
      // );
      // if (!edit) {
      //   hasUsername = performanceTeamList.some(
      //     (e) => e.teamLeadId == event.target.value && e.username !== 'null' && e.statusId != 0
      //   );
      // }
      // setDisableUsername(isOutsourced || hasUsername);
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
  useEffect(() => {
    if (interviewList.length) {
      setTableData(interviewList);
    }
  }, [interviewList, tableData]);

  const handleAddClick = async () => {
    setTitle('Add Interview');
    setEdit(false);
    setErrors('');
    setDisableUsername(false);
    setSelectedRow(null);

    setfilterEmployee(
      companyEmployeeList
        .filter(
          (emp) => !interviewList.some((interview) => interview.employeeId === emp.employeeId)
        )
        .map((emp) => ({ key: emp.employeeId, value: emp.fullName }))
    );
    setIsAddMode(true);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Update Interview');
    setEdit(true);
    setSelectedRow(row);
    setfilterEmployee(
      companyEmployeeList
        .filter(
          (emp) =>
            !interviewList.some((interview) => interview.employeeId === emp.employeeId) ||
            row.employeeId == emp.employeeId
        )
        .map((emp) => ({ key: emp.employeeId, value: emp.fullName }))
    );

    // if (
    //   companyEmployeeList.find((e) => e.employeeId == row.employeeId).employeeType == 'Outsourced'
    // ) {
    //   setDisableUsername(true);
    // } else {
    //   setDisableUsername(false);
    // }
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    const updatedData = {
      interviewPanelId: data?.interviewPanelId,
      employeeId: data?.employeeId,
      statusId: data?.statusId || 0,
      companyId: data?.companyId,
      companyUsername: sessionStorage.getItem('username'), // add email to updatedData
    };

    let newErrorDetails = '';
    // const AllUsernames = await getAllUsernames();

    // if (AllUsernames.includes(data.username.toLowerCase().trim())) {
    //   // Check if the record is being edited
    //   const isEditing = interviewList.some(
    //     (item) => item.interviewPanelId === data.interviewPanelId
    //   );

    //   if (isEditing) {
    //     const isSameUsername = interviewList.some(
    //       (item) =>
    //         item.username.toLowerCase().trim() === data.username.toLowerCase().trim() &&
    //         item.interviewPanelId === data.interviewPanelId
    //     );

    //     if (isSameUsername) {
    //       // No error if it's the same record being edited with the same username
    //       setSelectedRow(updatedData);
    //       newErrorDetails = '';
    //     } else {
    //       // Error if another record already has this username
    //       newErrorDetails = 'Username Already Exists';
    //     }
    //   } else {
    //     // If adding a new record, error if username exists
    //     newErrorDetails = 'Username Already Exists';
    //   }
    // } else {
    //   // If the username is not in AllUsernames, proceed without errors
    //   setSelectedRow(updatedData);
    //   newErrorDetails = '';
    // }

    // if (!disableUsername && AllUsernames.includes(data.username.toLowerCase().trim())) {
    //   const isCompanyUpdating = interviewList.some(
    //     (item) => item.interviewPanelId === data.interviewPanelId
    //   );

    //   if (isCompanyUpdating) {
    //     // If updating an existing company, don't set the error for the username
    //     setSelectedRow(updatedData);
    //     newErrorDetails = '';
    //   } else {
    //     // If adding a new company, check if the username is already assigned to another company
    //     if (interviewList.some((item) => item.interviewPanelId !== data.interviewPanelId)) {
    //       setSelectedRow(updatedData);
    //       newErrorDetails = 'Username Already Exists';
    //     } else {
    //       newErrorDetails = '';
    //     }
    //   }
    // }

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

  const gridData = interviewList.map((interview, index) => ({
    id: index + 1,
    interviewPanelId: interview?.interviewPanelId,
    fullName: interview?.fullName,
    employeeId: interview?.employeeId,
    employeeCode: interview?.employeeCode,
    email: interview?.email,
    statusId: interview?.statusId || 0,
    companyId: interview?.companyId,
    companyUsername: sessionStorage.getItem('username'),
  }));

  return (
    <Box
      sx={{ padding: 2, height: '100%' }}
      className={`main-container ${loadingSpinner ? 'blur' : ''}`}
    >
      {loadingSpinner && <Spinner />}
      <Helmet>AddInterview</Helmet>
      <CustomBreadcrumbs
        heading="Interview Panel"
        links={[{ name: 'Dashboard' }, { name: 'Interview Panel' }, { name: 'List' }]}
        action={
          <Button
            component={RouterLink}
            onClick={() => {
              handleAddClick();
            }}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add
          </Button>
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
            fields={
              disableUsername
                ? fields.filter((field) => field.name !== 'username' && field.name !== 'password')
                : fields
            }
            onFieldChange={handleDropdownChange}
            selectedObj={selectedRow}
            errorMessage={errorDetails}
          />
        )}
      </Card>

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
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
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
