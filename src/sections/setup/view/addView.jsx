import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';
// import { USER_STATUS_OPTIONS } from 'src/_mock';
import { useSubmitFormData, useSubmitFormDataadd } from 'src/api/product';

// import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// RHFAutocomplete

// ----------------------------------------------------------------------

export default function AddView({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const { submitForm } = useSubmitFormData(); // Use the custom hook
  const { submitFormadd } = useSubmitFormDataadd(); // Use the custom hook
  const isNewUnit = currentUser === null;
  const NewUserSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    // date: Yup.string().required('Date   is required'),
    // status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      affiliationId: currentUser?.affiliationId || '',
      code: currentUser?.code || '',
      name: currentUser?.name || '',
      date: currentUser?.effectiveDate || '',
      status: currentUser?.statusId || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isNewUnit) {
        data.affiliationId = currentUser?.affiliationId || '';
        await submitForm(data);
        enqueueSnackbar('Update success!');
      } else {
        const updatedData = {
          name: data.name,
          code: data.code,
          statusId: data.status,
        };
        await submitFormadd(updatedData);
        enqueueSnackbar('add success!');
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* <DialogTitle>Quick Update</DialogTitle> */}
        <DialogTitle>{isNewUnit ? 'Add New Unit' : 'Quick Update'}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}

            <RHFTextField name="code" label="Affiliation Code" />
            <RHFTextField name="name" label="Affiliation Name" />

            <RHFTextField name="date" label="Affiliation Date" />

            <RHFTextField
              name="status"
              label="Status" // Provide a label here
            >
              <RHFSelect
                name="status"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
              />
            </RHFTextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddView.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
