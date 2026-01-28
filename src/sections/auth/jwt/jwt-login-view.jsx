import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useGoogleLogin } from '@react-oauth/google';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import {
  PATH_AFTER_LOGIN,
  PATH_AFTER_LOGIN_COMPANY,
  PATH_AFTER_LOGIN_EMPLOYEE,
  PATH_AFTER_LOGIN_NEW_USER,
  PATH_AFTER_LOGIN_SUPER,
} from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { setAuthToken } from 'src/utils/storage-available';
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: 'ft1',
    password: '123',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Frontend-only demo accounts: work without backend/database
      if (data.password === '123456') {
        if (data.username === 'demo@gmail.com') {
          sessionStorage.setItem('username', 'demo@gmail.com');
          sessionStorage.setItem('userType', 'sa');
          sessionStorage.setItem('email', 'demo@gmail.com');
          sessionStorage.setItem('demoAllModules', 'true');

          await login?.('demo@gmail.com', '123456');
          router.push(PATH_AFTER_LOGIN_SUPER);
          return;
        }

        if (data.username === 'test@gmail.com') {
          sessionStorage.setItem('username', 'test@gmail.com');
          sessionStorage.setItem('userType', 'sa');
          sessionStorage.setItem('email', 'test@gmail.com');
          sessionStorage.setItem('demoAllModules', 'true');

          await login?.('test@gmail.com', '123456');
          router.push(PATH_AFTER_LOGIN_SUPER);
          return;
        }

        if (data.username === 'company@gmail.com') {
          sessionStorage.setItem('username', 'company@gmail.com');
          sessionStorage.setItem('userType', 'co');
          sessionStorage.setItem('email', 'company@gmail.com');
          sessionStorage.setItem('demoAllModules', 'true');

          await login?.('company@gmail.com', '123456');
          router.push(PATH_AFTER_LOGIN_COMPANY);
          return;
        }

        if (data.username === 'user@gmail.com') {
          sessionStorage.setItem('username', 'user@gmail.com');
          sessionStorage.setItem('userType', 'cj');
          sessionStorage.setItem('email', 'user@gmail.com');
          sessionStorage.setItem('demoAllModules', 'true');

          await login?.('user@gmail.com', '123456');
          router.push(PATH_AFTER_LOGIN_EMPLOYEE);
          return;
        }

        if (data.username === 'employee@gmail.com') {
          sessionStorage.setItem('username', 'employee@gmail.com');
          sessionStorage.setItem('userType', 'cj');
          sessionStorage.setItem('email', 'employee@gmail.com');
          sessionStorage.setItem('demoAllModules', 'true');

          await login?.('employee@gmail.com', '123456');
          router.push(PATH_AFTER_LOGIN_EMPLOYEE);
          return;
        }
      }

      // Call the login function with username and password
      const response = await fetch('http://localhost:5161/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.code === '404') {
          setErrorMsg(typeof error === 'string' ? error : responseData.message);
        } else {
          sessionStorage.setItem('username', responseData.data[0].username);
          sessionStorage.setItem('userType', responseData.data[0].userType);
          sessionStorage.setItem('email', responseData.data[0].email);
          await login?.(data.username, data.password);
          setAuthToken(responseData.data[0].token);
          if (responseData.data[0].userType == 'co') {
            router.push(PATH_AFTER_LOGIN_COMPANY);
          } else if (responseData.data[0].userType == 'sa') {
            router.push(PATH_AFTER_LOGIN_SUPER);
          } else if (
            [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'cj',
            ].includes(responseData.data[0].userType)
          ) {
            router.push(PATH_AFTER_LOGIN_EMPLOYEE);
          } else if (responseData.data[0].userType == 'rc') {
            router.push(PATH_AFTER_LOGIN_NEW_USER);
          } else {
            throw new Error('Failed to login. Please check your credentials.');
          }
        }
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  // Function to handle Google Login success
  const handleGoogleSuccess = async (response) => {
    const accessToken = response.access_token; // Get the access token from Google response

    try {
      // Send Google access token to backend to verify and get role
      const roleResponse = await fetch('http://localhost:5161/api/Login/LoginWithGoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken, // Send access token to backend for validation
        }),
      });

      if (roleResponse.ok) {
        const responseData = await roleResponse.json();

        if (responseData.code === '404') {
          setErrorMsg(typeof error === 'string' ? error : responseData.message);
        } else {
          sessionStorage.setItem('username', responseData.data[0].username);
          sessionStorage.setItem('userType', responseData.data[0].userType);
          sessionStorage.setItem('email', responseData.data[0].email);
          await login?.(responseData.data[0].username, '123');
          setAuthToken(responseData.data[0].token);
          if (responseData.data[0].userType == 'co') {
            router.push(PATH_AFTER_LOGIN_COMPANY);
          } else if (responseData.data[0].userType == 'sa') {
            router.push(PATH_AFTER_LOGIN_SUPER);
          } else if (
            [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'cj',
            ].includes(responseData.data[0].userType)
          ) {
            router.push(PATH_AFTER_LOGIN_EMPLOYEE);
          } else if (responseData.data[0].userType == 'rc') {
            router.push(PATH_AFTER_LOGIN_NEW_USER);
          } else {
            throw new Error('Failed to login. Please check your credentials.');
          }
        }
      } else {
        throw new Error('Failed to login. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setErrorMsg('Google Login Failed.');
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Employee Ease</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New Candidate?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.registerCandidate} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="username" label="User Name" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        component={RouterLink}
        href={paths.authDemo.classic.forgotPassword2}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      {/* Google Login Button */}
      <Button
        type="button"
        onClick={() => googleLogin()}
        startIcon={<Iconify icon="flat-color-icons:google" />}
      >
        Login with Google
      </Button>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      <Alert severity="info" sx={{ mb: 3 }}>
        Demo logins (no backend):{' '}
        <strong>demo@gmail.com</strong>, <strong>test@gmail.com</strong>, <strong>company@gmail.com</strong>,{' '}
        <strong>user@gmail.com</strong>, <strong>employee@gmail.com</strong> / <strong>123456</strong>
      </Alert>

      {renderForm}
    </FormProvider>
  );
}
