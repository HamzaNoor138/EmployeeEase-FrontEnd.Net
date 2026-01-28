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
  Dialog,
  DialogTitle,
  DialogActions,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InterviewEvaluationForm from './InterviewEvaluationForm';
import { useGetAllCandidateOfferedJob } from 'src/api/candidateOfferedJob';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetAllCompanyScheduleInterview, useUpdateOne } from 'src/api/companyScheduleInterview';
import { useAddInterviewFeedbackOne } from 'src/api/interviewFeedback';
import { useGetAllinterview } from 'src/api/interviewPanel';
import { useDownloadResume } from 'src/api/candidate';
import Iconify from 'src/components/iconify';
import Badge from '@mui/material/Badge';
import { parseISO, format, parse } from 'date-fns';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from './add';
import Spinner from '../../../components/loading-screen/spinner';
import Grid from '@mui/material/Unstable_Grid2';
import {
  useAddCandidateOfferLetter,
  useCandidateOfferedUpdateOne,
} from 'src/api/candidateOfferedJob';
import { Box, height } from '@mui/system';

import BankingExpensesCategories from 'src/sections/overview/banking/banking-expenses-categories';
import { useTheme } from '@mui/material/styles';

export default function SchedualedInterview() {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowLetter, setSelectedRowLetter] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAddModeLetter, setIsAddModeLetter] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const quickEditLetter = useBoolean();
  const { CompanyScheduleInterviewList, ApprovalStatusCountList, refetchData } =
    useGetAllCompanyScheduleInterview();
  const { submitInterviewFeedbackAdd } = useAddInterviewFeedbackOne();
  const { submitCandidateOfferLetter } = useAddCandidateOfferLetter();
  const { submitFormUpdate } = useUpdateOne();

  const { submitCandidateOfferFormUpdate } = useCandidateOfferedUpdateOne();
  const theme = useTheme();
  const [scheduleInterviewId, setScheduleInterviewId] = useState(null);
  const { candidateOfferedJobList, refetchOfferData } = useGetAllCandidateOfferedJob();

  const { DownloadResume } = useDownloadResume();
  const { interviewList } = useGetAllinterview();
  const [errorDetails, setErrors] = useState('');
  const [errorDetailsLetter, setErrorDetailsLetter] = useState('');

  const [addTitle, setTitle] = useState('');
  const [addTitleLetter, setTitleLetter] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [contract, setContract] = useState(null);

  const [scheduleValue, setScheduleValue] = useState("yyyy-MM-dd'T'HH:mm:ss");
  const [interviewDuration, setInterviewDuration] = useState('');

  const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);
  const [dummyDefaultValue, setDummyDefaultValue] = useState([]);

  const [availableInterviewers, setAvailableInterviewers] = useState([]);
  const [showbutton, setShowButton] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  const [disableAllFields, setDisableAllFields] = useState(false);
  const [candidateId, setcandidateId] = useState(null);
  const [feedbackData, setFeedBackData] = useState(null);

  const handleClickOpen = (reason) => {
    setReason(reason);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const statusColorMap = {
    Scheduled: theme.palette.primary.main,
    Recommended: theme.palette.primary.light,
    Hired: theme.palette.success.main,
    Approved: theme.palette.success.dark,
    Accepted: theme.palette.success.darker,
    OfferLetterSended: theme.palette.info.main,
    Cancelled: theme.palette.warning.main,
    OfferExpired: theme.palette.warning.dark,
    Deferred: theme.palette.info.light,
    Rejected: theme.palette.error.main,
    EvaluateInterview: theme.palette.info.dark,
    NotRecommended: theme.palette.error.dark,
    Pending: theme.palette.grey[500],
    OfferRejected: theme.palette.error.darker,
  };

  useEffect(() => {
    // Check if stateList is not empty and then map it to the format you need
    if (availableInterviewers.length != 0) {
      const mappedSkills = availableInterviewers.data.map((interviewer) => ({
        key: interviewer.interviewPanelId,
        value: interviewer.fullName,
      }));
      setDummyMultiselectObj(mappedSkills);
    }
  }, [availableInterviewers]);

  useEffect(() => {
    if (scheduleValue != undefined && interviewDuration != undefined && interviewDuration != '') {
      const fetchData = async () => {
        try {
          const body = {
            scheduleTime: format(new Date(scheduleValue), "yyyy-MM-dd'T'HH:mm:ss"),
            duration: interviewDuration,
            username: sessionStorage.getItem('username'),
          };

          const jsonBody = JSON.stringify(body);

          const response = await fetch(
            'http://localhost:5161/api/ScheduleInterview/GetAvailableInterviewers',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: jsonBody,
            }
          );

          const responsedata = await response.json();

          setAvailableInterviewers(responsedata);
        } catch (error) {
          console.error(error);
          // Handle the error gracefully, e.g., display an error message to the user
        }
      };

      fetchData();
    }
  }, [scheduleValue, interviewDuration]);

  const fields = [
    {
      name: 'scheduleTime',
      label: 'Schedule Interview Time',
      mandatory: true,
      type: 'datetime',
      disabled: disableAllFields,
    },
    {
      name: 'interviewerIds',
      label: 'Interviewr Name',
      mandatory: true,
      type: 'multiselect',
      options: dummyMultiselectObj,
      defaultValue: dummyDefaultValue,
      disabled: interviewDuration == '' ? true : false || disableAllFields,
    },
    {
      name: 'interviewDuration',
      label: 'Interview Duration in Minutes',
      mandatory: true,
      type: 'number',
      disabled: scheduleValue == "yyyy-MM-dd'T'HH:mm:ss" ? true : false,
    },
  ];

  const mindate = new Date();
  console.log('current date', mindate);

  const letterFields = [
    {
      name: 'salary',
      label: 'Salary with HRMS fee Included',
      type: 'textStartIcon',
      mandatory: true,
      icon: 'Rs',
    },

    {
      name: 'currentNoticePeriod',
      label: 'Current Notice Period In Days',
      mandatory: true,
      type: 'number',
    },

    {
      name: 'clockInTime',
      label: 'Work Start Time',
      mandatory: true,
      type: 'time',
    },

    {
      name: 'clockOutTime',
      label: 'Work End Time',
      mandatory: true,
      type: 'time',
    },
    {
      name: 'offerExpiryDate',
      label: 'Offer Expiry Date',
      mandatory: true,
      type: 'date',
      minDateCheck: mindate,
    },

    {
      name: 'contract',
      label: 'Contract base',
      mandatory: false,
      type: 'switch',
    },
    {
      name: 'contractDuration',
      label: 'Contract Duration In Months',
      type: 'number',
      disabled: !contract,
    },
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
    } else if (event.target.name === 'interviewerIds') {
      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle || '',
        jobDescription: '', // This field is not present in the original data
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        candidateId: data?.candidateId,
        scheduleInterviewId: data?.scheduleInterviewId,
        scheduleTime: data?.scheduleTime,
        approvalStatus: data?.approvalStatus || '',
        interviewerIds: event.target.value,
        reason: data?.reason || '',
        interviewDuration: data?.interviewDuration || 0,
      };

      setSelectedRow(updatedData);

      setMultiSelectValues(event.target.value, dummyMultiselectObj, setDummyDefaultValue);
    } else if (event.target.name === 'scheduleTime') {
      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle || '',
        jobDescription: '', // This field is not present in the original data
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        candidateId: data?.candidateId,
        scheduleInterviewId: data?.scheduleInterviewId,
        scheduleTime: event.target.value,
        approvalStatus: data?.approvalStatus || '',
        interviewerIds: data?.interviewerIds,
        reason: data?.reason || '',
        interviewDuration: data?.interviewDuration || 0,
      };
      setSelectedRow(updatedData);
      setScheduleValue(event.target.value);
    } else if (event.target.name === 'interviewDuration') {
      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle || '',
        jobDescription: '', // This field is not present in the original data
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        candidateId: data?.candidateId,
        scheduleInterviewId: data?.scheduleInterviewId,
        scheduleTime: data?.scheduleTime,
        approvalStatus: data?.approvalStatus || '',
        interviewerIds: data?.interviewerIds,
        reason: data?.reason || '',
        interviewDuration: event.target.value || 0,
      };
      setSelectedRow(updatedData);
      setInterviewDuration(event.target.value);
    }
  };

  const handleLetterDropdownChange = (event, data) => {
    if (event.target.name === 'contract') {
      const updatedData = {
        ...data,
        contract: event.target.checked ? 1 : 0,
      };
      setContract(event.target.checked);
      setSelectedRowLetter(updatedData);
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

  const handleAddClick = async () => {
    setTitle('Add City');
    setErrors('');
    setSelectedRow(null);
    setIsAddMode(true);
    setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    quickEdit.onTrue();
  };

  const handleLetterAddClick = async (row) => {
    setScheduleInterviewId(row.scheduleInterviewId);
    setcandidateId(row.candidateId);
    setContract(true);
    setTitleLetter('Offer Letter');
    setErrorDetailsLetter('');
    setSelectedRowLetter(null);
    setIsAddModeLetter(true);
    // setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    quickEditLetter.onTrue();
  };

  const handleLetterEditClick = async (row) => {
    setErrorDetailsLetter('');
    setScheduleInterviewId(row.scheduleInterviewId);
    setcandidateId(row.candidateId);
    setTitleLetter('Update Offer Letter');
    const offerLetter = candidateOfferedJobList.filter(
      (letter) => letter.scheduleInterviewId == row.scheduleInterviewId
    );

    let updatedofferLetter = offerLetter[0];

    let updatedofferLetters = {
      ...updatedofferLetter,
      clockInTime: parse(updatedofferLetter.clockInTime, 'HH:mm:ss', new Date()),
      clockOutTime: parse(updatedofferLetter.clockOutTime, 'HH:mm:ss', new Date()),
      offerExpiryDate: parseISO(updatedofferLetter.offerExpiryDate),
    };
    setContract(updatedofferLetter.contract == 1 ? true : false);
    setSelectedRowLetter(updatedofferLetters);
    setIsAddModeLetter(false);
    setSpinner(true);
    setSpinner(false);

    quickEditLetter.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Schedule Interview');
    setShowButton(true);
    setDisableAllFields(false);
    setInterviewDuration('');

    if (
      row.approvalStatus == 'Accepted' ||
      row.approvalStatus == 'Recommended' ||
      row.approvalStatus == 'EvaluateInterview' ||
      row.approvalStatus == 'OfferLetterSended' ||
      row.approvalStatus == 'NotRecommended' ||
      row.approvalStatus == 'OfferRejected' ||
      row.approvalStatus == 'NoShow' ||
      row.approvalStatus === 'InNoticePeriod' ||
      row.approvalStatus === 'RenegedOffer'
    ) {
      setShowButton(false);
      setDisableAllFields(true);
      setScheduleValue("yyyy-MM-dd'T'HH:mm:ss");
    } else if (row.approvalStatus == 'CompanyCancelledReason') {
      setScheduleValue("yyyy-MM-dd'T'HH:mm:ss");
      setShowButton(false);
      setDisableAllFields(true);
    } else if (row.approvalStatus == 'CompanyCancelled') {
      setScheduleValue("yyyy-MM-dd'T'HH:mm:ss");
      setShowButton(false);
      setDisableAllFields(true);
    } else if (row.approvalStatus == 'Scheduled' || row.approvalStatus == 'Rejected') {
      setScheduleValue(row.scheduleTime);
      setInterviewDuration(row.interviewDuration);
    } else if (row.approvalStatus == 'Pending') {
      setScheduleValue("yyyy-MM-dd'T'HH:mm:ss");
      setInterviewDuration('');
    }

    console.log('row is ', row);
    setSelectedRow(row);
    const mappedSkills = interviewList.map((interviewer) => ({
      key: interviewer.interviewPanelId,
      value: interviewer.fullName,
    }));
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    setMultiSelectValues(row.interviewerIds, mappedSkills, setDummyDefaultValue);
    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    const rowData = selectedRow;
    const updatedData = {
      jobDescriptionId: data.jobDescriptionId,
      candidateId: data.candidateId,
      scheduleInterviewId: data.scheduleInterviewId,
      scheduleTime: format(new Date(data.scheduleTime), "yyyy-MM-dd'T'HH:mm:ss"), // Convert DateTime to ISO string
      approvalStatus: data.approvalStatus.trim(),
      interviewerIds: data.interviewerIds || null,
      reason: data.reason || null,
      interviewDuration: data.interviewDuration || null,
    };

    let newErrorDetails = '';

    setErrorDetailsLetter(newErrorDetails);
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

  const handleLetterFormSubmit = async (data) => {
    const updatedData = {
      candidateOfferedJobId: data?.candidateOfferedJobId,
      scheduleInterviewId: scheduleInterviewId,
      candidateId: candidateId,
      salary: data?.salary || 0,
      currentNoticePeriod: data?.currentNoticePeriod || 0,
      clockInTime: format(new Date(data.clockInTime), 'HH:mm:ss'), // Convert TimeSpan to HH:mm:ss format
      clockOutTime: format(new Date(data.clockOutTime), 'HH:mm:ss'), // Convert TimeSpan to HH:mm:ss format
      offerExpiryDate: format(new Date(data.offerExpiryDate), 'yyyy-MM-dd'), // Convert DateOnly to ISO string
      contract: data?.contract || 0,
      contractDuration: data?.contractDuration || null,
    };
    let newErrorDetails = '';

    setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddModeLetter === true) {
        await submitCandidateOfferLetter(updatedData);
        quickEditLetter.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRowLetter(null);
        await refetchOfferData();
        await refetchData();
      } else {
        try {
          const response = await submitCandidateOfferFormUpdate(updatedData);
          if (response && response.code === '201' && response.message) {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
            await refetchOfferData();
          } else {
            quickEditLetter.onFalse();
            enqueueSnackbar('Record has been updated successfully');
            setSelectedRowLetter(null);
            await refetchOfferData();
          }
        } catch (error) {
          console.error('Error Updating record:', error);
        }
      }
    }
  };

  const deleteItem = async (e) => {
    e.approvalStatus = 'Cancelled';
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

  const gridData = CompanyScheduleInterviewList.map((item, index) => ({
    id: index + 1,
    jobDescriptionId: item.jobId,
    jobTitle: item.jobTitle.trim(),
    userType: sessionStorage.getItem('userType'),
    maxSalary: item.maxSalary,
    minSalary: item.minSalary,
    phoneNumber: item.phoneNumber.trim(),
    candidateName: item.candidateName.trim(),
    candidateId: item.candidateId,
    scheduleInterviewId: item.scheduleInterviewId,
    scheduleTime: item.scheduleTime ? parseISO(item.scheduleTime) : 'Not Assigned',
    approvalStatus: item.approvalStatus.trim(),
    interviewerIds: item.interviewerIds || ' ',
    reason: item.reason || '',
    interviewDuration: item.interviewDuration || 0,
  }));

  const [formOpen, setFormOpen] = useState(false);

  const handleOpen = (scheduleId) => {
    setScheduleId(scheduleId);
    setFormOpen(true);
  };

  const handleFeedbackClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    console.log('feedback data', feedbackData);
  }, [feedbackData]);

  const handleFeedbackSubmit = async (data) => {
    const formData = { ...data, scheduleInterviewId: scheduleId };

    const res = await submitInterviewFeedbackAdd(formData);

    if (res) {
      enqueueSnackbar('Response Sucessfully Submitted');
    }
    refetchData();

    setFeedBackData(data);
  };

  const getChipColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return theme.palette.primary.main;
      case 'Recommended':
        return theme.palette.primary.light;
      case 'InNoticePeriod':
        return theme.palette.primary.light;
      case 'Hired':
        return theme.palette.success.main;
      case 'RenegedOffer':
        return theme.palette.error.main;
      case 'Approved':
        return theme.palette.success.dark;
      case 'Accepted':
        return theme.palette.success.darker;
      case 'OfferLetterSended':
        return theme.palette.info.main;
      case 'Cancelled':
        return theme.palette.warning.main;
      case 'CompanyCancelled':
        return theme.palette.warning.main;
      case 'CompanyCancelledReason':
        return theme.palette.warning.main;
      case 'OfferExpired':
        return theme.palette.warning.dark;
      case 'Deferred':
        return theme.palette.info.light;
      case 'Rejected':
        return theme.palette.error.main;
      case 'EvaluateInterview':
        return theme.palette.info.dark;
      case 'NotRecommended':
        return theme.palette.error.dark;
      case 'Pending':
        return theme.palette.grey[500];
      case 'OfferRejected':
        return theme.palette.error.dark;
      default:
        return theme.palette.error.main; // Fallback color
    }
  };

  const chipColor = getChipColor();
  const getLabel = (status) => {
    if (status === 'CompanyCancelled' || status === 'CompanyCancelledReason') {
      return 'Cancelled';
    }
    return status;
  };

  const TABLE_HEAD = [
    { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
    { field: 'jobTitle', headerName: 'Job Title', width: 200, flex: 1.2 },
    { field: 'maxSalary', headerName: 'Max Salary', width: 100 },
    { field: 'minSalary', headerName: 'Min Salary', width: 100 },
    { field: 'candidateName', headerName: 'Full Name', width: 200, flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200, flex: 1 },
    { field: 'scheduleTime', headerName: 'Schedule Time', width: 200, flex: 1.5 },
    {
      field: 'approvalStatus',
      headerName: 'Interview Status',
      width: 200,
      flex: 1.5,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '20px',
          }}
        >
          <Chip
            sx={{ height: 20, fontSize: 13 }}
            label={getLabel(params.row.approvalStatus)}
            style={{
              backgroundColor: getChipColor(params.row.approvalStatus),
              color: theme.palette.getContrastText(chipColor),
            }}
          />
          {(params.row.approvalStatus === 'CompanyCancelled' ||
            params.row.approvalStatus === 'CompanyCancelledReason') && (
            <Tooltip title="Reason for cancellation" placement="top" arrow>
              <IconButton
                onClick={() => handleClickOpen(params.row.reason)}
                size="small"
                style={{ marginLeft: '10px' }}
              >
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
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          )}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cancellation Reason</DialogTitle>
            <DialogContent>{reason}</DialogContent>
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

  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      <Helmet>Schedule Interview</Helmet>
      <CustomBreadcrumbs
        heading="Schedule Interview"
        links={[{ name: 'Dashboard' }, { name: 'Schedule Interview' }, { name: 'List' }]}
        sx={{
          mb: { xs: 3, md: 5, p: 2 },
        }}
      />
      <InterviewEvaluationForm
        open={formOpen}
        onClose={handleFeedbackClose}
        handleFeedbackSubmit={handleFeedbackSubmit}
      />
      {/* SCHEDULE INTERVIEW ADD COMPONENT */}
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
      {/* OFFER LETTER ADD COMPONENT */}
      <Card>
        {quickEditLetter.value && (
          <Add
            currentUser={isAddModeLetter ? null : selectedRowLetter}
            onClose={quickEditLetter.onFalse}
            open={quickEditLetter.value}
            onSubmitInsert={handleLetterFormSubmit}
            title={addTitleLetter}
            fields={letterFields}
            selectedObj={selectedRowLetter}
            onFieldChange={handleLetterDropdownChange}
            errorMessage={errorDetailsLetter}
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
                xs: '320%',
                sm: '100%',
              },
            },
          }}
        >
          <DataGrid
            rows={gridData.sort((a, b) => b.scheduleTime - a.scheduleTime)}
            disableRowSelectionOnClick
            onRowClick={(params, event) => event.stopPropagation()}
            columns={[
              ...TABLE_HEAD,
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                orderable: false,
                flex: 1.3,

                renderCell: (params) => (
                  <div>
                    {params.row.userType !== 'ci' &&
                    params.row.userType !== 'Candidate_interview_Performance' &&
                    params.row.userType !== 'Candidate_interview' &&
                    params.row.userType !== 'interview_performance' ? (
                      <div>
                        {params.row.approvalStatus == 'Recommended' && (
                          <Tooltip title="Send Offer Letter" placement="top" arrow>
                            <IconButton onClick={() => handleLetterAddClick(params.row)}>
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5.027 10.9a8.729 8.729 0 0 1 6.422-3.62v-1.2A2.061 2.061 0 0 1 12.61 4.2a1.986 1.986 0 0 1 2.104.23l5.491 4.308a2.11 2.11 0 0 1 .588 2.566 2.109 2.109 0 0 1-.588.734l-5.489 4.308a1.983 1.983 0 0 1-2.104.228 2.065 2.065 0 0 1-1.16-1.876v-.942c-5.33 1.284-6.212 5.251-6.25 5.441a1 1 0 0 1-.923.806h-.06a1.003 1.003 0 0 1-.955-.7A10.221 10.221 0 0 1 5.027 10.9Z" />
                              </svg>
                            </IconButton>
                          </Tooltip>
                        )}

                        {params.row.approvalStatus == 'OfferLetterSended' && (
                          <Tooltip title="Edit offer Letter" placement="top" arrow>
                            <IconButton onClick={() => handleLetterEditClick(params.row)}>
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5.027 10.9a8.729 8.729 0 0 1 6.422-3.62v-1.2A2.061 2.061 0 0 1 12.61 4.2a1.986 1.986 0 0 1 2.104.23l5.491 4.308a2.11 2.11 0 0 1 .588 2.566 2.109 2.109 0 0 1-.588.734l-5.489 4.308a1.983 1.983 0 0 1-2.104.228 2.065 2.065 0 0 1-1.16-1.876v-.942c-5.33 1.284-6.212 5.251-6.25 5.441a1 1 0 0 1-.923.806h-.06a1.003 1.003 0 0 1-.955-.7A10.221 10.221 0 0 1 5.027 10.9Z" />
                              </svg>
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Download Resume" placement="top" arrow>
                          <IconButton onClick={() => DownloadResume(params.row.candidateId)}>
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
                        <Tooltip title="Cancel Interview" placement="top" arrow>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setConfirmDialogOpen(true);
                              setSelectedRow(params.row);
                            }}
                            disabled={
                              params.row.approvalStatus !== 'Accepted' &&
                              params.row.approvalStatus !== 'Scheduled'
                            }
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
                      </div>
                    ) : (
                      params.row.approvalStatus != 'Scheduled' && (
                        <Tooltip title="Evaluate Interview Form" placement="top" arrow>
                          <IconButton
                            onClick={() => handleOpen(params.row.scheduleInterviewId)}
                            disabled={params.row.approvalStatus === 'Accepted'}
                          >
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
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"
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
