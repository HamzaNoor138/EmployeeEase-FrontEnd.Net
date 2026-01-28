import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { CircularProgress, Box, Button } from '@mui/material';
import { fetcherPost } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function ClassicVerifyView() {
  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); // Extract token from the URL

    if (token) {
      verifyEmail(token);
    } else {
      setMessage('Invalid token');
      setIsError(true);
    }
  }, [location]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetcherPost(
        'http://localhost:5161/api/UserProfile/VerifyEmail',

        token
      );

      if (response.code == 200) {
        setMessage(response.message);
        setIsError(false);
      } else {
        setMessage(response.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('An error occurred while verifying your email.');
      setIsError(true);
    }
  };

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3" sx={{ whiteSpace: 'nowrap' }}>
          Verifying Email Please Wait ...
        </Typography>

        {message === '' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: isError ? 'red' : 'green',
            }}
          >
            <Typography sx={{ fontSize: 23 }}> {message}</Typography>

            <Button
              sx={{ mt: 2, fontSize: 20 }}
              component={RouterLink}
              href={paths.auth.jwt.login}
              variant="contained"
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Stack>
    </>
  );

  return <>{renderHead}</>;
}
