import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title = 'Upload Files',
  onCreate,
  onUpdate,
  folderName,
  heading,
  UploadButtonName,
  onChangeFolderName,
  onUpload, // Add the onUpload prop
  multiple = false, // Add a multiple prop with a default value of false
  ...other
}) {
  const [files, setFiles] = useState([]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (multiple) {
        setFiles([...files, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
    },
    [files, multiple]
  );

  const handleUpload = () => {
    onUpload(files); // Pass the files to the onUpload callback
    console.info('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" {...other}>
      <Stack direction="column" justifyContent="center" alignItems="center">
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload
          multiple={multiple} // Pass the multiple prop to the Upload component
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          heading={heading}
        />
      </Stack>

      <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {UploadButtonName ? UploadButtonName : 'Upload'}
        </Button>

        {!!files.length && multiple && (
          <Button sx={{ ml: 5 }} variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove All
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onUpload: PropTypes.func,
  multiple: PropTypes.bool,
};
