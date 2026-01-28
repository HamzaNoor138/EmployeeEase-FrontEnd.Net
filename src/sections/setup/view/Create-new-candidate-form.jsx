import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import FileUploadWithoutModal from 'src/sections/file-manager/file-upload-without-modal';
import { LinearProgress, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useGetAllProfessions, useAddOne, useUpdateOne } from 'src/api/profession';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetAllSkills } from 'src/api/skill';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { useGetAlleducation } from 'src/api/education';
import { useGetAllCity } from 'src/api/addCity';
import { enqueueSnackbar } from 'src/components/snackbar';
import { useGetAllDesignations } from 'src/api/designation';
import { useGetAllState } from 'src/api/addState';
import { useGetAllCountry } from 'src/api/addCountry';
import { TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { PATH_AFTER_REGISTER } from 'src/config-global';
import { useSettingsContext } from 'src/components/settings';
import PropTypes from 'prop-types';

const schema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  cnic: Yup.string().required('CNIC is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  profession: Yup.string().required('Profession is required'),
  designation: Yup.string().required('Designation is required'),
  experience: Yup.string().required('experience is required'),
  education: Yup.string().required('Education is required'),
  skills: Yup.array().required('Skills is required'),
});

export default function CandidateNewEditForm({ currentUser }) {
  const router = useRouter();
  const [resume, setResume] = useState();
  const { countryList } = useGetAllCountry();
  const { stateList } = useGetAllState();
  const { designationList } = useGetAllDesignations();
  const { educationList } = useGetAlleducation();
  const { professionList } = useGetAllProfessions();
  const { skillList } = useGetAllSkills();
  const { cityList } = useGetAllCity();
  const settings = useSettingsContext();
  const [showProgress, setShowProgress] = useState(false);
  const upload = useBoolean();
  const [defaultValue, setDefaultValue] = useState([]);
  const [filiterdStates, setFiliterdStates] = useState([]);
  const [filiterdCities, setFiliterdCities] = useState([]);
  const [resumeInterval, setResumeInterval] = useState();
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [filiterdDesignation, setFiliterdDesignation] = useState([]);
  const [filterEducation, setFilterEducation] = useState([]);
  const [parsedCountryValue, setParsedCountryValue] = useState([]);
  const [parsedProfessionValue, setParsedProfessionValue] = useState([]);
  const [defaultStateValue, setDefaultStateValue] = useState([]);
  const [defaultCityValue, setDefaultCityValue] = useState([]);
  const [defaultDesgination, setDefaultDesgination] = useState([]);
  const [defaultEducation, setDefaultEducation] = useState([]);
  const [dbResponse, setDbResponse] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const plusTimer = () => {
    const ResumeProcess = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 10);
    }, 4000);
    return ResumeProcess;
  };

  const handleNext = () => {
    setShowProgress(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === 1) {
      setIsFinished(false);
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setMsg('');
  };
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    cnic: currentUser?.Cnic || '',
    resume: resume,
    phoneNumber: currentUser?.phoneNumber || '',
    experience: null,
    countryId: null,
    professionId: null,
    stateId: null,
    designationId: null,
    educationId: null,
    gitHubUrl: null,
    linkedInUrl: null,
    skills: '',
    email: sessionStorage.getItem('email'),
    status: 'notHired',
  });

  useEffect(() => {
    console.log('parsed data', parsedData);
  }, [parsedData]);

  useEffect(() => {
    console.log('formdata from useeeffect', formData);
  }, [formData]);

  useEffect(() => {
    console.log(showProgress);
  }, [activeStep]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      skills: defaultValue.map((skill) => skill.key).join(','),
    }));
  }, [defaultValue]);

  const [msg, setMsg] = useState('');

  const handleUploads = async (files) => {
    const num = 5;
    setMsg('');

    if (files.length === 0) {
      enqueueSnackbar('Please Select a Resume', {
        variant: 'warning',
        style: { backgroundColor: 'white', color: 'red' },
      });
      return;
    }

    // Extract the file extension
    const validExtensions = ['pdf', 'docx'];
    const file = files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      enqueueSnackbar('Unsupported File Type. Please upload a PDF or DOCX file.', {
        variant: 'error',
        style: { backgroundColor: 'white', color: 'red' },
      });
      return;
    }

    const resumeIntervalCode = plusTimer();

    setResume(files);
    setFormData((prevData) => ({
      ...prevData,
      resume: files,
    }));

    const headers = {
      Authorization: 'Token 1170d29c9b509d0410612f8d130531c7',
    };

    const formData = new FormData();
    formData.append('resume', file);
    console.log(formData.get('resume'));

    try {
      setProgress(0);
      setShowProgress(true);
      const response = await fetch('http://localhost:5161/api/Mindee/processResume', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.status === 400) {
        setShowProgress(false);
        setProgress(0);
        clearInterval(resumeIntervalCode);
        enqueueSnackbar('Unsupported Document', {
          variant: 'warning',
          style: { backgroundColor: 'white', color: 'red' },
        });
        return responseData;
      }

      console.log(responseData);
      const jobId = responseData.documentId;

      setTimeout(async () => {
        const getResponse = await fetch(`http://localhost:5161/api/Mindee/document/${jobId}`, {
          headers,
        });
        const responseData = await getResponse.json();

        setParsedData(responseData); // Update the parsedData state variable
        setProgress(100);
        clearInterval(resumeIntervalCode);

        setMsg('RESUME HAS BEEN PARSED SUCCESSFULLY !!!');
      }, 10000);

      return response;
    } catch (error) {
      console.error('Error uploading the resume:', error);
      enqueueSnackbar('An error occurred while processing the file.', {
        variant: 'error',
        style: { backgroundColor: 'white', color: 'red' },
      });
    }
  };

  const formatCNIC = (input) => {
    // Remove all non-digits
    const numbers = input.replace(/[^\d]/g, '');

    // Limit to 13 digits
    const limited = numbers.slice(0, 13);

    // Add dashes after 5th and 12th digits
    let formatted = limited;
    if (limited.length > 5) {
      formatted = `${limited.slice(0, 5)}-${limited.slice(5)}`;
    }
    if (limited.length > 12) {
      formatted = `${formatted.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12)}`;
    }

    return formatted;
  };

  const handleChange = (name) => (event) => {
    let newValue = event.target.value;

    // Apply CNIC formatting only for the cnic field
    if (name === 'cnic') {
      newValue = formatCNIC(newValue);
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const [selectedOptions, setSelectedOptions] = useState('');
  const handleFieldChange = (value) => {
    if (value.length === 0) {
      setDefaultValue([]); // update default value state
    }
    if (value) {
      setDefaultValue((previousDefault) => [
        ...previousDefault,
        { key: value[0].key, value: value[0].value },
      ]);
    }
  };

  const handleFieldRemoveChange = (value) => {
    if (value.length === 0) {
      setDefaultValue([]); // update default value state
    }
    if (value) {
      setDefaultValue((previousDefault) =>
        previousDefault.filter((defaultValue) => defaultValue.key !== value.key)
      );
    }
  };

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    reset,
    resetField,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (parsedData) {
      const hardSkills = parsedData?.document?.inference?.prediction?.hard_skills;
      setDefaultValue(
        hardSkills.map((skill, index) => ({
          key: skill.key,
          value: skill.value,
        }))
      );
      if (hardSkills) {
        setValue('skills', []);
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        skills: parsedData?.document?.inference?.prediction?.hard_skills
          .map((skill) => skill.key)
          .join(','),
      }));

      const nationality =
        (parsedData?.document?.inference?.prediction?.nationality['value'] &&
          parsedData?.document?.inference?.prediction?.nationality['value']) ||
        null;
      const matchingCountry = countryList.find((country) => country.code === nationality);
      if (matchingCountry) {
        setValue('country', matchingCountry.fullName);
        const filterState = stateList.filter(
          (state) => state.countryId == matchingCountry.countryId
        );
        setFiliterdStates(filterState);
        setParsedCountryValue(matchingCountry);

        setFormData((prevFormData) => ({
          ...prevFormData,
          countryId: matchingCountry.countryId,
        }));
      }

      const professions = parsedData?.document?.inference?.prediction?.profession['value'];
      const matchingProfession = professionList.find(
        (profession) => profession.fullName === professions
      );

      if (matchingProfession) {
        setValue('profession', matchingProfession.fullName);
        setParsedProfessionValue(matchingProfession);
        setFormData((prevFormData) => ({
          ...prevFormData,
          professionId: matchingProfession.professionId,
        }));

        const filteredDesignations = professionList
          .filter((profession) => profession.professionId == matchingProfession.professionId)
          .map((profession) => profession.designationIds.split(','))
          .flat()
          .map((id) => designationList.find((designation) => designation.designationId == id));

        setFiliterdDesignation(filteredDesignations);

        const filteredEducations = professionList
          .filter((profession) => profession.professionId == matchingProfession.professionId)
          .map((profession) => profession.educationIds.split(','))
          .flat()
          .map((id) => educationList.find((education) => education.educationId == id));

        setFilterEducation(filteredEducations);
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        phoneNumber:
          (parsedData?.document?.inference?.prediction?.phone_number[0] &&
            parsedData?.document?.inference?.prediction?.phone_number['value'].replace(
              /\D+/g,
              ''
            )) ||
          null,
        name:
          (parsedData?.document?.inference?.prediction?.given_names[0] &&
            parsedData?.document?.inference?.prediction?.given_names[0]['value']) ||
          null,

        surname:
          (parsedData?.document?.inference?.prediction?.surnames[0] &&
            parsedData?.document?.inference?.prediction?.surnames[0]['value']) ||
          (parsedData?.document?.inference?.prediction?.given_names[1] &&
            parsedData?.document?.inference?.prediction?.given_names[1]['value']) ||
          null,

        email: sessionStorage.getItem('email'),

        linkedInUrl:
          parsedData.document?.inference?.prediction?.social_networks_urls.find(
            (social) => social.name == 'LinkedIn'
          )?.url || '',
        gitHubUrl:
          parsedData?.document?.inference?.prediction?.social_networks_urls.find(
            (social) => social.name == 'GitHub'
          )?.url || '',
      }));
    }
  }, [parsedData]);

  const SkillField = {
    name: 'Skills',
    label: 'Skills',
    disabled: false,
    options: skillList
      .filter((option) => {
        const defaultValueKeys = defaultValue.map((defaultOpt) => defaultOpt.key);
        return !defaultValueKeys.includes(option.skillId);
      })
      .map((skill) => ({
        key: skill.skillId,
        value: skill.fullName,
      })),
    defaultValue,
  };

  const handleCountryChange = (newValue, dropdownName) => {
    console.log(countryList);
    console.log(stateList);
    console.log(dropdownName);

    if (dropdownName == 'countrySelector') {
      if (newValue) {
        const filterState = stateList.filter((state) => state.countryId == newValue.countryId);
        setFiliterdStates(filterState);
        setFormData((prevFormData) => ({
          ...prevFormData,
          countryId: newValue.countryId,
          stateId: '',
        }));
        setParsedCountryValue(newValue);
        setDefaultCityValue([]);
        setDefaultStateValue([]);
        setFiliterdCities([]);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          countryId: '',
        }));
        setParsedCountryValue(null); // Add this line
      }
    } else if (dropdownName == 'StateSelector') {
      if (newValue) {
        const filterCity = cityList.filter((city) => city.stateId == newValue.stateId);
        setFiliterdCities(filterCity);
        setFormData((prevFormData) => ({
          ...prevFormData,
          stateId: newValue.stateId,
        }));

        setDefaultCityValue([]);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          stateId: '',
        }));
      }
    } else if (dropdownName == 'CitySelector') {
      if (newValue) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          cityId: newValue.cityId,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          cityId: '',
        }));
      }
    } else if (dropdownName == 'ProfessionSelector') {
      if (newValue) {
        const filteredDesignations = professionList
          .filter((profession) => profession.professionId == newValue.professionId)
          .map((profession) => profession.designationIds.split(','))
          .flat()
          .map((id) => designationList.find((designation) => designation.designationId == id));

        setFiliterdDesignation(filteredDesignations);
        setParsedProfessionValue(newValue);

        const filteredEducations = professionList
          .filter((profession) => profession.professionId == newValue.professionId)
          .map((profession) => profession.educationIds.split(','))
          .flat()
          .map((id) => educationList.find((education) => education.educationId == id));

        setFilterEducation(filteredEducations);

        setFormData((prevFormData) => ({
          ...prevFormData,
          professionId: newValue.professionId,
        }));

        setDefaultDesgination([]);
        setDefaultEducation([]);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          professionId: '',
        }));

        setParsedProfessionValue(null); // Add this line
      }
    } else if (dropdownName == 'DesginationSelector') {
      if (newValue) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          designationId: newValue.designationId,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          designationId: '',
        }));
      }
    } else if (dropdownName == 'experience') {
      if (newValue) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          experience: newValue.value,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          experience: '',
        }));
      }
    } else if (dropdownName == 'EducationSelector') {
      if (newValue) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          educationId: newValue.educationId,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          educationId: '',
        }));
      }
    }

    console.log(formData);
  };
  const [isFinished, setIsFinished] = useState(false);

  const LinearProgressWithLabel = (props) => {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress sx={{ height: '10px' }} variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  };

  const validateCNIC = (cnic) => {
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    return cnicRegex.test(cnic);
  };

  const submitForm = async () => {
    console.log('data');
    if (formData.countryId == null) {
      setError('country');
    }

    // CNIC format validation
    if (!validateCNIC(formData.cnic)) {
      enqueueSnackbar('Please enter a valid CNIC in format: XXXXX-XXXXXXX-X', {
        variant: 'error',
        style: { backgroundColor: 'red', color: 'white' },
      });
      setError('cnic');
      hasError = true;
    }

    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== 'resume') {
        // Skip the resume key
        formDataObject.append(key, formData[key]);
      }
    });

    // Add the resume separately
    formDataObject.append('resume', formData.resume[0]);
    formDataObject.append(
      'educationInstitute',
      parsedData.document.inference.prediction.education[0]['school']
    );

    formDataObject.append('username', sessionStorage.getItem('username'));
    const response = await fetch('http://localhost:5161/api/Candidate/add', {
      method: 'POST',
      body: formDataObject,
    });

    const responseData = await response.json();

    if (responseData.message == 'cnic' && responseData.code == 409) {
      enqueueSnackbar('A candidate with the same CNIC already exists.', {
        variant: 'error',

        style: { backgroundColor: 'red', color: 'white' },
      });

      setError(responseData.message);
    } else if (responseData.message == 'email' && responseData.code == 409) {
      enqueueSnackbar('A candidate with the same Email already exists.', {
        variant: 'error',

        style: { backgroundColor: 'red', color: 'white' },
      });
      setError(responseData.message);
    }
    if (responseData.message == 'phoneNumber' && responseData.code == 409) {
      enqueueSnackbar('A candidate with the same Phone Number already exists.', {
        variant: 'error',

        style: { backgroundColor: 'red', color: 'white' },
      });

      setError(responseData.message);
    }

    if (responseData.code == 200) {
      enqueueSnackbar('Candidate Has SuccessFully Applied', {
        variant: 'success',

        style: { backgroundColor: 'white', color: 'black' },
      });
      setDbResponse(true);
      setError(responseData.message);
      router.push(PATH_AFTER_REGISTER);
      sessionStorage.setItem('userType', 'ca');
    } else if (responseData.code == 500) {
      enqueueSnackbar(responseData.message, {
        variant: 'error',

        style: { backgroundColor: 'red', color: 'white' },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Register for Jobs"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'User',
              href: paths.dashboard.user.root,
            },
            { name: 'New user' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Paper>
                <Grid container direction="row">
                  <Stepper sx={{ width: '1000px' }} activeStep={activeStep} alternativeLabel>
                    <Step key="Step 1">
                      <StepLabel>Step 1</StepLabel>
                    </Step>
                    <Step key="Step 2">
                      <StepLabel>Step 2</StepLabel>
                    </Step>
                  </Stepper>
                </Grid>
                {!dbResponse && (
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}
                  >
                    {activeStep === 0 ? (
                      <Grid item xs={8}>
                        {!showProgress && (
                          <>
                            <FileUploadWithoutModal
                              open={upload.value}
                              onClose={upload.onFalse}
                              onUpload={handleUploads}
                              title="Upload Resume"
                              UploadButtonName="Upload Resume and Parse"
                              multiple={false}
                              heading="Drop or Select your Resume (.pdf or docx)"
                            />

                            <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>
                              {msg}
                            </Typography>
                          </>
                        )}

                        {showProgress && (
                          <>
                            <Box sx={{ mt: 5 }}>
                              <LinearProgressWithLabel value={progress} />
                              <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Parsing Resume
                              </Typography>
                            </Box>
                            <Typography sx={{ color: 'Green', textAlign: 'center', mt: 2 }}>
                              {msg}
                            </Typography>
                          </>
                        )}
                      </Grid>
                    ) : (
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box
                            sx={{
                              width: '600px',
                              height: 'auto',
                              p: 4,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                            rowGap={3}
                            columnGap={2}
                            gridTemplateColumns={{
                              xs: 'repeat(1, 1fr)',
                              sm: 'repeat(2, 1fr)',
                            }}
                          >
                            <TextField
                              label="First Name"
                              {...register('name')}
                              error={!!errors.name}
                              helperText={errors.name?.message}
                              value={formData.name || ''}
                              onChange={(event) => {
                                handleChange('name')(event);
                                clearErrors('name');
                              }}
                            />
                            <TextField
                              name="surname"
                              label="Surname"
                              {...register('surname')}
                              error={!!errors.surname}
                              helperText={errors.surname?.message}
                              value={formData.surname}
                              onChange={(event) => {
                                handleChange('surname')(event);
                                clearErrors('surname');
                              }}
                            />
                            <TextField
                              name="cnic"
                              label="Cnic"
                              {...register('cnic')}
                              error={!!errors.cnic}
                              helperText={errors.cnic?.message}
                              value={formData.cnic}
                              onChange={(event) => {
                                handleChange('cnic')(event);
                                clearErrors('cnic');
                              }}
                              inputProps={{
                                maxLength: 15, // To accommodate format XXXXX-XXXXXXX-X
                                placeholder: 'XXXXX-XXXXXXX-X',
                              }}
                            />
                            <TextField
                              name="linkedInUrl"
                              label="LinkdedIn Url"
                              value={formData.linkedInUrl || ''}
                              onChange={(event) => {
                                handleChange('linkedInUrl')(event);
                              }}
                            />

                            <TextField
                              name="gitHubUrl"
                              label="Git Hub Url"
                              value={formData.gitHubUrl || ''}
                              onChange={(event) => {
                                handleChange('gitHubUrl')(event);
                              }}
                            />

                            <Controller
                              name="experience"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={[
                                    { label: 'Fresh Graduate', value: 'freshGraduate' },
                                    ...Array(11)
                                      .fill()
                                      .map((_, i) => ({
                                        label: `${i} year${i > 1 ? 's' : ''}`,
                                        value: `${i}${i > 1 ? '' : ''}`,
                                      })),
                                  ]}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setValue('experience', newValue.label); // Update the form value for 'country'
                                      clearErrors('experience'); // Clear validation error for 'country'
                                    }
                                    handleCountryChange(newValue, 'experience');
                                  }}
                                  getOptionLabel={(option) => option.label}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.value}>
                                      {option.label}
                                    </li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Experience"
                                      variant="outlined"
                                      name="experience"
                                      error={!!errors.experience}
                                      helperText={errors.experience?.message}
                                    />
                                  )}
                                />
                              )}
                            />
                            <TextField
                              name="phoneNumber"
                              label="Phone Number"
                              {...register('phoneNumber')}
                              error={!!errors.phoneNumber}
                              helperText={errors.phoneNumber?.message}
                              value={formData.phoneNumber}
                              onChange={(event) => {
                                handleChange('phoneNumber')(event);
                                clearErrors('phoneNumber');
                              }}
                            />

                            <TextField
                              name="email"
                              disabled={true}
                              label="Email"
                              value={formData.email}
                              onChange={(event) => {
                                handleChange('email')(event);
                              }}
                            />
                            <Controller
                              name="country"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={countryList}
                                  {...register('country')}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.countryId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  value={parsedCountryValue}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setValue('country', newValue.fullName); // Update the form value for 'country'
                                      clearErrors('country'); // Clear validation error for 'country'
                                    }
                                    handleCountryChange(newValue, 'countrySelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Country"
                                      variant="outlined"
                                      name="country"
                                      error={!!errors.country}
                                      helperText={errors.country?.message}
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name="state"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  {...register('state')}
                                  options={filiterdStates}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.stateId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  value={defaultStateValue}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setDefaultStateValue(newValue);
                                      setValue('state', newValue.fullName);

                                      clearErrors('state');
                                    }
                                    handleCountryChange(newValue, 'StateSelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select State"
                                      variant="outlined"
                                      name="state"
                                      error={!!errors.state}
                                      helperText={errors.state?.message}
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name="city"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  {...register('city')}
                                  options={filiterdCities}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.cityId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  value={defaultCityValue}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setDefaultCityValue(newValue);
                                      setValue('city', newValue.fullName);

                                      clearErrors('city');
                                    }
                                    handleCountryChange(newValue, 'CitySelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select City"
                                      variant="outlined"
                                      name="city"
                                      error={!!errors.city}
                                      helperText={errors.city?.message}
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name="profession"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={professionList}
                                  {...register('profession')}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.professionId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  value={parsedProfessionValue}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setValue('profession', newValue.fullName);

                                      clearErrors('profession');
                                    }
                                    handleCountryChange(newValue, 'ProfessionSelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Profession"
                                      variant="outlined"
                                      name="profession"
                                      error={!!errors.profession}
                                      helperText={errors.profession?.message}
                                      onChange={(event, newValue) =>
                                        handleCountryChange(
                                          event,
                                          newValue,
                                          params,
                                          'ProfessionSelector'
                                        )
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name="designation"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  {...register('designation')}
                                  options={filiterdDesignation}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.designationId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  value={defaultDesgination}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setDefaultDesgination(newValue);
                                      setValue('designation', newValue.fullName);

                                      clearErrors('designation');
                                    }
                                    handleCountryChange(newValue, 'DesginationSelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Designation"
                                      variant="outlined"
                                      name="designation"
                                      error={!!errors.designation}
                                      helperText={errors.designation?.message}
                                    />
                                  )}
                                />
                              )}
                            />

                            <Controller
                              name="education"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  {...register('education')}
                                  options={filterEducation}
                                  value={defaultEducation}
                                  getOptionLabel={(option) => option.fullName || ''}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.educationId}>
                                      {option.fullName}
                                    </li>
                                  )}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      setDefaultEducation(newValue);
                                      setValue('education', newValue.fullName);

                                      clearErrors('education');
                                    }
                                    handleCountryChange(newValue, 'EducationSelector');
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select Education"
                                      variant="outlined"
                                      name="education"
                                      error={!!errors.education}
                                      helperText={errors.education?.message}
                                    />
                                  )}
                                />
                              )}
                            />
                            <Controller
                              name="skills"
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  {...register('skills')}
                                  multiple
                                  required
                                  name="skills"
                                  label="Skills"
                                  value={defaultValue}
                                  options={SkillField.options}
                                  onChange={(event, value) => {
                                    clearErrors('skills');
                                    setValue('skills', []);
                                    if (value.length == 0) {
                                      resetField('skills');
                                    }

                                    if (value.length < defaultValue.length) {
                                      const removedValue = defaultValue.find(
                                        (defaultValue) => !value.includes(defaultValue)
                                      );
                                      handleFieldRemoveChange(removedValue);
                                    } else {
                                      const selectedValues = value.filter(
                                        (value) => !defaultValue.includes(value)
                                      );
                                      handleFieldChange(selectedValues);
                                    }
                                  }}
                                  getOptionLabel={(option) => option.value}
                                  renderOption={(props, option) => (
                                    <li {...props}>{option.value}</li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      value={selectedOptions}
                                      label={SkillField.label}
                                      error={!!errors.skills}
                                      helperText={errors.skills ? 'Skills is required' : ''}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                )}
                {dbResponse && (
                  <Typography
                    sx={{ color: 'green', fontSize: '24px', textAlign: 'center', mt: 10, mb: 10 }}
                  >
                    Candidate Has been Successfully Applied
                  </Typography>
                )}

                {!dbResponse && (
                  <Grid container spacing={2} justify="space-between" sx={{ width: '100%' }}>
                    <Grid item md={6}>
                      <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                      </Button>
                    </Grid>
                    <Grid item md={6} sx={{ textAlign: 'right' }}>
                      {activeStep == 1 && (
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{
                            opacity: isFinished ? 0.5 : 1, // Dim the button if isFinished is true
                          }}
                        >
                          Finish
                        </Button>
                      )}
                      {activeStep == 0 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          disabled={isFinished || !resume || !parsedData} // Disable the button if isFinished is true
                          sx={{
                            opacity: isFinished ? 0.5 : 1, // Dim the button if isFinished is true
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
}

CandidateNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
