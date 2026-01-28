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
import Add from '../add';
import Spinner from '../../../../components/loading-screen/spinner';

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'City Name', width: 210, flex: 1 },
  { field: 'code', headerName: 'City Code', width: 150, flex: 1 },
  { field: 'stateName', headerName: 'State', width: 200, flex: 1 },

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
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  // const [dummyDefaultValue, setDummyDefaultValue] = useState([]);

  // const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);
  // useEffect(() => {
  //   // Check if stateList is not empty and then map it to the format you need
  //   if (stateList.length) {
  //     const mappedStates = stateList.map((state) => ({
  //       key: state.stateId,
  //       value: state.fullName.trim(),
  //     }));
  //     setDummyMultiselectObj(mappedStates);
  //   }
  // }, [stateList]);

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

  useEffect(() => {
    if (cityList.length) {
      setTableData(cityList);
    }
  }, [cityList, tableData]);

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

  const gridData = cityList.map((city, index) => ({
    id: index + 1,
    cityId: city.cityId,
    fullName: city.fullName.trim(),
    code: city.code.trim(),
    stateId: city.stateId,
    statusId: city.statusId,
    stateName: stateList.find((state) => state.stateId === city.stateId)?.fullName || '',
  }));

  return (
    <div className={`main-container ${loadingSpinner ? 'blur' : ''}`}>
      {loadingSpinner && <Spinner />}
      <Helmet>Addcity</Helmet>
      <CustomBreadcrumbs
        heading="Addcity"
        links={[{ name: 'Dashboard' }, { name: 'Addcity' }, { name: 'List' }]}
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
            fields={fields}
            selectedObj={selectedRow}
            onFieldChange={handleDropdownChange}
            errorMessage={errorDetails}
          />
        )}
      </Card>

      <Card style={{ height: '100%', width: '100%' }}>
        <div style={{ height: '100%', width: '100%' }}>
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
