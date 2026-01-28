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
import { useAddOne, useUpdateOne as PaymentInfoUpdate } from 'src/api/companyPaymentInfo';
import { _socials } from 'src/_mock';
import { useSnackbar } from 'src/components/snackbar';
import { useGetCompanyAccountInfo } from 'src/api/companyPaymentInfo';
import Iconify from 'src/components/iconify';
import { TextField, IconButton, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function CompanyProfileHome({
  currentTab,
  CandidateList,
  refetchData,
  setCurrentTab,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { countryList } = useGetAllCountry();
  const { stateList } = useGetAllState();
  const { accountInfoList, refetchData: AccountInfoRefresh } = useGetCompanyAccountInfo();
  const { CompanyPaymentInfoUpdate } = PaymentInfoUpdate();
  const { submitFormCompanyPayment } = useAddOne();
  const { cityList } = useGetAllCity();
  const { submitFormUpdate } = useUpdateOne();
  const [errorDetails, setErrors] = useState('');
  const [addTitle, setTitle] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRow2, setSelectedRow2] = useState(null);

  const [isAddMode, setIsAddMode] = useState(false);
  const [showbutton, setShowbutton] = useState(false);
  const quickEdit = useBoolean();
  const [fields, setFields] = useState([]);
  const [filteredState, setFilteredState] = useState([]);
  const [filteredCity, setFilteredCity] = useState([]);

  useEffect(() => {
    if (CandidateList.length > 0 && stateList.length > 0 && cityList.length > 0) {
      console.log('companyData', CandidateList);

      const newState = stateList
        .filter((item) => item.countryId === CandidateList[0].countryId)
        .map((state) => ({
          key: state.stateId,
          value: state.fullName.trim(),
        }));

      setFilteredState(newState);

      const newcity = cityList
        .filter((item) => item.stateId === CandidateList[0].stateId)
        .map((city) => ({
          key: city.cityId,
          value: city.fullName.trim(),
        }));
      console.log('cities are', newcity);

      setFilteredCity(newcity);
    }
  }, [CandidateList, stateList, cityList]);

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
          username: data?.username.trim() || '',
          password: data?.password.trim() || '',
          websiteLink: data?.websiteLink.trim() || '',
          attendanceUsername: data?.attendanceUsername.trim() || '',
          attendancePassword: data?.attendancePassword.trim() || '',
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
        companyId: data?.companyId,
        stateId: event.target.value,
        countryId: data?.countryId,
        address: data?.address.trim() || '',
        registrationId: data?.registrationId,
        fullName: data?.fullName.trim() || '',
        officeNo: data?.officeNo.trim() || '',
        officeEmail: data?.officeEmail.trim() || '',
        code: data?.code.trim() || '',
        username: data?.username.trim() || '',
        password: data?.password.trim() || '',
        websiteLink: data?.websiteLink.trim() || '',
        attendanceUsername: data?.attendanceUsername.trim() || '',
        attendancePassword: data?.attendancePassword.trim() || '',
        statusId: data?.statusId || 0,
      };
      setSelectedRow(updatedData);
    } else if (event.target.name === 'Payment_Type') {
      const updatedData = {
        candidateId: data?.candidateId,
        Cardholder_Name: data?.Cardholder_Name || '',
        Card_Number: data?.Card_Number,
        Expiration_Date: data?.Expiration_Date || 0,
        CVV: data?.CVV,
        CardNetwork: data?.CardNetwork,
        Payment_Type: event.target.value,
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

      setPaymentMethod(event.target.value);
    }
  };

  useEffect(() => {
    if (currentTab == 'profile') {
      const Fields = [
        {
          name: 'fullName',
          label: 'Company Name',
          mandatory: true,
          type: 'text',
          maxLength: 20,
          disabled: true,
        },

        {
          name: 'code',
          label: 'Company Code',
          mandatory: true,
          type: 'text',
          maxLength: 6,
          alphanum: true,
          disabled: true,
        },

        {
          name: 'registrationId',
          label: 'Registration ID',
          mandatory: true,
          type: 'number',
          maxLength: 20,
          disabled: true,
        },

        {
          name: 'countryId',
          label: 'Country',
          mandatory: true,
          disabled: true,
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
          disabled: true,
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
          disabled: true,
          type: 'dropdown',
          options: filteredCity.map((city) => ({
            key: city.key,
            value: city.value,
          })),
        },

        {
          name: 'address',
          label: 'Address',
          disabled: true,
          mandatory: true,
          type: 'text',
          maxLength: 20,
        },

        {
          name: 'officeNo',
          label: 'Office Number',
          mandatory: true,
          disabled: true,
          type: 'contactNumberField',
          maxLength: 20,
        },

        {
          name: 'officeEmail',
          label: 'Office Email',
          mandatory: true,
          disabled: true,
          type: 'email',
          maxLength: 20,
        },
        {
          name: 'username',
          label: 'Username',
          mandatory: true,
          disabled: true,
          type: 'text',
        },
        {
          name: 'password',
          label: 'Password',
          disabled: true,
          mandatory: true,
          type: 'text',
        },
        {
          name: 'attendanceUsername',
          label: 'Attendance Portal Username',
          mandatory: true,
          disabled: true,
          type: 'text',
        },
        {
          name: 'attendancePassword',
          label: 'Attendance Portal Password',
          mandatory: true,
          disabled: true,
          type: 'text',
        },

        {
          name: 'websiteLink',
          disabled: true,
          label: 'WebsiteLink',
          mandatory: true,
          type: 'text',
        },

        { name: 'statusId', label: 'Status', mandatory: false, type: 'switch', disabled: true },
        // // Add more fields as needed
      ];
      setFields(Fields);
    } else if (currentTab == 'bill') {
      const Fields = [
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
      setFields(Fields);
    }
  }, [currentTab, filteredCity, filteredState, countryList, selectedRow]);

  useEffect(() => {
    if (currentTab == 'profile') {
      setSelectedRow(CandidateList[0]);
    } else {
      if (accountInfoList.length > 0 && accountInfoList[0] != null) {
        setSelectedRow2(accountInfoList[0]);
        setIsAddMode(false);
      } else {
        setSelectedRow2(null);
        setIsAddMode(true);
      }
    }
  }, [currentTab, accountInfoList]);

  const handleFormSubmit = async (data) => {
    const updatedData = {
      companyId: data?.companyId,
      companyPaymentId: data?.companyPaymentId,
      companyusername: sessionStorage.getItem('username'),
      bankAccountHolderName: data?.bankAccountHolderName?.trim(),
      bankAccountNumberString: data?.bankAccountNumberString,
      bankName: data?.bankName,
      routingNumber: data?.routingNumber,
      bankCountry: data?.bankCountry,
      iBAN: data?.iBAN,
      statusId: data?.statusId,
    };
    let newErrorDetails = '';

    if (!newErrorDetails) {
      if (isAddMode === true) {
        await submitFormCompanyPayment(updatedData);
        quickEdit.onFalse();
        enqueueSnackbar('Bank Details successfully added');
        setSelectedRow(null);
        await AccountInfoRefresh();
      } else {
        try {
          const response = await CompanyPaymentInfoUpdate(updatedData);
          if (response && response.code === '500' && response.message) {
            enqueueSnackbar(response.message, {
              variant: 'border',
              style: { backgroundColor: '#FF5630', color: '#fff' },
            });
            await refetchData();
          } else {
            quickEdit.onFalse();
            enqueueSnackbar('Record has been updated successfully');
            await AccountInfoRefresh();
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

  return (
    <Grid container spacing={3}>
      {currentTab == 'bill' ? (
        <Grid item xs={12}>
          <Stack spacing={3}>
            {' '}
            <Card sx={{ padding: 5 }}>
              <Typography>Enter Bank Account Details:</Typography>
              <Add
                currentUser={isAddMode ? null : selectedRow2}
                onClose={quickEdit.onFalse}
                onSubmitInsert={handleFormSubmit}
                title={addTitle}
                fields={fields}
                selectedObj={selectedRow2}
                onFieldChange={handleDropdownChange}
                errorMessage={errorDetails}
                showbuttons={true}
              />
            </Card>
          </Stack>
        </Grid>
      ) : (
        <>
          {' '}
          {/* <Grid xs={12} md={4}>
            <Stack spacing={3}>
              {renderFollows}

              {renderAbout}

              {renderSocials}
            </Stack>
          </Grid> */}
          <Grid xs={12} md={12}>
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
                  showbuttons={false}
                />
              </Card>
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
}
