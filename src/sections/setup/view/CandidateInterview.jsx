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
  TextField,
  DialogContent,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';
import { parseISO, format } from 'date-fns';
import {
  useGetAllCandidateScheduleInterview,
  useUpdateOne,
} from 'src/api/candidateScheduleInterview';

import { useDownloadResume } from 'src/api/candidate';
import Iconify from 'src/components/iconify';
import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from './add';
import { useGetAllSkills } from 'src/api/skill';
import Spinner from '../../../components/loading-screen/spinner';
import { display, height } from '@mui/system';
import { useRenegedOffer } from 'src/api/candidateOfferedJob';
import OfferLetterPDF from './OfferLetter';
import OfferLetterDownload from './OfferLetterDownload';
import { pdf } from '@react-pdf/renderer';

export default function SchedualedInterview() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const { CandidateScheduleInterviewList, refetchData } = useGetAllCandidateScheduleInterview();
  const { submitFormUpdate } = useUpdateOne();
  const { enqueueSnackbar } = useSnackbar();
  const { DownloadResume } = useDownloadResume();

  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [open, setOpen] = useState(false);
  const [showbutton, setShowButton] = useState(false);
  const [reason, setReason] = useState('');

  const { RenegedOffer } = useRenegedOffer();

  const [scheduleId, setScheduleId] = useState(null);
  const { skillList } = useGetAllSkills();
  const [dialogReason, setDialogReason] = useState('');

  const [offerLetterData, setOfferLetterData] = useState({});
  const [openOfferLetter, setOpenOfferLetter] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dummyDefaultValue, setDummyDefaultValue] = useState([]);

  const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);

  useEffect(() => {
    // Check if stateList is not empty and then map it to the format you need
    if (skillList.length) {
      const mappedSkills = skillList.map((skill) => ({
        key: skill.skillId,
        value: skill.fullName.trim(),
      }));
      setDummyMultiselectObj(mappedSkills);
    }
  }, [skillList]);

  const TABLE_HEAD = [
    { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
    { field: 'companyName', headerName: 'Company Name', width: 150, flex: 1 },
    { field: 'jobTitle', headerName: 'Job Title', width: 200, flex: 1 },
    { field: 'minSalary', headerName: 'Min Salary', width: 100, flex: 1 },
    { field: 'maxSalary', headerName: 'Max Salary', width: 100, flex: 1 },

    { field: 'scheduleTime', headerName: 'Schedule Time', width: 200, flex: 1.25 },
    {
      field: 'approvalStatus',
      headerName: 'Interview Status',
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '55px',
          }}
        >
          <Badge
            color={
              params.row.approvalStatus === 'Scheduled' ||
              params.row.approvalStatus === 'Approved' ||
              params.row.approvalStatus === 'Accepted' ||
              params.row.approvalStatus === 'OfferLetterSended' ||
              params.row.approvalStatus === 'hired' ||
              params.row.approvalStatus === 'InNoticePeriod' ||
              params.row.approvalStatus === 'joined'
                ? 'success'
                : params.row.approvalStatus === 'Recommended' ||
                  params.row.approvalStatus === 'EvaluateInterview' ||
                  params.row.approvalStatus === 'Deffered'
                ? 'warning'
                : 'error'
            }
            badgeContent={
              params.row.approvalStatus === 'Scheduled'
                ? 'Scheduled'
                : params.row.approvalStatus === 'Approved'
                ? 'Approved'
                : params.row.approvalStatus === 'joined'
                ? 'joined'
                : params.row.approvalStatus === 'InNoticePeriod'
                ? 'In Notice Period'
                : params.row.approvalStatus === 'RenegedOffer'
                ? 'Reneged Offer'
                : params.row.approvalStatus === 'DelayedOnboarding'
                ? 'Delayed Onboarding'
                : params.row.approvalStatus === 'Recommended'
                ? 'Evaluation in process'
                : params.row.approvalStatus === 'NotRecommended'
                ? 'Not Recommended'
                : params.row.approvalStatus === 'hired'
                ? 'Hired'
                : params.row.approvalStatus === 'resign'
                ? 'resign'
                : params.row.approvalStatus === 'NoShow'
                ? 'NoShow'
                : params.row.approvalStatus === 'Deffered'
                ? 'Deffered'
                : params.row.approvalStatus === 'EvaluateInterview'
                ? 'Evaluation in process'
                : params.row.approvalStatus === 'Accepted'
                ? 'Accepted'
                : params.row.approvalStatus === 'OfferExpired'
                ? 'Offer Expired'
                : params.row.approvalStatus === 'OfferLetterSended'
                ? 'Offer Letter Recieved'
                : params.row.approvalStatus === 'CompanyCancelled'
                ? 'Cancelled'
                : params.row.approvalStatus === 'CompanyCancelledReason'
                ? 'Cancelled'
                : params.row.approvalStatus === 'CompanyCancelledReason'
                ? 'Cancelled'
                : params.row.approvalStatus === 'Rejected'
                ? 'Rejected'
                : params.row.approvalStatus === 'OfferRejected'
                ? 'Offer Rejected'
                : ''
            }
          />
          {params.row.approvalStatus === 'CompanyCancelled' ||
          params.row.approvalStatus === 'CompanyCancelledReason' ? (
            <Tooltip title="Reason for cancellation" placement="top" arrow>
              <IconButton
                onClick={() => handleClickOpen(params)}
                size="small"
                style={{ marginLeft: '40px' }}
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
                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          ) : null}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cancellation Reason</DialogTitle>
            <DialogContent>{dialogReason}</DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ),
    },
  ];

  const handleClickOpen = (params) => {
    setDialogReason(params.row.reason);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const fields = [
    {
      name: 'jobTitle',
      label: 'Job Title',
      mandatory: true,
      type: 'text',
      maxLength: 100,
      disabled: true,
    },
    {
      name: 'jobDescription',
      label: 'Job Description',
      mandatory: true,
      type: 'text',
      maxLength: 250,
      multiline: true,
      disabled: true,
    },

    {
      name: 'scheduleTime',
      label: 'Interview Scheduled Time',
      mandatory: true,
      type: 'datetime',
      disabled: true,
    },
    {
      name: 'interviewDuration',
      label: 'Interview Duration in Minutes',
      mandatory: true,
      type: 'number',
      disabled: true,
    },
    {
      name: 'minSalary',
      label: 'Minimum Salary',
      mandatory: true,
      type: 'number',
      disabled: true,
    },
    {
      name: 'maxSalary',
      label: 'Maximum Salary',
      mandatory: true,
      type: 'number',
      disabled: true,
    },

    {
      name: 'companyName',
      label: 'Company Name',
      mandatory: true,
      type: 'text',
      maxLength: 100,
      disabled: true,
    },

    {
      name: 'address',
      label: 'Company Address',
      mandatory: true,
      type: 'text',
      maxLength: 100,
      disabled: true,
    },

    {
      name: 'officeEmail',
      label: 'Company Email',
      mandatory: true,
      type: 'text',
      maxLength: 100,
      disabled: true,
    },
    {
      name: 'officeNo',
      label: 'Company Office Number',
      mandatory: true,
      type: 'text',
      maxLength: 100,
      disabled: true,
    },

    {
      name: 'skills',
      label: 'Required Skills',
      mandatory: true,
      type: 'multiselect',
      disabled: true,
      options: dummyMultiselectObj,
      defaultValue: dummyDefaultValue,
    },
  ];
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

  const handleViewJobDetails = async (row) => {
    setShowButton(false);
    setErrors('');
    setTitle('Job Details');
    setMultiSelectValues(row.skills, dummyMultiselectObj, setDummyDefaultValue);
    setSelectedRow(row);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    // setMultiSelectValues(row.stateIds, dummyMultiselectObj, setDummyDefaultValue);

    quickEdit.onTrue();
  };

  const handleEditClick = async (e) => {
    e.approvalStatus = 'Accepted';
    e.reason = reason;
    e.scheduleTime = format(new Date(e.scheduleTime), "yyyy-MM-dd'T'HH:mm:ss");
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

  const handleFormSubmit = async (data) => {
    const updatedData = {
      jobDescriptionId: data.jobDescriptionId,
      candidateId: data.candidateId,
      scheduleInterviewId: data.scheduleInterviewId,
      scheduleTime: format(new Date(data.scheduleTime), "yyyy-MM-dd'T'HH:mm:ss"), // Convert DateTime to ISO string
      approvalStatus: data.approvalStatus.trim(),
    };

    let newErrorDetails = '';

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
    e.approvalStatus = 'Rejected';
    e.reason = reason;
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
  const GetOfferLetter = async (scheduleInterviewId) => {
    setLoading(true);

    setScheduleId(scheduleInterviewId);
    try {
      const response = await fetch(
        'http://localhost:5161/api/CandidateOfferedJob/GenerateOfferLetter',
        {
          method: 'POST',
          body: JSON.stringify(scheduleInterviewId),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const responseData = await response.json();
      setOpenOfferLetter(true);
      console.log(responseData);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setOfferLetterData(responseData.data[0]);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferDecision = async (decision) => {
    const offerLetterDecision = {
      decision,
      scheduleInterviewId: scheduleId,
    };

    const response = await fetch(
      'http://localhost:5161/api/CandidateOfferedJob/OfferLetterDecision',
      {
        method: 'POST',
        body: JSON.stringify(offerLetterDecision),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const responseData = await response.json();
    if (responseData.code == 200) {
      setOpenOfferLetter(false);
      enqueueSnackbar('Offer Letter Status Updated Sucessfully');
      refetchData();
    } else if (responseData.code == 404) {
      enqueueSnackbar(responseData.message, {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });

      enqueueSnackbar('Reneged the previous Offer if Possible', {
        variant: 'border',
        style: { backgroundColor: '#FF5630', color: '#fff' },
      });
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  };

  const HandleRenegedOffer = async (row) => {
    const data = { candidateId: row.candidateId, scheduleInterviewId: row.scheduleInterviewId };

    const response = await RenegedOffer(data);

    if (response.code == 200) {
      refetchData();
    }
  };

  const DownloadOfferLetter = async () => {
    try {
      const pdfDoc = <OfferLetterDownload offerData={offerLetterData} />;
      const pdfBlob = await pdf(pdfDoc).toBlob();

      // Create a download URL and trigger download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Employee-Offer-Letter.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error fetching or generating report:', error);
    }
  };

  const handleCloseOfferLetter = () => {
    setOpenOfferLetter(false);
    URL.revokeObjectURL(offerLetterData);
  };

  const gridData = CandidateScheduleInterviewList.map((item, index) => ({
    id: index + 1,
    jobDescriptionId: item.jobId,
    jobDescription: item.jobDescription.trim(),
    jobTitle: item.jobTitle.trim(),
    maxSalary: item.maxSalary,
    minSalary: item.minSalary,
    candidateId: item.candidateId,
    interviewDuration: item.interviewDuration,
    skills: item?.skills,
    address: item.address,
    officeNo: item.officeNo,
    officeEmail: item.officeEmail,
    reason: item.reason,
    scheduleInterviewId: item.scheduleInterviewId,
    scheduleTime: parseISO(item.scheduleTime),
    approvalStatus: item.approvalStatus.trim(),
    companyName: item.companyName.trim(),
    websiteLink: item.websiteLink.trim(),
  }));
  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      {loadingSpinner && <Spinner />}
      <Helmet>Candidate Schedule Interviews</Helmet>
      <CustomBreadcrumbs
        heading="Candidate Schedule Interviews"
        links={[{ name: 'Dashboard' }, { name: 'Candidate Schedule Interviews' }, { name: 'List' }]}
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
            showbuttons={showbutton}
          />
        )}
      </Card>

      <Dialog open={openOfferLetter} onClose={handleCloseOfferLetter} maxWidth="md" fullWidth>
        <DialogTitle>Offer Letter PDF</DialogTitle>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '300px',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={50} />
          </Box>
        )}

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
          <OfferLetterPDF offerData={offerLetterData} />
        </DialogContent>

        <DialogActions sx={{ height: '50px', mb: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'red', color: 'white' }}
            onClick={() => handleOfferDecision('reject')}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'blue', color: 'white' }}
            onClick={() => handleOfferDecision('accept')}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'green', color: 'white' }}
            onClick={() => DownloadOfferLetter()}
          >
            Download
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
                    {params.row.approvalStatus == 'OfferLetterSended' && (
                      <Tooltip title="Offer Letter" placement="top" arrow>
                        <IconButton onClick={() => GetOfferLetter(params.row.scheduleInterviewId)}>
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="blue"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"
                            />
                          </svg>
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="See Job Details" placement="top" arrow>
                      <IconButton color="primary" onClick={() => handleViewJobDetails(params.row)}>
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
                            stroke-width="2"
                            d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                          />
                          <path
                            stroke="currentColor"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Website Link" placement="top" arrow>
                      <IconButton onClick={() => window.open(params.row.websiteLink, '_blank')}>
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
                            stroke="blue"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>
                    {params.row.approvalStatus !== 'InNoticePeriod' &&
                    params.row.approvalStatus !== 'joined' &&
                    params.row.approvalStatus !== 'OfferLetterSended' ? (
                      <>
                        <Tooltip title="Accept Interview" placement="top" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(params.row)}
                            disabled={params.row.approvalStatus !== 'Scheduled'}
                          >
                            <svg
                              className="w-[39px] h-[39px] text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Interview" placement="top" arrow>
                          <IconButton
                            color="secondary"
                            disabled={params.row.approvalStatus !== 'Scheduled'}
                            onClick={() => {
                              setConfirmDialogOpen(true);
                              setSelectedRow(params.row);
                            }}
                          >
                            <svg
                              className="w-[39px] h-[39px] text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      params.row.approvalStatus == 'InNoticePeriod' && (
                        <Tooltip title="Reneged Offer" placement="top" arrow>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              HandleRenegedOffer(params.row);
                            }}
                          >
                            <svg
                              className="w-[39px] h-[39px] text-gray-800 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </IconButton>
                        </Tooltip>
                      )
                    )}
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
        title="Delete this Job"
        content={
          <>
            Are you sure you want to delete the Job?
            <TextField
              placeholder="Reason"
              multiline
              sx={{ mt: 3 }}
              rows={4}
              fullWidth
              onChange={(event) => setReason(event.target.value)}
              required
            />
            {reason === '' && <p style={{ color: 'red' }}>Please enter a reason</p>}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (reason !== '') {
                deleteItem(selectedRow);
                setConfirmDialogOpen(false);
              }
            }}
          >
            Delete
          </Button>
        }
      />
    </Box>
  );
}
