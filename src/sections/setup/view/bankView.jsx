import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Add from './add2';
import Spinner from '../../../components/loading-screen/spinner';
import { useGetAllHrmsPaymentInfo, useAddOne, useUpdateOne } from 'src/api/HrmsPaymentInfo';
import { Grid } from '@mui/material';

export default function EmployeeView() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  // const { removeData } = useDeleteData();

  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();

  const { submitFormHrmsPayment } = useAddOne();

  const { HrmsPaymentInfoUpdate } = useUpdateOne();

  const { HrmsAccountList, refetchData } = useGetAllHrmsPaymentInfo();

  const [errorDetails, setErrors] = useState('');

  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [loadingSpinner, setSpinner] = useState(false);

  const fields = [
    {
      name: 'bankName',
      label: 'Bank_Name ',
      type: 'text',
    },
    {
      name: 'bankCountry',
      label: 'Bank Country',
      type: 'text',
    },
    {
      name: 'bankAccountNumberString',
      label: 'Bank_Account_Number  ',
      type: 'text',
    },
    {
      name: 'iBAN',
      label: 'IBAN',
      type: 'text',
    },

    {
      name: 'bankAccountHolderName',
      label: 'Account Holder’s Name',
      type: 'text',
    },

    {
      name: 'routingNumber',
      label: 'Routing Number',
      type: 'text',
    },

    { name: 'statusId', label: 'Status', mandatory: false, type: 'switch' },
  ];

  useEffect(() => {
    if (HrmsAccountList && HrmsAccountList.length > 0 && HrmsAccountList[0] != null) {
      setSelectedRow(HrmsAccountList[0]);
    }
  }, [HrmsAccountList]);

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
  };

  let addTitle1 = '';

  const handleFormSubmit = async (data) => {
    console.log('data is ', data);
    const updatedData = {
      hrmsPaymentId: data?.hrmsPaymentId,
      bankAccountHolderName: data?.bankAccountHolderName?.trim(),
      bankAccountNumberString: data?.bankAccountNumberString,
      bankName: data?.bankName,
      routingNumber: data?.routingNumber,
      bankCountry: data?.bankCountry,
      iBAN: data?.iBAN,
      statusId: data?.statusId,
    };
    // setSelectedRow(updatedData);
    let newErrorDetails = '';

    setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormHrmsPayment(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRow(null);
        await refetchData();
      } else {
        try {
          const response = await HrmsPaymentInfoUpdate(updatedData);
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

  return (
    <div className={`main-container ${loadingSpinner ? 'blur' : ''}`}>
      {loadingSpinner && <Spinner />}
      <Helmet>Bank Details</Helmet>
      <CustomBreadcrumbs
        heading="Bank"
        links={[{ name: 'Dashboard' }, { name: 'Bank' }, { name: 'List' }]}
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />

      <Grid sx={{ justifyContent: 'center', mt: 5 }} container spacing={3}>
        <Grid item xs={9}>
          <Card sx={{ padding: 7 }}>
            <Add
              currentUser={isAddMode ? null : selectedRow}
              onClose={quickEdit.onFalse}
              open={quickEdit.value}
              onSubmitInsert={handleFormSubmit}
              title={'Enter Bank Account Details'}
              fields={fields}
              selectedObj={selectedRow}
              onFieldChange={handleDropdownChange}
              errorMessage={errorDetails}
            />
          </Card>
        </Grid>
      </Grid>

      {/* <Card style={{ height: '100%', width: '100%' }}>
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
                          <g fill="none" stroke="currentColor" stroke-width="1">
                            <path
                              stroke-linecap="round"
                              d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"
                            />
                            <path
                              stroke-linecap="round"
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
              console.log('deleteItem', selectedRow);
              setConfirmDialogOpen(false);
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </div>
  );
}
