import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';
// import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';

import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { parse } from 'date-fns';

// import { set } from 'lodash';
// RHFAutocomplete
// ----------------------------------------------------------------------

export default function Add({
  view,
  currentUser,
  open,
  onClose,
  onSubmitInsert,
  title,
  fields,
  selectedObj,
  onFieldChange,
  errorMessage,
  showbuttons = true,
  buttonText = '',
}) {
  // const { enqueueSnackbar } = useSnackbar();
  const isNewUnit = currentUser === null;
  const [valueLength, setvalueLength] = useState(0);
  const minDate = new Date();
  // console.log("CurrentDate", minDate)

  const validationSchema = {};

  fields.forEach((field) => {
    let fieldValidation = Yup.string();

    if (field.mandatory) {
      if (field.type === 'multiselect') {
        fieldValidation = fieldValidation.test(
          'isRequired',
          `Please select  ${field.label}`,
          (value) =>
            formData[field.name] !== '' &&
            formData[field.name] !== undefined &&
            formData[field.name] !== null
        );
      } else if (field.type === 'dropdown') {
        fieldValidation = fieldValidation.test(
          'isRequired',
          `Please Select ${field.label}`,
          (value) =>
            formData[field.name] !== '' &&
            formData[field.name] !== undefined &&
            formData[field.name] !== null
        );
      } else {
        fieldValidation = fieldValidation.required(`Please Enter ${field.label}`);
      }
    }

    if (field.maxLength && field.type !== 'number') {
      fieldValidation = fieldValidation.max(
        field.maxLength,
        `${field.label} must be at most ${field.maxLength} characters`
      );
    }
    if (field.numberField) {
      fieldValidation = fieldValidation.matches(
        /^[0-9]*$/,
        `${field.label} must be a positive number`
      );
    }
    if (field.checkzerovalue) {
      fieldValidation = fieldValidation.matches(/^[1-9]\d*$/, `${field.label} cannot be 0`);
    }

    if (field.numberFieldwithoutzero) {
      fieldValidation = fieldValidation.matches(/^([1-9]\d*)$/, `${field.label} cannot be 0`);
    }
    // if (field.numberwithoutzero) {
    //   fieldValidation = fieldValidation.matches(
    //     /^([1-9]\d*)$/,
    //     `${field.label} cannot be 0`
    //   );
    // }

    if (field.maxNum) {
      fieldValidation = fieldValidation.max(
        field.maxNum,
        `${field.label} must be at most ${field.maxNum} digits`
      );
    }
    if (field.minLength) {
      if (
        field.minLength.minLength !== 0 &&
        field.minLength !== undefined &&
        valueLength > 0 &&
        field.type === 'number'
      ) {
        fieldValidation = fieldValidation.min(
          field.minLength,
          `${field.label} must be at least ${field.minLength} digits`
        );
      }
    }
    // else if (field.maxLength && field.type === 'number') {
    //   fieldValidation = fieldValidation.max(
    //     field.maxLength,
    //     `${field.label} must be at most ${field.maxLength} digits`
    //   );
    // }
    else if (field.maxLength && field.type === 'number') {
      fieldValidation = fieldValidation.max(
        field.maxLength,
        `${field.label} must be at most ${field.maxLength} digits`
      );

      // Add validation for positive and negative numbers
      fieldValidation = fieldValidation.matches(
        /^[-+]?\d*$/,
        `${field.label} must be a valid number`
      );
    } else if (field.type === 'contactNumberField') {
      fieldValidation = fieldValidation.matches(
        /^\+92\d{3}\d{7}$/,
        `${field.label} must be in the format +92XXXXXXXXXX`
      );
    } else if (field.type === 'UANNumberField') {
      fieldValidation = fieldValidation.matches(
        /^(\+92-\d{2}-\d{9})?$/,
        `${field.label} is not a valid UAN. It should start with '+92-xx-xxxxxxxxx'`
      );
    }

    if (field.type === 'email') {
      fieldValidation = fieldValidation.matches(
        // /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        /^(?:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})?$/,
        `${field.label} must contain @ and .`
      );
    }
    if (field.alphanum) {
      fieldValidation = fieldValidation.matches(
        /^[a-zA-Z0-9]*$/,
        `${field.label} must be alphanumeric without space`
      );
    }
    if (field.UanVal !== null && field.UanVal !== undefined && field.UanVal !== '') {
      fieldValidation = fieldValidation.matches(
        /^(\+92-\d{2}-\d{9})?$/,
        // /^(?:92[1-9]*)?$/,
        // /^(?:\+92[1-9][0-9]*)?$/,
        `${field.label} is not a valid UAN. It should start with '+92-xx-xxxxxxxxx'`
      );
    }
    if (
      field.PhoneNumberVal !== null &&
      field.PhoneNumberVal !== undefined &&
      field.PhoneNumberVal !== ''
    ) {
      fieldValidation = fieldValidation.matches(
        /^\+92-\d{3}-\d{7}$/,
        `${field.label} is not a valid Contact No. It should follow the pattern '+92-xxx-xxxxxxx'`
      );
    }

    // const minDate = new Date();
    // if (field.Currentdate) {
    //   // Add validation for the minimum date
    //   fieldValidation = fieldValidation.min(
    //     minDate,
    //     `${field.label} must be on or after the current date`
    //   );
    // }

    if (field.UrlValid) {
      fieldValidation = fieldValidation.matches(
        /^$|^(?!.*\s)[^.\s]+(\.[^.\s]+)+$/,
        // /^$|^(?!.*\s)[A-Za-z0-9/:-]+(\.[A-Za-z]{2,})+([/A-Za-z0-9?=&%_-]+)?$/,
        // /^$|^(?!.*\s)[A-Za-z0-9/:-]+(\.[/^$|^(?!.*\s)[^\s]+$]+)?$/,

        `${field.label} is not a valid URL. No spaces are allowed, and there should be at least one dot (.)`
      );
    }
    // if (field.UanVal) {
    //   // Validate UAN format
    //   const uanRegex = /^92[1-9]0*\d{8}$/; // UAN should start with '92', the second digit should not be '0', and '0' can appear in the middle
    //   if (!uanRegex.test(field.value)) {
    //     const uanValidationMessage = `${field.label} is not a valid UAN. It should start with '92' and the second digit should not be '0'`;
    //     fieldValidation = [...fieldValidation, uanValidationMessage];
    //   }
    // }

    if (field.minimumLength2) {
      fieldValidation = fieldValidation.min(
        field.minimumLength2,
        `${field.label} must be at least ${field.minimumLength2} digits`
      );
    }
    if (field.alphanumWithSpace) {
      fieldValidation = fieldValidation.matches(
        /^[a-zA-Z0-9\s]*$/,
        `${field.label} must be alphanumeric`
      );
    }

    if (field.alphanumWithSpacedash) {
      fieldValidation = fieldValidation.matches(
        /^[a-zA-Z0-9\s-]*$/,
        `${field.label} must be alphanumeric`
      );
    }

    if (field.numberField) {
      fieldValidation = fieldValidation.matches(
        /^[0-9]*$/,
        `${field.label} must be a positive number`
      );
    }

    if (field.specialCharacterWithoutspace) {
      fieldValidation = fieldValidation.matches(
        /^[^\s]*$/,
        `Space is not allowed in ${field.label}`
      );
    }

    // Set the validation schema for the field
    validationSchema[field.name] = fieldValidation;
  });
  // const [fil, setFile] = useState(null);

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];

  //   if (selectedFile) {
  //     const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  //     // const maxFileSize = 1000 * 1024; // 1MB

  //     // if (allowedFileTypes.includes(selectedFile.type) && selectedFile.size <= maxFileSize) {
  //       if (allowedFileTypes.includes(selectedFile.type)) {
  //       setFile(selectedFile);

  //       convertFileToBase64(selectedFile)
  //         .then((base64String) => {
  //           const { name } = e.target;
  //           setFormData((prevData) => ({
  //             ...prevData,
  //             [name]: base64String.split(",")[1],
  //           }));
  //         });
  //     } else {
  //       setFile(null); // Clear the file if it's not an image or exceeds the size limit
  //       console.log('Please select a valid image file (jpg, jpeg, png, gif) within 1MB.');
  //     }
  //   } else {
  //     setFile(null); // Clear the file if no file is selected
  //   }
  // };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  function createImageUrl(base64String) {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    // Create an object URL from the Blob with a generic 'image' type
    const imageUrl = URL.createObjectURL(new Blob([byteArray], { type: 'image' }));

    return imageUrl;
  }

  function base64ToDataURL(base64String) {
    return `data:image/png;base64,${base64String}`;
  }
  // const NewUserSchema = Yup.object().shape(validationSchema);

  const [formData, setFormData] = useState(selectedObj);
  const methods = useForm({
    resolver: yupResolver(Yup.object().shape(validationSchema)), // Define validation schema directly here
    defaultValues: selectedObj,
    // defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue, // This function is provided by react-hook-form for updating field values
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles, field) => {
      const file = acceptedFiles[0];
      // Create a FileReader to read the file as a base64 string
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;

        const imageUrl = createImageUrl(base64String);
        // Set the new file in your form data with the image preview
        formData[field.name] = base64String;

        convertFileToBase64(file).then((base64) => {
          const { name } = event.target;
          setFormData((prevData) => ({
            ...prevData,
            [name]: base64.split(',')[1],
          }));
        });

        if (file) {
          setValue(field.name, imageUrl, { shouldValidate: true });
        }
      };

      // Start reading the file as a base64 string
      reader.readAsDataURL(file);
    },
    [setValue, formData]
  );

  useEffect(() => {
    if (selectedObj) {
      console.log('check all fields: ', fields);
      // If selectedObj is defined, set formData to selectedObj
      // setFile('asd');
      console.log('fields are: ', fields);
      setFormData(selectedObj);

      fields.reduce((result, field) => {
        // if (field.type === 'upload photo') {
        //   const imageUrl = base64ToDataURL(selectedObj[field.name]);
        //   setValue(field.name, imageUrl, { shouldValidate: true });

        // }
        if (field.type === 'upload photo') {
          const imageUrl = base64ToDataURL(selectedObj[field.name]);

          // Check if the imageUrl is an empty string
          if (!imageUrl) {
            // Perform actions when imageUrl is empty
            console.log(`${field.label} is empty.`);
            // You can also set an error state or display a message, depending on your requirements
          } else {
            // Set the imageUrl and validate if needed
            setValue(field.name, imageUrl, { shouldValidate: true });
          }
        }
        // else if (field.type === 'multiselect' && field.defaultValue.length > 0) {
        //   // let defaultString = ""
        //   field.options = field.defaultValue;
        //   // setValue(field.name, defaultString);
        // }

        return result;
      }, {});
    } else {
      // If selectedObj is undefined, set default values, including the switch field
      const defaultFormData = fields.reduce((result, field) => {
        if (field.type === 'switch') {
          result[field.name] = 1;
        } else if (field.type === 'switchCase') {
          result[field.name] = 0;
        } else {
          result[field.name] = ''; // Set to an appropriate default value for other fields
        }
        return result;
      }, {});

      // console.log("form data is: ", defaultFormData);
      setFormData(defaultFormData);
    }
  }, [selectedObj, fields, errorMessage, setValue]);

  const handleFieldChange = (event) => {
    if (event.target.type === 'checkbox') {
      const { name, checked } = event.target;
      const newValue = checked ? 1 : 0;

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));

      setValue(name, newValue);
    } else {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setValue(name, value);
      if (event.target.value !== undefined && fields.type === 'number') {
        setvalueLength(event.target.value.length);
      }
    }

    // Call the callback function after the state has been updated
  };

  // const defaultSelectedValues = [
  //   { key: '2626a09a-a701-442d-a072-58e0ea51a660', value: 'Kasur' },
  //   { key: '6945d52b-a525-4d68-be19-821eb6e85f5d', value: 'ABC' },
  // ];
  // const defaultSelectedValues = formData[field.name] || [];

  const sendData = handleSubmit(async () => {
    await onSubmitInsert(formData);
  });

  return (
    <FormProvider methods={methods} onSubmit={sendData}>
      <DialogTitle>{title} </DialogTitle>

      <div>
        {errorMessage && (
          <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
      </div>

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        sx={{ marginTop: '20px' }}
      >
        {fields.map((field) => {
          let fieldComponent;

          // const label = field.mandatory ? `${field.label} * ` : field.label

          const label = (
            <span>
              {field.label}
              {field.mandatory && <span style={{ color: 'red' }}> * </span>}
              {field.name === 'statusId' && <span style={{ color: 'red' }}> *</span>}
            </span>
          );

          if (field.type === 'dropdown') {
            fieldComponent = (
              <RHFSelect
                name={field.name}
                label={label}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                onChange={(event) => {
                  handleFieldChange(event);
                  onFieldChange(event, formData);
                }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </RHFSelect>
            );
          } else if (field.type === 'multiselect') {
            fieldComponent = (
              <Autocomplete
                multiple
                required
                name={field.name}
                label={label}
                disabled={field.disabled || view}
                value={field.defaultValue}
                options={field.options.filter(
                  (option) =>
                    !field.defaultValue.some((defaultOpt) => defaultOpt.key === option.key)
                )}
                // defaultValue={field.defaultValue}
                onChange={(event, value) => {
                  handleFieldChange(event);
                  const selectedValues = value.map((option) => option.key).join(',');
                  // const uniqueValues = Array.from(new Set(selectedValues.split(','))).join(',');
                  console.log('selectedValues: ', event.target.name);
                  event.target.name = field.name;
                  event.target.value = selectedValues;
                  // formData[field.name] = selectedValues;
                  onFieldChange(
                    {
                      target: {
                        name: field.name,
                        value: selectedValues,
                      },
                    },
                    formData
                  );
                  console.log('values are: ', formData[field.name]);
                }}
                getOptionLabel={(option) => option.value}
                renderOption={(props, option) => {
                  // console.log("ignore: ");
                  return <li {...props}>{option.value}</li>;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={formData ? formData[field.name] || '' : ''}
                    label={label}
                    error={!!methods.formState.errors[field.name]}
                    helperText={methods.formState.errors[field.name]?.message || ''}
                  />
                )}
              />
            );
          } else if (field.type === 'subheading') {
            fieldComponent = (
              <DialogTitle style={{ fontSize: '16px', marginTop: -24 }}>
                {' '}
                {field.label}{' '}
              </DialogTitle>
            );
          } else if (field.type === 'switchCase') {
            fieldComponent = (
              <RHFSwitch
                name={field.name}
                checked={field.value === 0}
                disabled={field.disabled || view}
                label={label}
              />
            );
          } else if (field.type === 'switch') {
            fieldComponent = (
              <RHFSwitch
                name={field.name}
                checked={field.value !== 0}
                onClicks={(event) => {
                  handleFieldChange(event);
                  onFieldChange(event, formData);
                }}
                disabled={field.disabled || view}
                label={label}
              />
            );
          }
          // else if (field.type === 'text') {
          //   fieldComponent = (
          //     <RHFTextField
          //       name={field.name}
          //       label={label}
          //       disabled={field.disabled || view}
          //       value={formData ? (formData[field.name] || '') : ''}
          //       maxLength={field.maxLength}
          //       minLength={field.minLength}
          //       onChange={(event) => {
          //         handleFieldChange(event);
          //         onFieldChange(event, formData);

          //       }}
          //     />
          //   );
          // }
          else if (field.type === 'text') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                multiline={field.multiline}
                label={label}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                maxLength={field.maxLength}
                minLength={field.minLength}
                onChange={(event) => {
                  const inputValue = event.target.value;

                  // Check if the entered value is '0'
                  if (inputValue === '0') {
                    // You can choose to prevent further processing or handle it as needed
                    console.log('Cannot enter 0');
                    return;
                  }
                  handleFieldChange(event);
                  onFieldChange(event, formData);
                }}
              />
            );
          } else if (field.type === 'newdate') {
            fieldComponent = (
              <DatePicker
                name={field.name}
                label={label}
                disabled={view}
                value={formData ? formData[field.name] || '' : ''}
                onChange={(event) => {
                  onFieldChange(event, field.name);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'contactNO') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                disabled={field.disabled || view}
                maxLength={field.maxLength}
                minLength={field.minLength}
                label={label}
                value={formData ? formData[field.name] || '' : ''}
                onChange={(event) => {
                  onFieldChange(event, field.name);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'email') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                label={label}
                type="email"
                maxLength={field.maxLength}
                minLength={field.minLength}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                onChange={(event) => {
                  onFieldChange(event, field.name);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'number') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                label={label}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                maxLength={field.maxLength}
                minLength={field.minLength}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  const numericValue = inputValue.replace(/\D/g, ''); // Use regex to keep only digits
                  event.target.value = numericValue;
                  onFieldChange(event, formData);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'upload photo') {
            fieldComponent = (
              <RHFUploadAvatar
                name={field.name}
                onDrop={(acceptedFiles) => handleDrop(acceptedFiles, field)}
                multiple={false}
              />
            );
          } else if (field.type === 'date') {
            fieldComponent = (
              <Controller
                name={field.name}
                // control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <DatePicker
                    label={label}
                    value={value}
                    disabled={view}
                    onChange={(date) => {
                      const event = {
                        target: {
                          name: field.name,
                          value: date,
                        },
                      };
                      onFieldChange(event, formData);
                      handleFieldChange(event);
                    }}
                    // format="dd/MM/yyyy"
                    format="yyyy/MM/dd"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        readOnly: true,
                      },
                    }}
                    minDate={formData ? formData[field.minDateCheck] : ''}
                    maxDate={formData ? formData[field.maxDateCheck] : ''}
                  />
                )}
              />
            );
          } else if (field.type === 'contactNumberField') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                label={label}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                maxLength={field.maxLength}
                minLength={field.minLength}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  const numericValue = inputValue.replace(/[^+\d]/g, '');
                  if (!numericValue || !numericValue.startsWith('+92')) {
                    event.target.value = `+92${numericValue.substring(3)}`;
                  } else {
                    if (numericValue.startsWith('+920')) {
                      event.target.value = '+92' + numericValue.substring(4);
                    } else {
                      event.target.value = '+92' + numericValue.substring(3);
                    }
                  }
                  onFieldChange(event, field.name);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'UANNumberField') {
            fieldComponent = (
              <RHFTextField
                name={field.name}
                label={label}
                disabled={field.disabled || view}
                value={formData ? formData[field.name] || '' : ''}
                maxLength={field.maxLength}
                minLength={field.minLength}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  let numericValue = inputValue.replace(/[^+\d]/g, '');
                  if (!numericValue.startsWith('+92-') || numericValue.startsWith('+92--')) {
                    event.target.value = `+92-${numericValue.substring(3)}`;
                    if (event.target.value.length >= 6 && event.target.value.charAt(6) !== '-') {
                      event.target.value =
                        event.target.value.slice(0, 6) + '-' + event.target.value.slice(6);
                    }
                  }
                  onFieldChange(event, field.name);
                  handleFieldChange(event);
                }}
              />
            );
          } else if (field.type === 'time') {
            fieldComponent = (
              <Controller
                name={field.name}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <TimePicker
                    label={label}
                    value={value}
                    disabled={field.disabled || view}
                    onChange={(time) => {
                      console.log('time', time); // Add this log
                      const event = {
                        target: {
                          name: field.name,
                          value: time,
                        },
                      };
                      onFieldChange(event, formData);
                      handleFieldChange(event);
                    }}
                    format="hh:mm aa"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        readOnly: true,
                      },
                    }}
                  />
                )}
              />
            );
          } else if (field.type === 'datetime') {
            fieldComponent = (
              <Controller
                name={field.name}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <DateTimePicker
                    label={label}
                    value={value}
                    disabled={field.disabled || view}
                    onChange={(dateTime) => {
                      console.log('dateTime', dateTime); // Add this log
                      const event = {
                        target: {
                          name: field.name,
                          value: dateTime,
                        },
                      };
                      onFieldChange(event, formData);
                      handleFieldChange(event);
                    }}
                    // format="eee MMM dd yyyy HH:mm:ss 'GMT'xxx (zzz)"
                    format="yyyy/MM/dd hh:mm:ss a"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        readOnly: true,
                      },
                    }}
                    minDate={minDate}
                  />
                )}
              />
            );
          } else if (field.type === 'duedate') {
            fieldComponent = (
              <Controller
                name={field.name}
                // control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <DatePicker
                    label={label}
                    value={value}
                    disabled={view}
                    onChange={(date) => {
                      const event = {
                        target: {
                          name: field.name,
                          value: date,
                        },
                      };

                      handleFieldChange(event);
                      onFieldChange(event, formData);
                    }}
                    // format="dd/MM/yyyy"
                    format="yyyy/MM/dd"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        readOnly: true,
                      },
                    }}
                    minDate={minDate}
                  />
                )}
              />
            );
          }
          return <div key={field.name}>{fieldComponent}</div>;
        })}
      </Box>

      <DialogActions>
        {/* type="submit" */}

        {/* {!isNewUnit && (
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            )} */}

        {showbuttons && (
          <>
            <LoadingButton
              sx={{ width: { xs: '100%', md: 200 } }}
              type="submit"
              disabled={view}
              variant="contained"
              loading={isSubmitting}
            >
              {isNewUnit ? (buttonText != '' ? buttonText : 'Add') : 'Update'}
            </LoadingButton>
          </>
        )}
      </DialogActions>
    </FormProvider>
  );
}

Add.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  view: PropTypes.bool,
  onSubmitInsert: PropTypes.func,
  title: PropTypes.string,
  fields: PropTypes.array,
  selectedObj: PropTypes?.object,
  onFieldChange: PropTypes?.func,
  errorMessage: PropTypes?.string,
};
