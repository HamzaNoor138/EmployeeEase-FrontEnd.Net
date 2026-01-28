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
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetAllCountry, useAddOnes, useUpdateOnes } from 'src/api/addCountry';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from '../add';
import Spinner from '../../../../components/loading-screen/spinner';

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'Country Name', width: 210, flex: 1 },
  { field: 'code', headerName: 'Country Code', width: 150, flex: 1 },
];

export default function AddCountryView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();

  const { countryList, refetchDataa } = useGetAllCountry();
  const { submitFormAdd } = useAddOnes();
  const { submitFormUpdate } = useUpdateOnes();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState('');

  const fields = [
    {
      name: 'fullName',
      label: 'Country Name',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },
    {
      name: 'code',
      label: 'Country Code',
      mandatory: true,
      type: 'text',
      maxLength: 6,
    },
  ];

  useEffect(() => {
    if (countryList.length) {
      setTableData(countryList);
    }
  }, [countryList, tableData]);

  const handleAddClick = async () => {
    setTitle('Add Country');
    setErrors('');
    setSelectedRow(null);
    setIsAddMode(true);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Update Country');
    setSelectedRow(row);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    const updatedData = {
      countryId: data?.countryId,
      fullName: data.fullName.trim(),
      code: data.code.trim(),
    };

    let newErrorDetails = '';

    if (
      countryList.some(
        (item) =>
          item.fullName.toLowerCase().trim() === data.fullName.toLowerCase().trim() &&
          item.countryId !== data.countryId
      )
    ) {
      newErrorDetails = 'Country Already Exists';
    } else if (
      countryList.some(
        (item) =>
          item.code.toLowerCase().trim() === data.code.toLowerCase().trim() &&
          item.countryId !== data.countryId
      )
    ) {
      newErrorDetails = 'Country Code Already Exists';
    }

    setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormAdd(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRow(null);
        await refetchDataa();
      } else {
        try {
          const response = await submitFormUpdate(updatedData);
          if (response && response.code === '201' && response.message) {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
            await refetchDataa();
          } else {
            quickEdit.onFalse();
            enqueueSnackbar('Record has been updated successfully');
            setSelectedRow(null);
            await refetchDataa();
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
        await refetchDataa();
      } else {
        enqueueSnackbar('Record Deleted');
        await refetchDataa();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      await refetchDataa();
    }
  };

  const gridData = countryList.map((country, index) => ({
    id: index + 1,
    countryId: country.countryId,
    fullName: country.fullName.trim(),
    code: country.code.trim(),
  }));

  return (
    <div className={`main-container ${loadingSpinner ? 'blur' : ''}`}>
      {loadingSpinner && <Spinner />}
      <Helmet>AddCountry</Helmet>
      <CustomBreadcrumbs
        heading="AddCountry"
        links={[{ name: 'Dashboard' }, { name: 'AddCountry' }, { name: 'List' }]}
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
