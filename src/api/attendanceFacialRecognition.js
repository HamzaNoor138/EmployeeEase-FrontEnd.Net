import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints, fetcherFormData } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function GetOutSourcedCompanyEmployee() {
  const URL = endpoints.attendanceFacialRecognition.GetOutSourcedCompanyEmployee;
  const username = sessionStorage.getItem('username');

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchDatta = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      EmployeeList: data?.data || [],
      EmployeeLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchDatta,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchDatta]
  );

  return memoizedValue;
}

export function useRegisterEmployeeOne() {
  const URL = endpoints.attendanceFacialRecognition.RegisterEmployee;

  const RegisterEmployee = async (data) => {
    const responseData = await fetcherFormData(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, RegisterEmployee, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    RegisterEmployee,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useTakeAttendanceOne() {
  const URL = endpoints.attendanceFacialRecognition.TakeAttendance;

  const TakeAttendance = async (data) => {
    const responseData = await fetcherFormData(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, TakeAttendance, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    TakeAttendance,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useDeleteOne() {
  const URL = endpoints.attendanceFacialRecognition.Delete;

  const submitFormDelete = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormDelete, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormDelete,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
