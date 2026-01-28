import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback, useState } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';
import { enqueueSnackbar, useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCandidates() {
  const URL = 'http://localhost:5161/api/Candidate/getAll';

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherGet(URL), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      candidates: data?.data || [],
      candidatesLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  return memoizedValue;
}

export function useGetAllAttenence() {
  const URL = endpoints.attendance.getByUsername;
  const username = sessionStorage.getItem('username'); // Replace with the actual username

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchAttendanceData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      employees: data?.data || [],
      employeesLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchAttendanceData,
    }),
    [data?.data, error, isLoading, isValidating, refetchAttendanceData]
  );

  return memoizedValue;
}
async function fetcherGet(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export function useLoadDataView() {
  const username = sessionStorage.getItem('username');
  const URL = `http://localhost:5161/api/AddAttendance/getAllbyCompanyUsername?username=${username}`;

  const { data, error, isLoading, isValidating } = useSWR(URL, fetcherGet, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      dataView: data?.data || [],
      pendingView: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, isLoading, error, isValidating, refetchData]
  );

  return memoizedValue;
}

export function useUpdateOne() {
  const URL = 'http://localhost:5161/api/AddAttendance/updateAddPastRecord';

  const updateAttendance = useCallback(
    async (data) => {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(URL, options);

        if (response.ok) {
          enqueueSnackbar('Record Updated', { variant: 'success' });
        } else {
          const error = await response.json();
          enqueueSnackbar(`Failed to update record: ${error.Message}`, { variant: 'error' });
        }
      } catch (error) {
        console.error('Error updating record:', error);
        enqueueSnackbar('Failed to update record. Please try again.', { variant: 'error' });
      }
    },
    [URL]
  );

  const memoizedValue = useMemo(
    () => ({
      updateAttendance,
    }),
    [updateAttendance]
  );

  return memoizedValue;
}
export function useDeleteOne() {
  const URL = 'http://localhost:5161/api/AddAttendance/Delete';

  const deleteItem = useCallback(
    async (attendanceId, refetch) => {
      try {
        const response = await fetch(`${URL}/${attendanceId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          enqueueSnackbar('Record Deleted', { variant: 'success' });
          if (refetch) {
            await refetch(); // Trigger the refetch of data if refetch function is provided
          }
        } else {
          enqueueSnackbar('Failed to delete record', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        enqueueSnackbar('Error deleting record. Please try again.', { variant: 'error' });
      }
    },
    [URL]
  );

  const memoizedValue = useMemo(
    () => ({
      deleteItem,
    }),
    [deleteItem]
  );

  return memoizedValue;
}
async function fetcherCheck(url) {
  console.log('Fetching URL:', url); // Debug: log the URL
  try {
    const username = sessionStorage.getItem('username');
    const response = await fetcherPost(url, username);
    if (response.code == '500') {
      const error = await response.json();
      throw new Error(error.message || 'Unknown error');
    }
    return await response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
// Import your fetcher function

export function useAddAttendance() {
  const checkAttendanceURL = 'http://localhost:5161/api/AddAttendance/CheckAttendance/check';
  const addOrUpdateAttendanceURL = 'http://localhost:5161/api/AddAttendance/AddOrUpdate';

  // Use SWR to fetch attendance data
  const username = sessionStorage.getItem('username');
  const { isLoading, error, isValidating, mutate } = useSWR(
    [checkAttendanceURL],
    ([url]) => fetcherCheck(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const refetchData = useCallback(async () => {
    await mutate(checkAttendanceURL);
  }, [checkAttendanceURL]);

  const handleSubmit = async (
    e,
    attendance,
    employees,
    selectedDate,
    setSnackbar,
    setIsAddingAttendance
  ) => {
    e.preventDefault();

    // if (Object.keys(attendance).length !== employees.length) {
    //     setSnackbar({ open: true, message: 'Please mark all attendances', severity: 'error' });
    //     return;
    // }

    if (selectedDate > new Date()) {
      setSnackbar({ open: true, message: "Can't add future attendance", severity: 'error' });
      return;
    }

    // const dateToSend = new Date(selectedDate).toLocaleString();
    // console.log('Date being sent:', dateToSend);

    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const formattedDate = date.toISOString().slice(0, 19) + 'Z';

    // Prepare attendance records for submission
    const attendanceRecords = employees.map((employee) => ({
      candidateId: employee.candidateId,
      attendanceId: attendance[employee.candidateId]?.attendanceId,
      attendanceDate: null,
      status: attendance[employee.candidateId]?.status || 'A', // Default to 'Absent' if no status
    }));

    console.log('Data being sent:', JSON.stringify(attendanceRecords));

    try {
      // Check if attendance already exists
      const existingAttendance = await fetcherCheck(checkAttendanceURL);

      if (existingAttendance.code === '200' && existingAttendance.data.length > 0) {
        // Update existing records
        const updateResponse = await fetch(addOrUpdateAttendanceURL, {
          method: 'POST',
          body: JSON.stringify(attendanceRecords),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (updateResponse.ok) {
          const responseData = await updateResponse.json();
          setSnackbar({ open: true, message: responseData.message, severity: 'success' });
        } else {
          const error = await updateResponse.json();
          setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
      } else {
        // Add new records
        const addResponse = await fetch(addOrUpdateAttendanceURL, {
          method: 'POST',
          body: JSON.stringify(attendanceRecords),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (addResponse.ok) {
          const responseData = await addResponse.json();
          setSnackbar({ open: true, message: responseData.message, severity: 'success' });
        } else {
          const error = await addResponse.json();
          setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Error occurred while submitting attendance',
        severity: 'error',
      });
    } finally {
      setTimeout(() => {
        refetchData();
        setIsAddingAttendance(false);
      }, 2000);
    }
  };

  const memoizedValue = useMemo(
    () => ({
      handleSubmit,
      employeesLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [isLoading, error, isValidating, refetchData]
  );

  return memoizedValue;
}
export function useCheckAttendance() {
  const checkAttendanceURL = 'http://localhost:5161/api/AddAttendance/CheckAttendance/check';

  //const dateToSend = selectedDate.toISOString().split('T')[0];
  const username = sessionStorage.getItem('username');
  const urlWithDate = `${checkAttendanceURL}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    checkAttendanceURL,
    () => fetcherCheck(checkAttendanceURL),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const refetchData = useCallback(async () => {
    await mutate(checkAttendanceURL);
  }, [checkAttendanceURL]);

  const memoizedValue = useMemo(
    () => ({
      attendanceData: data?.data || {},
      employeesLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, isLoading, error, isValidating, refetchData]
  );
  console.log('check data', data);

  return memoizedValue;
}
