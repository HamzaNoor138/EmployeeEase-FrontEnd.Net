import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useBoolean } from 'src/hooks/use-boolean';
import CircularProgress from '@mui/material/CircularProgress';

import { useRegisterEmployeeOne } from 'src/api/attendanceFacialRecognition';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Spinner from '../../../components/loading-screen/spinner';
import { GetOutSourcedCompanyEmployee, useDeleteOne } from 'src/api/attendanceFacialRecognition';
import FileManagerNewFolderDialog from 'src/sections/file-manager/file-manager-new-folder-dialog';

import { Box } from '@mui/system';

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'fullName', headerName: 'Employee Name', width: 210, flex: 1 },
  { field: 'employeeCode', headerName: 'Employee Code', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 200, flex: 1 },
];

export default function RegisterEmployeeFaceView() {
  const { enqueueSnackbar } = useSnackbar();
  const { RegisterEmployee } = useRegisterEmployeeOne();
  const { EmployeeList, refetchDatta } = GetOutSourcedCompanyEmployee();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  const { submitFormDelete } = useDeleteOne();
  const upload = useBoolean();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const deleteItem = async () => {
    try {
      setSpinner(true);
      const response = await submitFormDelete(employeeId);

      if (response && response.code === '500' && response.message) {
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      } else {
        enqueueSnackbar('Record Deleted');
      }
      await refetchDatta();
      setSpinner(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting record:', error);
      await refetchDatta();
    }
  };

  const gridData = EmployeeList.map((data, index) => ({
    id: index + 1,
    employeeId: data.employeeId,
    fullName: data.fullName.trim(),
    employeeCode: data.employeeCode?.trim(),
    email: data.email,
    registered: data.registered,
  }));

  // Function to open the dialog
  const handleOpenDialog = (employeeId) => {
    setEmployeeId(employeeId);
    setDialogOpen(true);
    startVideo();
    setStatusText('');
    setErrorText('');
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    stopVideo(); // Stop the video stream when dialog closes
    setCapturedImage(null); // Reset the captured image
    setImageCaptured(false); // Reset the state to show video again
    setSpinner(false);
    setStatusText('');
    setErrorText('');
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error('Error accessing webcam: ', err));
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    setCapturedImage(imageData);
    setImageCaptured(true);
  };

  const recaptureImage = () => {
    setCapturedImage(null);
    startVideo();
    setImageCaptured(false);
    setErrorText('');
    setStatusText('');
  };

  const handleRegister = async () => {
    if (!capturedImage) {
      console.error('No image captured');
      return;
    }
    setSpinner(true);
    setErrorText('');
    setStatusText('Registering Employee In Progress');

    canvasRef.current.toBlob(
      async (blob) => {
        const formData = new FormData();
        formData.append('employeeId', employeeId);
        formData.append('companyUsername', sessionStorage.getItem('username'));
        formData.append('image', blob, 'image.jpg');
        const response = await RegisterEmployee(formData);
        setSpinner(false);
        if (response.code == 200) {
          console.log('Image registered successfully');
          enqueueSnackbar('Image registered successfully');
          handleCloseDialog();
          refetchDatta();
        } else if (response.code == 400) {
          setErrorText(response.message);
          enqueueSnackbar(response.message, {
            variant: 'border',
            style: { backgroundColor: '#FF5630', color: '#fff' },
          });
        } else {
          setErrorText(response.message);
          enqueueSnackbar(response.message, {
            variant: 'border',
            style: { backgroundColor: '#FF5630', color: '#fff' },
          });
        }
      },
      'image/jpeg',
      1.0
    );
  };

  const handleUploadRegister = async (image) => {
    if (!image[0]) {
      console.error('No image captured');
      return;
    }
    setSpinner(true);
    setErrorText('');
    setStatusText('Registering Employee In Progress');

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('companyUsername', sessionStorage.getItem('username'));
    formData.append('image', image[0]);
    const response = await RegisterEmployee(formData);
    setSpinner(false);
    if (response.code == 200) {
      console.log('Image registered successfully');
      enqueueSnackbar('Image registered successfully');
      handleCloseDialog();
      refetchDatta();
    } else if (response.code == 400) {
      setErrorText(response.message);
      enqueueSnackbar(response.message, {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    } else {
      setErrorText(response.message);
      enqueueSnackbar(response.message, {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    }
  };
  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      <Helmet>Register Employee Face</Helmet>
      <CustomBreadcrumbs
        heading="Register Employee Face"
        links={[{ name: 'Dashboard' }, { name: 'Register Employee Face' }, { name: 'List' }]}
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />

      <FileManagerNewFolderDialog
        open={upload.value}
        onClose={upload.onFalse}
        onUpload={handleUploadRegister}
        title="Upload Employee Face Image"
        UploadButtonName="Upload Image "
        multiple={false}
        heading="Drop or Select your Image to Register Employee Face"
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Capture Image</DialogTitle>
        <DialogContent>
          {!imageCaptured ? (
            <>
              <video ref={videoRef} width="100%" height="auto" autoPlay />
            </>
          ) : (
            <img src={capturedImage} alt="Captured" width="100%" />
          )}
        </DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
          }}
        >
          {loadingSpinner && (
            <>
              <Typography sx={{ mr: 2 }}>{statusText}</Typography>
              <CircularProgress size={30} />
            </>
          )}

          {errorText && <Typography sx={{ color: 'red' }}>{errorText}</Typography>}
        </Box>
        <canvas
          id="canvas"
          style={{ display: 'none' }}
          ref={canvasRef}
          width={'640px'}
          height={'480px'}
        />
        <DialogActions>
          {!imageCaptured ? (
            <Button onClick={captureImage} variant="contained" color="primary">
              Capture
            </Button>
          ) : (
            <>
              <Button
                onClick={handleRegister}
                disabled={loadingSpinner}
                variant="contained"
                color="primary"
              >
                Register
              </Button>
              <Button
                onClick={recaptureImage}
                disabled={loadingSpinner}
                variant="outlined"
                color="secondary"
              >
                Recapture
              </Button>
            </>
          )}

          <Button onClick={handleCloseDialog} variant="outlined">
            Close
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
        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            '& .MuiDataGrid-root': {
              minWidth: {
                xs: '250%',
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
                flex: 1,

                renderCell: (params) => (
                  <div>
                    <Tooltip title="Take Picture" placement="top" arrow>
                      <IconButton
                        color="primary"
                        disabled={params.row.registered}
                        onClick={() => handleOpenDialog(params.row.employeeId)}
                      >
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
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                          />
                          <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Upload Picture" placement="top" arrow>
                      <IconButton
                        color="primary"
                        disabled={params.row.registered}
                        onClick={() => {
                          upload.onTrue();
                          setEmployeeId(params.row.employeeId);
                        }}
                      >
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
                            d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton
                        color="secondary"
                        disabled={!params.row.registered}
                        onClick={() => {
                          setConfirmDialogOpen(true);
                          setEmployeeId(params.row.employeeId);
                        }}
                      >
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
                            stroke="red"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
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
            endIcon={loadingSpinner && <CircularProgress size={20} sx={{ mr: 2 }} />}
            onClick={() => {
              deleteItem();
            }}
          >
            {loadingSpinner ? '' : 'Delete'}
          </Button>
        }
      />
    </Box>
  );
}
