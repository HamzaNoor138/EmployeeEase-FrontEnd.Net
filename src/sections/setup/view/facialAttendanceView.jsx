import React, { useState, useEffect, useRef } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { useTakeAttendanceOne } from 'src/api/attendanceFacialRecognition';
import { useSnackbar } from 'src/components/snackbar';
import CircularProgress from '@mui/material/CircularProgress';

const WebcamCapture = () => {
  const [stream, setStream] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { TakeAttendance } = useTakeAttendanceOne();
  const videoRef = useRef(null);
  const [errorText, setErrorText] = useState('');
  const [cameraNotWorking, setCameraNotWorking] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState('');
  const [loadingSpinner, setSpinner] = useState(false);
  const [showAttendanceInfo, setShowAttendanceInfo] = useState(false);

  useEffect(() => {
    let mediaStream = null;

    const setupCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraNotWorking(true);
      }
    };

    setupCamera();

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (showAttendanceInfo) {
      timer = setTimeout(() => {
        setShowAttendanceInfo(false);
      }, 10000); // 10 seconds
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAttendanceInfo]);

  const handleMarkAttendance = async () => {
    setErrorText('');
    setAttendanceInfo('');
    setSpinner(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();

      formData.append('companyUsername', sessionStorage.getItem('username'));
      formData.append('image', blob, 'image.jpg');

      const response = await TakeAttendance(formData);
      setSpinner(false);
      setShowAttendanceInfo(true);
      if (response.code == 200) {
        enqueueSnackbar(response.message);
        setAttendanceInfo(
          `Employee: ${response.data[0].employeeName} -- Clock-in Time: ${new Date(
            response.data[0].clockInTime
          ).toLocaleString()}`
        );
      } else if (response.code == 404) {
        setErrorText(response.message);
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });

        enqueueSnackbar('Please Mark Attendance Again', {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      } else if (response.code == 403) {
        setErrorText(response.message);
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });

        enqueueSnackbar('Please Try  Attendance Again', {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      } else if (response.code == 402) {
        setErrorText(response.message);
        enqueueSnackbar(response.message, {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });

        enqueueSnackbar('Please Try  Attendance Again', {
          variant: 'border',
          style: { backgroundColor: '#FF5630', color: '#fff' },
        });
      }
    }, 'image/jpeg');
  };

  return (
    <Grid container spacing={2}>
      <Typography variant="h4" sx={{ width: '100%', textAlign: 'center', color: 'green' }}>
        Please Position your face at the center of the Camera
      </Typography>
      <Grid item xs={12}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '82vw', height: '70vh', objectFit: 'cover' }}
        />

        <Typography sx={{ textAlign: 'center', mt: 4, color: 'green', fontSize: '20px' }}>
          {showAttendanceInfo && attendanceInfo}
        </Typography>

        <Typography sx={{ textAlign: 'center', color: 'red', fontSize: '20px' }}>
          {showAttendanceInfo && errorText}
        </Typography>
        {cameraNotWorking && (
          <Typography sx={{ textAlign: 'center', color: 'red', fontSize: '20px' }}>
            Camera Not Working !!! Plug the Camera...
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sx={{ textAlign: 'right', mr: 6 }}>
        <Button variant="contained" onClick={handleMarkAttendance}>
          {loadingSpinner ? <CircularProgress size={20} /> : '    Mark Attendance'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default WebcamCapture;