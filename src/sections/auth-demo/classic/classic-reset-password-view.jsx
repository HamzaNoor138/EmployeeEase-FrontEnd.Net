import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { fetcherPost } from 'src/utils/axios';
import { PasswordIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { InputAdornment, IconButton, Alert } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ClassicForgotPasswordView() {
  const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must be at least 6 characters long, containing at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character'
      ),
    confirmPassword: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must be at least 6 characters long, containing at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character'
      )
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSucess, setIsSucess] = useState(false);

  const password = useBoolean();
  const confirmpassword = useBoolean();

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token'); // Extract token from the URL

      const body = {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token,
      };

      const response = await fetcherPost(
        'http://localhost:5161/api/UserProfile/ResetPassword',

        body
      );

      if (response.code == 200) {
        setMessage(response.message);
        setIsSucess(true);
        setIsError(false);
      } else {
        setMessage(response.message);
        setIsError(true);
      }
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
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

      <RHFTextField
        name="confirmPassword"
        label="Confirm New Password"
        type={confirmpassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmpassword.onToggle} edge="end">
                <Iconify
                  icon={confirmpassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Reset Password
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Reset your password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the your new Password
        </Typography>

        {isError && (
          <Alert sx={{ mt: 2 }} severity="error">
            {message}
          </Alert>
        )}
        {isSucess && (
          <Alert sx={{ mt: 2 }} severity="success">
            {message}
          </Alert>
        )}
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
