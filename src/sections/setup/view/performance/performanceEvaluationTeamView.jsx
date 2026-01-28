import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Dialog,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import { useAddTeamLeadCredential } from 'src/api/performanceTeam';
import {
  useGetAllPerformanceTeam,
  GetOneTeamLeadCredential,
  UpdateOneTeamLeadCredential,
} from 'src/api/performanceTeam';
import { useAddTeamOne, useUpdateTeamOne } from 'src/api/performanceTeam';
import Iconify from 'src/components/iconify';
import { useGetAllCompanyEmployee } from 'src/api/companyEmployee';
import { UseGetAllUserProfileNames } from 'src/api/userprofile';

import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from '../add';
import Spinner from '../../../../components/loading-screen/spinner';
import { includes } from 'lodash';
const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'teamName', headerName: 'Team Name', width: 210, flex: 1 },
  { field: 'teamCode', headerName: 'Team Code', width: 150, flex: 1 },
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

export default function PerformanceEvaluationTeamView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const { performanceTeamList, refetchData } = useGetAllPerformanceTeam();
  const { companyEmployeeList } = useGetAllCompanyEmployee();
  const { submitTeamLeadCredential } = useAddTeamLeadCredential();
  const { submitFormAddTeam } = useAddTeamOne();
  const { GetTeamLeadCredential } = GetOneTeamLeadCredential();

  const { submitFormUpdateTeam } = useUpdateTeamOne();
  const [disableMulti, setDisableMulti] = useState(true);
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { UpdateTeamLeadCredential } = UpdateOneTeamLeadCredential();
  const [loadingSpinner, setSpinner] = useState(false);

  const { getAllUsernames } = UseGetAllUserProfileNames();
  const [teamLeadId, setTeamLeadId] = useState(null);

  const [dummyDefaultValue, setDummyDefaultValue] = useState([]);

  const [companyEmployeeUpdated, setCompanyEmployeeUpdated] = useState([]);

  const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);

  const fields = [
    {
      name: 'teamName',
      label: 'Team Name',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },
    {
      name: 'teamCode',
      label: 'Team Code',
      mandatory: true,
      type: 'text',
      maxLength: 6,
    },
    {
      name: 'teamLeadId',
      label: 'Team Lead',
      mandatory: true,
      type: 'dropdown',
      options: companyEmployeeUpdated.map((emp) => ({
        key: emp.employeeId,
        value: emp.fullName,
      })),
    },
    {
      name: 'members',
      label: 'Members',
      mandatory: false,
      type: 'multiselect',
      options: dummyMultiselectObj,
      defaultValue: dummyDefaultValue,
      disabled: disableMulti,
    },
    { name: 'statusId', label: 'Status', mandatory: false, type: 'switch' },
  ];

  const handleDropdownChange = (event, data) => {
    console.log(event.target.name);

    if (event.target.name === 'members') {
      console.log(event.target);
      const updatedData = {
        ...selectedRow,

        evaluationTeamId: data.evaluationTeamId,
        teamName: data.teamName,
        teamCode: data.teamCode,
        teamLeadId: data.teamLeadId,
        companyId: data.companyId,
        members: event.target.value,
        statusId: data.statusId,
      };

      const members = updatedData.members.split(',').map((id) => id.trim());

      // const filteredEmp = companyEmployeeList.filter((emp) => {
      //   return !members.includes(emp.employeeId.toString());
      // });
      const removedMembers = data.members
        .split(',')
        .filter((id) => !updatedData.members.includes(id.trim()));

      if (removedMembers.length > 0) {
        const filteredEmps = companyEmployeeList.filter((emp) =>
          removedMembers.includes(emp.employeeId.toString())
        );

        const Emp = filteredEmps.concat(companyEmployeeUpdated);

        setCompanyEmployeeUpdated(Emp);
      } else {
        const filteredEmps = companyEmployeeList.filter(
          (emp) => !members.includes(emp.employeeId.toString())
        );

        const furthermap = filteredEmps.filter(
          (emp) => companyEmployeeUpdated.includes(emp) || updatedData.teamLeadId == emp.employeeId
        );
        setCompanyEmployeeUpdated(furthermap);
      }
      //  const Emp = filteredEmps.concat(companyEmployeeUpdated);

      setSelectedRow(updatedData);
      // setDummyDefaultValue(event.target.value);
      setMultiSelectValues(event.target.value, dummyMultiselectObj, setDummyDefaultValue);
    } else if (event.target.name === 'teamLeadId') {
      console.log(event.target);
      const updatedData = {
        ...selectedRow,

        evaluationTeamId: data.evaluationTeamId,
        teamName: data.teamName,
        teamCode: data.teamCode,
        teamLeadId: event.target.value,
        members: data.members,
        companyId: data.companyId,
        statusId: data.statusId,
      };
      if (isAddMode) {
        const members = updatedData.members.split(',').map((id) => id.trim());

        const PerformanceMembers = performanceTeamList.flatMap((team) =>
          team.members.split(',').map((id) => id.trim())
        );

        const mappedEmps = companyEmployeeList
          .filter(
            (emp) =>
              emp.employeeId !== event.target.value &&
              emp.employeeType == 'Outsourced' &&
              !PerformanceMembers.includes(emp.employeeId)
          )
          .map((emp) => ({
            key: emp.employeeId,
            value: emp.fullName.trim(),
          }));

        setDummyMultiselectObj(mappedEmps);
      } else {
        const members = updatedData.members.split(',').map((id) => id.trim());

        const PerformanceMembers = performanceTeamList.flatMap((team) =>
          team.members.split(',').map((id) => id.trim())
        );

        const mappedEmps = companyEmployeeList
          .filter(
            (emp) =>
              (emp.employeeId !== event.target.value &&
                emp.employeeType == 'Outsourced' &&
                !PerformanceMembers.includes(emp.employeeId)) ||
              members.includes(emp.employeeId)
          )

          .map((emp) => ({
            key: emp.employeeId,
            value: emp.fullName.trim(),
          }));

        setDummyMultiselectObj(mappedEmps);
      }

      setDisableMulti(false);

      // if (dummyDefaultValue.some((emp) => emp.key == event.target.value)) {
      //   const updatedDefaultValue = dummyDefaultValue.filter(
      //     (emp) => emp.key != event.target.value
      //   );
      //   setDummyDefaultValue(updatedDefaultValue);
      // }

      setSelectedRow(updatedData);
    }
  };

  const setMultiSelectValues = (value, ArrayObj, setter) => {
    if (value.includes(',')) {
      const selectedArray = value.split(',');
      const newOptn = ArrayObj.filter((item) => selectedArray.includes(item.key)).map((e) => ({
        key: e.key,
        value: e.value.trim(),
      }));
      setter(newOptn);
    } else {
      const newOptn = ArrayObj.filter((item) => value === item.key).map((e) => ({
        key: e.key,
        value: e.value.trim(),
      }));
      setter(newOptn);
    }
  };

  useEffect(() => {
    if (performanceTeamList.length) {
      setTableData(performanceTeamList);
    }
  }, [performanceTeamList, tableData]);

  const handleAddClick = async () => {
    setTitle('Add Evaluation Team');
    setErrors('');
    setSelectedRow(null);
    const teamLeadIds = performanceTeamList.map((team) => team.teamLeadId);
    const members = performanceTeamList.flatMap((team) =>
      team.members.split(',').map((id) => id.trim())
    );

    const filteredEmp = companyEmployeeList.filter((emp) => {
      return !teamLeadIds.includes(emp.employeeId);
    });

    setCompanyEmployeeUpdated(filteredEmp);
    setIsAddMode(true);
    setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    setDisableMulti(true);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Update Team');
    console.log('row is ', row);
    const memberIds = row.members.split(',').map((id) => id.trim());
    const teamLeadIds = performanceTeamList.map((team) => team.teamLeadId);
    const allMembers = performanceTeamList.flatMap((team) =>
      team.members.split(',').map((id) => id.trim())
    );

    const filteredEmployee = companyEmployeeList.filter(
      (emp) =>
        (!allMembers.includes(emp.employeeId.toString()) &&
          emp.employeeType === 'Outsourced' &&
          emp.employeeId !== row.teamLeadId) ||
        memberIds.includes(emp.employeeId.toString())
    );
    const mappedEmps = filteredEmployee.map((emp) => ({
      key: emp.employeeId,
      value: emp.fullName.trim(),
    }));

    setDummyMultiselectObj(mappedEmps);

    // const members = performanceTeamList.flatMap((team) =>
    //   team.members.split(',').map((id) => id.trim())
    // );

    // const filteredEmp = companyEmployeeList.filter((emp) => {
    //   return !members.includes(emp.employeeId.toString());
    // });

    const combinedLead = companyEmployeeList.filter(
      (emp) =>
        emp.employeeId === row.teamLeadId ||
        (!teamLeadIds.includes(emp.employeeId) && !memberIds.includes(emp.employeeId.toString()))
    );

    setCompanyEmployeeUpdated(combinedLead);

    setMultiSelectValues(row.members, mappedEmps, setDummyDefaultValue);
    setDisableMulti(false);
    setSelectedRow(row);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);

    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    const updatedData = {
      evaluationTeamId: data.evaluationTeamId,
      teamName: data.teamName,
      teamCode: data.teamCode,
      teamLeadId: data.teamLeadId,
      companyId: data.companyId,
      username: data.username,
      members: data.members,
      statusId: data?.statusId || 0,

      companyUsername: sessionStorage.getItem('username'),
    };

    let newErrorDetails = '';

    if (
      performanceTeamList.some(
        (item) =>
          item.teamName.toLowerCase().trim() === data.teamName.toLowerCase().trim() &&
          item.evaluationTeamId !== data.evaluationTeamId
      )
    ) {
      newErrorDetails = 'Team Already Exists';
    } else if (
      performanceTeamList.some(
        (item) =>
          item.teamCode.toLowerCase().trim() === data.teamCode.toLowerCase().trim() &&
          item.evaluationTeamId !== data.evaluationTeamId
      )
    ) {
      newErrorDetails = 'Team Code Already Exists';
    }

    setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormAddTeam(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRow(null);
        await refetchData();
      } else {
        try {
          const response = await submitFormUpdateTeam(updatedData);
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
    e.companyUsername = sessionStorage.getItem('username');

    const data = e;

    try {
      const response = await submitFormUpdateTeam(data);

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

  const gridData = performanceTeamList.map((data, index) => ({
    id: index + 1,
    evaluationTeamId: data.evaluationTeamId,
    teamName: data.teamName.trim(),
    teamCode: data.teamCode.trim(),
    teamLeadId: data.teamLeadId,
    companyId: data.companyId,
    username: data.username,
    members: data.members,
    statusId: data.statusId,
  }));

  return (
    <div
      style={{ padding: '20px', position: 'relative' }}
      className={`main-container ${loadingSpinner ? 'blur' : ''}`}
    >
      {loadingSpinner && <Spinner />}
      <Helmet>AddTeam</Helmet>
      <CustomBreadcrumbs
        heading="Add Evaluation Team"
        links={[{ name: 'Dashboard' }, { name: 'AddEvalatiomTeam' }, { name: 'List' }]}
        action={
          <Button
            component={RouterLink}
            onClick={() => {
              handleAddClick();
            }}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Evaluation Team
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
            fields={fields}
            selectedObj={selectedRow}
            onFieldChange={handleDropdownChange}
            errorMessage={errorDetails}
          />
        )}
      </Card>

      <Card style={{ width: '100%' }}>
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
