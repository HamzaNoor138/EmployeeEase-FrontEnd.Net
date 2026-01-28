import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import { useBoolean } from 'src/hooks/use-boolean';
import CardHeader from '@mui/material/CardHeader';
import Add from '../add2';
import { useGetAllDesignations } from 'src/api/designation';
import { useGetAllState } from 'src/api/addState';
import { useGetAllCountry } from 'src/api/addCountry';
import { useGetAlleducation } from 'src/api/education';
import { useGetAllCity } from 'src/api/addCity';

import { useGetAllSkills } from 'src/api/skill';
import { fNumber } from 'src/utils/format-number';
import { useUpdateOne } from 'src/api/candidate';

import { _socials } from 'src/_mock';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { TextField, IconButton } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProfileHomeProp({
  currentTab,
  CandidateList,
  setCurrentTab,
  professionList,
}) {
  const fileRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { countryList } = useGetAllCountry();
  const { stateList } = useGetAllState();
  const { designationList } = useGetAllDesignations();
  const { educationList } = useGetAlleducation();
  const { skillList } = useGetAllSkills();
  const { cityList } = useGetAllCity();
  const { submitFormUpdate } = useUpdateOne();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingSpinner, setSpinner] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const [educationInstitute, setEducationInstitute] = useState(CandidateList[0].educationInstitute);

  const [about, setAbout] = useState(CandidateList[0].about);
  const [showbutton, setShowbutton] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [disableAllFields, setDisableAllFields] = useState(true);
  const quickEdit = useBoolean();
  const [dummyMultiselectObj, setDummyMultiselectObj] = useState([]);
  const [dummyDefaultValue, setDummyDefaultValue] = useState([]);
  const [filteredState, setFilteredState] = useState([]);
  const [filteredCity, setFilteredCity] = useState([]);
  const [filteredDesgination, setFilteredDesgination] = useState([]);
  const [filteredEducation, setFilteredEducation] = useState([]);
  const [links, setLinks] = useState({
    linkedin: CandidateList[0]?.linkedInUrl || '...',
    github: CandidateList[0]?.gitHubUrl || '',
  });

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  useEffect(() => {
    if (
      CandidateList.length > 0 &&
      stateList.length > 0 &&
      cityList.length > 0 &&
      designationList.length > 0 &&
      educationList.length > 0 &&
      skillList.length > 0
    ) {
      const newState = stateList
        .filter((item) => item.countryId === CandidateList[0].countryId)
        .map((state) => ({
          key: state.stateId,
          value: state.fullName.trim(),
        }));

      setFilteredState(newState);

      setMultiSelectValues(CandidateList[0].skills, dummyMultiselectObj, setDummyDefaultValue);

      const newcity = cityList
        .filter((item) => item.stateId === CandidateList[0].stateId)
        .map((city) => ({
          key: city.cityId,
          value: city.fullName.trim(),
        }));
      console.log('cities are', newcity);

      setFilteredCity(newcity);

      const profession = professionList.find(
        (prof) => prof.professionId == CandidateList[0].professionId
      );

      const designationIds = profession.designationIds.split(',');

      const newDesignation = designationList
        .filter((item) => designationIds.includes(item.designationId))
        .map((designation) => ({
          key: designation.designationId,
          value: designation.fullName.trim(),
        }));

      setFilteredDesgination(newDesignation);

      const educationIds = profession.educationIds.split(',');

      const newEducation = educationList
        .filter((item) => educationIds.includes(item.educationId))
        .map((education) => ({
          key: education.educationId,
          value: education.fullName.trim(),
        }));

      setSelectedRow(CandidateList[0]);

      setFilteredEducation(newEducation);
    }
  }, [CandidateList, stateList, cityList, skillList, educationList, designationList, currentTab]);

  useEffect(() => {
    if (currentTab == 'EditProfile') {
      setDisableAllFields(false);
      setIsAddMode(false);
      setShowbutton(true);
      setErrors('');
    } else {
      setDisableAllFields(true);
      setShowbutton(false);
    }
  }, [currentTab]);

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
          candidateId: data?.candidateId,
          fullname: data?.fullname.trim() || '',
          cnic: data?.cnic,
          email: data?.email || 0,
          phoneNumber: data?.phoneNumber,
          username: data?.username,
          resume: data?.resume,
          countryId: event.target.value,
          skills: data?.skills,
          professionId: data?.professionId,
          designationId: data?.designationId,
          educationId: data?.educationId,

          status: data?.status,
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
        candidateId: data?.candidateId,
        fullname: data?.fullname.trim() || '',
        cnic: data?.cnic,
        email: data?.email || 0,
        phoneNumber: data?.phoneNumber,
        username: data?.username,
        resume: data?.resume,
        stateId: event.target.value,
        countryId: data?.countryId,
        skills: data?.skills,
        professionId: data?.professionId,
        designationId: data?.designationId,
        educationId: data?.educationId,

        status: data?.status || 0,
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
        candidateId: data?.candidateId,
        fullname: data?.fullname.trim() || '',
        cnic: data?.cnic,
        email: data?.email || 0,
        phoneNumber: data?.phoneNumber,
        username: data?.username,
        resume: data?.resume,
        stateId: event.target.value,
        countryId: data?.countryId,
        stateId: data?.stateId,
        cityId: data?.cityId,
        skills: data?.skills,
        professionId: event.target.value,

        status: data?.status || 0,
      };

      setSelectedRow(updatedData);
    } else if (event.target.name === 'skills') {
      const updatedData = {
        candidateId: data?.candidateId,
        fullname: data?.fullname.trim() || '',
        cnic: data?.cnic,
        email: data?.email || 0,
        phoneNumber: data?.phoneNumber,
        username: data?.username,
        resume: data?.resume,
        stateId: data?.stateId,
        cityId: data?.cityId,
        countryId: data?.countryId,
        skills: event.target.value,
        professionId: data?.professionId,
        designationId: data?.designationId,
        educationId: data?.educationId,
        status: data?.status || 0,
      };

      setSelectedRow(updatedData);
      // setDummyDefaultValue(event.target.value);
      setMultiSelectValues(event.target.value, dummyMultiselectObj, setDummyDefaultValue);
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

  const fields = [
    {
      name: 'fullname',
      label: 'Full name',
      type: 'text',
      maxLength: 20,
      disabled: disableAllFields,
    },

    {
      name: 'cnic',
      label: 'Cnic',
      type: 'text',
      disabled: disableAllFields,
    },

    {
      name: 'email',
      label: 'Email',
      type: 'email',
      disabled: disableAllFields,
    },

    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      disabled: disableAllFields,
    },

    {
      name: 'countryId',
      label: 'Country',
      mandatory: true,
      type: 'dropdown',
      disabled: disableAllFields,
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
      disabled: disableAllFields,
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
      disabled: disableAllFields,
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
      disabled: disableAllFields,
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
      disabled: disableAllFields,
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
      disabled: disableAllFields,
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
      disabled: disableAllFields,
    },
  ];

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

  const handleFormSubmit = async (data) => {
    const updatedData = {
      candidateId: data?.candidateId,
      fullname: data?.fullname.trim() || '',
      cnic: data?.cnic,
      email: data?.email || 0,
      phoneNumber: data?.phoneNumber,
      username: data?.username,
      resume: data?.resume,
      stateId: data?.stateId,
      countryId: data?.countryId,
      cityId: data?.cityId,
      companyId: data?.companyId,
      skills: data?.skills,
      professionId: data?.professionId,
      about: about,
      linkedInUrl: links['linkedin'],
      gitHubUrl: links['github'],
      educationInstitute: educationInstitute,
      ResumePdf: null,
      designationId: data?.designationId,
      educationId: data?.educationId,
      status: data?.status || 0,
    };

    let newErrorDetails = '';

    // if (
    //   jobDescriptonList.some(
    //     (item) =>
    //       item.jobTitle.toLowerCase().trim() === data.jobTitle.toLowerCase().trim() &&
    //       item.jobDescriptionId !== data.jobDescriptionId
    //   )
    // ) {
    //   newErrorDetails = 'Job Already Exists';
    // } else if (
    //   jobDescriptonList.some(
    //     (item) =>
    //       item.code.toLowerCase().trim() === data.code.toLowerCase().trim() &&
    //       item.jobDescriptionId !== data.jobDescriptionId
    //   )
    // ) {
    //   newErrorDetails = 'Job Code Already Exists';
    // }

    // setErrors(newErrorDetails);
    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormAdd(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('New Record successfully added');
        setSelectedRow(null);
      } else {
        try {
          const response = await submitFormUpdate(updatedData);
          if (response && response.code === '500' && response.message) {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
          } else {
            quickEdit.onFalse();
            enqueueSnackbar('Record has been updated successfully');
            setSelectedRow(null);
            setCurrentTab('profile');
          }
        } catch (error) {
          console.error('Error Updating record:', error);
        }
      }
    }
  };

  // Hardcoded data for `info`
  const info = {
    totalFollowers: 1200,
    totalFollowing: 300,
    quote: 'Life is a journey, not a destination.',
    country: 'United States',
    email: 'example@example.com',
    role: 'Software Engineer',
    company: 'Tech Company',
    school: 'Tech University',
    socialLinks: {
      facebook: 'https://facebook.com/example',
      instagram: 'https://instagram.com/example',
      linkedin: 'https://linkedin.com/in/example',
      twitter: 'https://twitter.com/example',
    },
  };

  // const renderFollows = (
  //   <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
  //     <Stack
  //       direction="row"
  //       divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
  //     >
  //       <Stack width={1}>
  //         {fNumber(info.totalFollowers)}
  //         <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
  //           Follower
  //         </Box>
  //       </Stack>

  //       <Stack width={1}>
  //         {fNumber(info.totalFollowing)}
  //         <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
  //           Following
  //         </Box>
  //       </Stack>
  //     </Stack>
  //   </Card>
  // );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {currentTab == 'EditProfile' ? (
          <TextField
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            fullWidth
            multiline
            placeholder="About"
            variant="outlined"
            size="small"
          />
        ) : (
          <Box sx={{ typography: 'body2' }}>{CandidateList[0]?.about || 'Enter About ... '}</Box>
        )}

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Live at `}
            <Link variant="subtitle2" color="inherit">
              {
                countryList.find((country) => country.countryId == CandidateList[0].countryId)
                  ?.fullName
              }
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {CandidateList[0].email}
        </Stack>

        <Stack direction="row" spacing={2} alignItems={'center'}>
          <Iconify icon="ic:round-business-center" width={24} />

          {CandidateList[0].companyId !== null ? (
            <Box sx={{ typography: 'body2' }}>
              {info.role} {`at `}
              <Link variant="subtitle2" color="inherit">
                {info.company}
              </Link>
            </Box>
          ) : (
            <Box sx={{ typography: 'body2' }}>Not Hired Yet...</Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems={'center'}>
          <Iconify icon="ic:round-business-center" width={24} />

          {currentTab == 'EditProfile' ? (
            <TextField
              value={educationInstitute}
              onChange={(event) => setEducationInstitute(event.target.value)}
              fullWidth
              placeholder="Study At"
              variant="outlined"
              size="small"
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {`Studied at `}
              <Link variant="subtitle2" color="inherit">
                {CandidateList[0].educationInstitute}
              </Link>
            </Box>
          )}
        </Stack>
      </Stack>
    </Card>
  );

  const handleChange = (event, platform) => {
    setLinks({ ...links, [platform]: event.target.value });
  };
  const socialIcons = [
    {
      value: 'linkedin',
      name: 'LinkedIn',
      icon: 'eva:linkedin-fill',
      color: '#007EBB',
      path: 'https://www.linkedin.com/caitlyn.kerluke',
    },
    {
      value: 'github',
      name: 'GitHub',
      icon: 'eva:github-fill',
      color: '#000000',
      path: 'https://github.com/caitlyn.kerluke',
    },
  ];

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {socialIcons.map((social) => (
          <Stack
            key={social.value}
            spacing={2}
            direction="row"
            sx={{ wordBreak: 'break-all', typography: 'body2' }}
          >
            <Iconify
              icon={social.icon}
              width={24}
              sx={{
                flexShrink: 0,
                color: social.color,
              }}
            />
            {currentTab == 'EditProfile' ? (
              <TextField
                value={links[social.value] == '...' ? '' : links[social.value]}
                onChange={(event) => handleChange(event, social.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            ) : (
              <Link color="inherit" href={social.path} sx={{ whiteSpace: 'nowrap' }}>
                {links[social.value]}
              </Link>
            )}
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderAbout}

          {renderSocials}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {' '}
          <Card sx={{ padding: 5 }}>
            <Add
              currentUser={isAddMode ? null : selectedRow}
              onClose={quickEdit.onFalse}
              onSubmitInsert={handleFormSubmit}
              title={addTitle}
              fields={fields}
              selectedObj={selectedRow}
              onFieldChange={handleDropdownChange}
              errorMessage={errorDetails}
              showbuttons={showbutton}
            />
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
