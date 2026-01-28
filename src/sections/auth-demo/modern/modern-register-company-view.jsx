import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAddPublic } from 'src/api/company';

import { useGetAllCountry } from 'src/api/addCountry';

import { useGetAllState } from 'src/api/addState';
import { useGetAllCity } from 'src/api/addCity';

import { useSnackbar } from 'src/components/snackbar';

import Add from 'src/sections/setup/view/add2';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useState } from 'react';
import { Alert, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function ModernRegisterCompanyView() {
  const password = useBoolean();

  const [filteredState, setFilteredState] = useState([]);

  const [filteredCity, setFilteredCity] = useState([]);

  const { countryList, refetchDataa } = useGetAllCountry();

  const { stateList, refetchDatta } = useGetAllState();

  const { cityList } = useGetAllCity();
  const [selectedRow, setSelectedRow] = useState(null);

  const { submitFormAdd } = useAddPublic();
  const [errorMsg, setErrorMessage] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorDetails, setErrors] = useState('');
  const fields = [
    {
      name: 'fullName',
      label: 'Company Name',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },

    {
      name: 'code',
      label: 'Company Code',
      mandatory: true,
      type: 'text',
      maxLength: 6,
      alphanum: true,
    },

    {
      name: 'registrationId',
      label: 'Registration ID',
      mandatory: true,
      type: 'number',
      maxLength: 20,
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
      name: 'address',
      label: 'Address',
      mandatory: true,
      type: 'text',
      maxLength: 20,
    },

    {
      name: 'officeNo',
      label: 'Office Number',
      mandatory: true,
      type: 'contactNumberField',
      maxLength: 20,
    },

    {
      name: 'officeEmail',
      label: 'Office Email',
      mandatory: true,
      type: 'email',
      maxLength: 30,
    },
    {
      name: 'annualLeave',
      label: 'Annual Leave Allowed for Employee',
      mandatory: true,
      type: 'number',
    },
    {
      name: 'websiteLink',
      label: 'WebsiteLink',
      mandatory: true,
      type: 'text',
    },
  ];

  const handleFormSubmit = async (data) => {
    const updatedData = {
      companyId: data?.companyId,
      stateId: data?.stateId || 0,
      countryId: data?.countryId || 0,
      annualLeave: data?.annualLeave,
      cityId: data?.cityId || 0,
      address: data?.address.trim() || '',
      registrationId: data?.registrationId,
      fullName: data?.fullName.trim() || '',
      officeNo: data?.officeNo.trim() || '',
      officeEmail: data?.officeEmail.trim() || '',
      code: data?.code.trim() || '',
      websiteLink: data?.websiteLink.trim() || '',
    };

    setSelectedRow(updatedData);
    setErrorMessage('');
    setIsSuccessful('');
    const response = await submitFormAdd(updatedData);
    if (response.code == '200') {
      setIsSuccessful(true);
      setSelectedRow(null);
    } else {
      setErrorMessage(response.message);
    }
  };

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
          companyId: data?.companyId,
          countryId: event.target.value,
          address: data?.address.trim() || '',

          registrationId: data?.registrationId,
          fullName: data?.fullName.trim() || '',
          officeNo: data?.officeNo.trim() || '',
          officeEmail: data?.officeEmail.trim() || '',
          code: data?.code.trim() || '',

          websiteLink: data?.websiteLink.trim() || '',
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
        companyId: data?.companyId,
        stateId: event.target.value,
        countryId: data?.countryId,
        address: data?.address.trim() || '',

        registrationId: data?.registrationId,
        fullName: data?.fullName.trim() || '',
        officeNo: data?.officeNo.trim() || '',
        officeEmail: data?.officeEmail.trim() || '',
        code: data?.code.trim() || '',

        websiteLink: data?.websiteLink.trim() || '',

        statusId: data?.statusId || 0,
      };
      setSelectedRow(updatedData);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ position: 'relative' }}>
      <Typography variant="h4">Get Your Company Registered Today !</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {isSuccessful && (
        <Alert severity="success">Company Has been Registered for Verfication</Alert>
      )}
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,

        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack>
      <Add
        currentUser={null}
        onClose={false}
        onSubmitInsert={handleFormSubmit}
        title={''}
        fields={fields}
        selectedObj={selectedRow}
        onFieldChange={handleDropdownChange}
        errorMessage={errorDetails}
        showbuttons={true}
        buttonText={'Register'}
      />
    </Stack>
  );

  return (
    <Box>
      {renderHead}

      {renderForm}

      {renderTerms}
    </Box>
  );
}
