import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  styled,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
styled;
import {
  useGetAllJobDescriptions,
  useAddOne,
  useUpdateOne,
  useFilterCandidates,
} from 'src/api/jobDescription';
import { useAddScheduleInterviewOne } from 'src/api/companyScheduleInterview';
import { useDownloadResume } from 'src/api/candidate';
import { useGetAllDesignations } from 'src/api/designation';
import { useGetAllState } from 'src/api/addState';
import { useGetAllCountry } from 'src/api/addCountry';
import { useGetAlleducation } from 'src/api/education';
import { useGetAllCity } from 'src/api/addCity';
import { useGetAllProfessions } from 'src/api/profession';
import { useGetAllSkills } from 'src/api/skill';
import Iconify from 'src/components/iconify';

import Badge from '@mui/material/Badge';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Add from './add';
import Spinner from '../../../components/loading-screen/spinner';
import { width } from '@mui/system';

const TABLE_HEAD = [
  { field: 'id', headerName: 'Sr. #', width: 70, flex: 0.25 },
  { field: 'jobTitle', headerName: 'Job title', width: 210, flex: 1 },
  { field: 'code', headerName: ' Job Code', width: 150, flex: 1 },
  { field: 'maxSalary', headerName: 'Max Salary', width: 200, flex: 1 },
  { field: 'minSalary', headerName: 'Min Salary', width: 200, flex: 1 },

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

export default function JobDescriptionView() {
  const { countryList } = useGetAllCountry();
  const { stateList } = useGetAllState();
  const { designationList } = useGetAllDesignations();
  const { educationList } = useGetAlleducation();
  const { professionList } = useGetAllProfessions();
  const { skillList } = useGetAllSkills();
  const { jobDescriptonList, refetchData } = useGetAllJobDescriptions();
  const { FilterCandidate } = useFilterCandidates();
  const { submitScheduleInterviewAdd } = useAddScheduleInterviewOne();
  const { submitFormAdd } = useAddOne();
  const { cityList } = useGetAllCity();

  const [filteredState, setFilteredState] = useState([]);
  const [filteredCity, setFilteredCity] = useState([]);
  const [filteredDesgination, setFilteredDesgination] = useState([]);
  const [filteredEducation, setFilteredEducation] = useState([]);
  const { DownloadResume } = useDownloadResume();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [tableData, setTableData] = useState([]);
  const quickEdit = useBoolean();
  const [job, setJob] = useState([]);
  const { submitFormUpdate } = useUpdateOne();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [dummyDefaultValue, setDummyDefaultValue] = useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);

  const [dummyMultiselectObj2, setDummyMultiselectObj2] = useState([]);
  const [dummyDefaultValue2, setDummyDefaultValue2] = useState([]);

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

  useEffect(() => {
    const options = [
      { key: 'freshGraduate', value: 'Fresh Graduate' },
      ...Array(11)
        .fill()
        .map((_, i) => ({
          key: `${i}`,
          value: `${i} year${i > 1 ? 's' : ''}`,
        })),
    ];

    const mappedOptions = options.map((option) => ({
      key: option.key,
      value: option.value,
    }));

    setDummyMultiselectObj2(mappedOptions);
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fields = [
    {
      name: 'jobTitle',
      label: 'Job Title',
      multiline: true,
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },

    {
      name: 'code',
      label: 'Job Code',

      mandatory: true,
      type: 'text',
      maxLength: 20,
    },

    {
      name: 'minSalary',
      label: 'Min Salary',
      mandatory: true,
      type: 'number',
    },

    {
      name: 'maxSalary',
      label: 'Max Salary',
      mandatory: true,
      type: 'number',
    },

    {
      name: 'experience',
      label: 'Experience',
      mandatory: true,
      type: 'multiselect',
      options: dummyMultiselectObj2,
      defaultValue: dummyDefaultValue2,
    },

    {
      name: 'countryId',
      label: 'Country',
      mandatory: true,
      type: 'dropdown',
      options: countryList.map((country) => ({
        key: country.countryId,
        value: country.fullName,
      })),
    },

    {
      name: 'stateId',
      label: 'State',
      mandatory: true,
      type: 'dropdown',
      options: filteredState.map((state) => ({
        key: state.key,
        value: state.value,
      })),
    },
    {
      name: 'cityId',
      label: 'City',
      mandatory: true,
      type: 'dropdown',
      options: filteredCity.map((city) => ({
        key: city.key,
        value: city.value,
      })),
    },
    {
      name: 'professionId',
      label: 'Profession',
      mandatory: true,
      type: 'dropdown',
      options: professionList.map((profession) => ({
        key: profession.professionId,
        value: profession.fullName,
      })),
    },
    {
      name: 'designationId',
      label: 'Designation',
      mandatory: true,
      type: 'dropdown',
      options: filteredDesgination.map((designation) => ({
        key: designation.key,
        value: designation.value,
      })),
    },
    {
      name: 'educationId',
      label: 'Education',
      mandatory: true,
      type: 'dropdown',
      options: filteredEducation.map((education) => ({
        key: education.key,
        value: education.value,
      })),
    },
    {
      name: 'skills',
      label: 'Skills',
      mandatory: true,
      type: 'multiselect',
      options: dummyMultiselectObj,
      defaultValue: dummyDefaultValue,
    },
    // {
    //   name: 'stateIds',
    //   label: 'states',
    //   mandatory: false,
    //   type: 'multiselect',
    //   options: dummyMultiselectObj,
    //   defaultValue: dummyDefaultValue,
    // },
    {
      name: 'jobDescription',
      label: 'Job Description',
      mandatory: true,
      multiline: true,
      type: 'text',
    },
    { name: 'statusId', label: 'Status', mandatory: false, type: 'switch' },
  ];

  const handleDropdownChange = (event, data) => {
    console.log('data on page', data);

    if (event.target.name === 'countryId') {
      if (stateList !== undefined && stateList.length) {
        const newState = stateList
          .filter((item) => item.countryId === event.target.value)
          .map((state) => ({
            key: state.stateId,
            value: state.fullName.trim(),
          }));

        setFilteredState(newState);

        const updatedData = {
          jobDescriptionId: data?.jobDescriptionId,
          jobTitle: data?.jobTitle.trim() || '',
          jobDescription: data?.jobDescription.trim() || '',
          minSalary: data?.minSalary || 0,
          maxSalary: data?.maxSalary || 0,
          code: data?.code,
          experience: data?.experience,
          countryId: event.target.value,
          skills: data?.skills,
          professionId: data?.professionId,
          designationId: data?.designationId,
          educationId: data?.educationId,

          statusId: data?.statusId || 0,
        };
        setSelectedRow(updatedData);
      }
    } else if (event.target.name === 'stateId') {
      if (cityList !== undefined && cityList.length) {
        const newcity = cityList
          .filter((item) => item.stateId === event.target.value)
          .map((city) => ({
            key: city.cityId,
            value: city.fullName.trim(),
          }));
        setFilteredCity(newcity);
      }

      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle.trim() || '',
        jobDescription: data?.jobDescription.trim() || '',
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        code: data?.code,
        countryId: data?.countryId,
        stateId: event.target.value,
        experience: data?.experience,
        professionId: data?.professionId,
        designationId: data?.designationId,
        skills: data?.skills,
        educationId: data?.educationId,
        statusId: data?.statusId || 0,
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'professionId') {
      if (
        designationList !== undefined &&
        designationList.length &&
        educationList !== undefined &&
        educationList.length
      ) {
        const selectedProfession = professionList.find(
          (profession) => profession.professionId === event.target.value
        );
        let newDesignations = [];
        let newEducations = [];

        if (selectedProfession) {
          if (selectedProfession.designationIds) {
            const designationIds = selectedProfession.designationIds.split(',');

            newDesignations = designationList
              .filter((item) => designationIds.includes(item.designationId))
              .map((designation) => ({
                key: designation.designationId,
                value: designation.fullName.trim(),
              }));
          }

          if (selectedProfession.educationIds) {
            const educationIds = selectedProfession.educationIds.split(',');

            newEducations = educationList
              .filter((item) => educationIds.includes(item.educationId))
              .map((education) => ({
                key: education.educationId,
                value: education.fullName.trim(),
              }));
          }
          setFilteredDesgination(newDesignations);
          setFilteredEducation(newEducations);
        }
      }

      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle.trim() || '',
        jobDescription: data?.jobDescription.trim() || '',
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        skills: data?.skills,
        countryId: data?.countryId,
        stateId: data?.stateId,
        code: data?.code || '',
        experience: data?.experience,
        cityId: data?.cityId,
        professionId: event.target.value,
        statusId: data?.statusId || 0,
      };

      setSelectedRow(updatedData);
    } else if (event.target.name === 'skills') {
      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle.trim() || '',
        jobDescription: data?.jobDescription.trim() || '',
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        code: data?.code,
        countryId: data?.countryId,
        stateId: data?.stateId,
        cityId: data?.cityId,
        experience: data?.experience,
        professionId: data?.professionId,
        designationId: data?.designationId,
        skills: event.target.value,
        educationId: data?.educationId,
        statusId: data?.statusId || 0,
      };

      setSelectedRow(updatedData);
      // setDummyDefaultValue(event.target.value);
      setMultiSelectValues(event.target.value, dummyMultiselectObj, setDummyDefaultValue);
    } else if (event.target.name === 'experience') {
      const updatedData = {
        jobDescriptionId: data?.jobDescriptionId,
        jobTitle: data?.jobTitle.trim() || '',
        jobDescription: data?.jobDescription.trim() || '',
        minSalary: data?.minSalary || 0,
        maxSalary: data?.maxSalary || 0,
        code: data?.code,
        countryId: data?.countryId,
        stateId: data?.stateId,
        cityId: data?.cityId,
        experience: event.target.value,
        professionId: data?.professionId,
        designationId: data?.designationId,
        skills: data?.skills,
        educationId: data?.educationId,
        statusId: data?.statusId || 0,
      };

      setSelectedRow(updatedData);
      // setDummyDefaultValue(event.target.value);
      setMultiSelectValues(event.target.value, dummyMultiselectObj2, setDummyDefaultValue2);
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
    if (cityList.length) {
      setTableData(cityList);
    }
  }, [cityList, tableData]);

  const handleAddClick = async () => {
    setTitle('Add Job Description');
    setErrors('');
    setSelectedRow(null);

    setIsAddMode(true);
    setMultiSelectValues('', dummyMultiselectObj, setDummyDefaultValue);
    setMultiSelectValues('', dummyMultiselectObj2, setDummyDefaultValue2);
    quickEdit.onTrue();
  };

  const handleEditClick = async (row) => {
    setErrors('');
    setTitle('Update Job Description');
    console.log('row is ', row);
    const newState = stateList
      .filter((item) => item.countryId === row.countryId)
      .map((state) => ({
        key: state.stateId,
        value: state.fullName.trim(),
      }));

    setFilteredState(newState);

    const newcity = cityList
      .filter((item) => item.stateId === row.stateId)
      .map((city) => ({
        key: city.cityId,
        value: city.fullName.trim(),
      }));
    console.log('cities are', newcity);

    setFilteredCity(newcity);

    const newDesignation = designationList
      .filter((item) => item.designationId === row.designationId)
      .map((designation) => ({
        key: designation.designationId,
        value: designation.fullName.trim(),
      }));

    setFilteredDesgination(newDesignation);

    const newEducation = educationList
      .filter((item) => item.educationId === row.educationId)
      .map((education) => ({
        key: education.educationId,
        value: education.fullName.trim(),
      }));

    setFilteredEducation(newEducation);

    setSelectedRow(row);
    setIsAddMode(false);
    setSpinner(true);
    setSpinner(false);
    setMultiSelectValues(row.skills, dummyMultiselectObj, setDummyDefaultValue);
    setMultiSelectValues(row.experience, dummyMultiselectObj2, setDummyDefaultValue2);
    quickEdit.onTrue();
  };

  const handleFormSubmit = async (data) => {
    const updatedData = {
      jobDescriptionId: data?.jobDescriptionId,
      jobTitle: data?.jobTitle.trim() || '',
      jobDescription: data?.jobDescription.trim() || '',
      minSalary: data?.minSalary || 0,
      maxSalary: data?.maxSalary || 0,
      code: data?.code,
      countryId: data?.countryId,
      username: sessionStorage.getItem('username'),
      experience: data?.experience.trim(),
      stateId: data?.stateId,
      cityId: data?.cityId,
      professionId: data?.professionId,
      designationId: data?.designationId,
      skills: data?.skills,
      educationId: data?.educationId,
      statusId: data?.statusId || 0,
    };

    let newErrorDetails = '';

    if (
      jobDescriptonList.some(
        (item) =>
          item.jobTitle.toLowerCase().trim() === data.jobTitle.toLowerCase().trim() &&
          item.jobDescriptionId !== data.jobDescriptionId
      )
    ) {
      newErrorDetails = 'Job Already Exists';
    } else if (
      jobDescriptonList.some(
        (item) =>
          item.code.toLowerCase().trim() === data.code.toLowerCase().trim() &&
          item.jobDescriptionId !== data.jobDescriptionId
      )
    ) {
      newErrorDetails = 'Job Code Already Exists';
    }

    if (data.minSalary > data.maxSalary) {
      newErrorDetails = 'Min Salary Cannot be Greater then Max Salary';
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

      if (response && response.code === '500' && response.message) {
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

  const gridData = jobDescriptonList.map((data, index) => ({
    id: index + 1,
    jobDescriptionId: data?.jobDescriptionId,
    jobTitle: data?.jobTitle.trim() || '',
    jobDescription: data?.jobDescription.trim() || '',
    minSalary: data?.minSalary || 0,
    maxSalary: data?.maxSalary || 0,
    code: data?.code,
    countryId: data?.countryId,
    experience: data?.experience?.trim(),
    username: sessionStorage.getItem('username'),
    stateId: data?.stateId,
    cityId: data?.cityId,
    professionId: data?.professionId,
    designationId: data?.designationId,
    skills: data?.skills,
    educationId: data?.educationId,
    statusId: data?.statusId || 0,
  }));

  const handleSeeCandidateClick = async (data) => {
    const response = await FilterCandidate(data);

    handleOpen();
    setJob(data);
    //  const rankedCandidates = rankCandidates(response.data);
    setFilteredData(response.data);
    console.log(response.data);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fullname', headerName: 'Full Name', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200 },
    { field: 'email', headerName: 'email', width: 200 },
    { field: 'cnic', headerName: 'Cnic', flex: 1 },
    { field: 'experience', headerName: 'Experience', flex: 1 },
    {
      field: 'resume',
      headerName: 'Resume',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDownloadResume(params.row.candidateId)}
        >
          Download Resume
        </Button>
      ),
    },
  ];

  const handleDownloadResume = async (candidateId) => {
    await DownloadResume(candidateId);
  };

  const handleScheduledInterview = async () => {
    const SchedualedInterview = {
      jobDescriptionId: job.jobDescriptionId,
      candidateIds: rowSelectionModel,
    };

    try {
      await submitScheduleInterviewAdd(SchedualedInterview);
      enqueueSnackbar('Candidates are Sucessfully Scheduled for Interview');

      setFilteredData((filteredData) =>
        filteredData.filter((candidate) => !rowSelectionModel.includes(candidate.candidateId))
      );

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log(rowSelectionModel);
  }, [rowSelectionModel]);

  function rankCandidates(candidates) {
    const PERFORMANCE_WEIGHT = 0.7;
    const EXPERIENCE_WEIGHT = 0.2;
    const FRESH_GRADUATE_BONUS = 0.55;
    const EXPERIENCED_NO_PERFORMANCE_PENALTY = 0.3;
    const FRESH_GRADUATE_EXPERIENCE = 0;

    // Clean and parse experience
    const cleanedCandidates = candidates.map((c) => ({
      ...c,
      experience:
        c.experience === 'freshGraduate'
          ? FRESH_GRADUATE_EXPERIENCE
          : parseFloat(c.experience.trim()) || 0,
    }));

    const maxExperience = Math.max(...cleanedCandidates.map((c) => c.experience));

    const scoredCandidates = cleanedCandidates.map((candidate) => {
      let score;
      const normalizedExperience = maxExperience > 0 ? candidate.experience / maxExperience : 0;

      if (candidate.averagePerformanceScore === 0) {
        if (candidate.experience === FRESH_GRADUATE_EXPERIENCE) {
          // Fresh graduates with no performance score
          score = FRESH_GRADUATE_BONUS;
        } else {
          // Experienced candidates with no performance score
          score = normalizedExperience * EXPERIENCE_WEIGHT + EXPERIENCED_NO_PERFORMANCE_PENALTY;
        }
      } else {
        // Candidates with performance score
        score =
          (candidate.averagePerformanceScore / 100) * PERFORMANCE_WEIGHT +
          normalizedExperience * EXPERIENCE_WEIGHT;
      }

      // Ensure score doesn't exceed 1
      score = Math.min(score, 1);

      return { ...candidate, score, calculatedRank: 0 };
    });

    const rankedCandidates = [...scoredCandidates].sort((a, b) => b.score - a.score);

    rankedCandidates.forEach((candidate, index) => {
      candidate.calculatedRank = index + 1;
    });

    console.log(rankedCandidates);

    return rankedCandidates;
  }

  return (
    <Box
      sx={{ padding: 2, height: '100%' }}
      className={`main-container ${loadingSpinner ? 'blur' : ''}`}
    >
      {loadingSpinner && <Spinner />}
      <Helmet>Job Description</Helmet>
      <CustomBreadcrumbs
        heading="Job Description"
        links={[{ name: 'Dashboard' }, { name: 'Job Description' }, { name: 'List' }]}
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
                minWidth: 200,
                flex: 1,
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
                    <Tooltip title="See Candidate" placement="top" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => handleSeeCandidateClick(params.row)}
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

          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'xl'}
            style={{ width: '100%', height: '100%' }}
          >
            <DialogTitle sx={{ display: 'flex', flexDirection: 'column' }}>
              {' '}
              <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>
                Candidates Avaiable for {job.jobTitle}
              </Typography>{' '}
              <Typography sx={{ color: 'red' }}>
                Candidates are ranked based on our Ranking algorithm
              </Typography>{' '}
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  checkboxSelection
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  rows={
                    filteredData?.length > 0
                      ? (() => {
                          const freshGraduateBoost = 5;

                          // Convert experience string to numerical value
                          const getExperienceValue = (experience) => {
                            if (experience === 'freshGraduate') return 0.5; // Slight edge for fresh graduates
                            return parseInt(experience, 10) || 0; // Convert string to integer
                          };

                          // Find the maximum experience in the list
                          const maxExperience = Math.max(
                            ...filteredData.map((candidate) =>
                              getExperienceValue(candidate.experience)
                            )
                          );

                          // Precompute composite scores for sorting
                          const candidatesWithScores = filteredData.map((candidate) => {
                            const experienceValue = getExperienceValue(candidate.experience);
                            const normalizedExperience = maxExperience
                              ? experienceValue / maxExperience
                              : 0;
                            const performanceScore = candidate.averagePerformanceScore || 0;

                            // Calculate composite score
                            const compositeScore =
                              (performanceScore + 1) * (normalizedExperience + 1) +
                              (candidate.experience === 'freshGraduate' ? freshGraduateBoost : 0);

                            // Attach score to candidate object for sorting
                            return {
                              ...candidate,
                              compositeScore,
                            };
                          });

                          // Sort based on precomputed composite scores
                          return candidatesWithScores.sort(
                            (a, b) => b.compositeScore - a.compositeScore
                          );
                        })()
                      : []
                  }
                  columns={columns}
                  getRowId={(row) => row.candidateId}
                />
              </div>
            </DialogContent>
            <DialogActions>
              {' '}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  ':hover': {
                    backgroundColor: 'black',
                  },
                }}
                onClick={handleScheduledInterview}
              >
                Que for Scheduled Interview
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
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
