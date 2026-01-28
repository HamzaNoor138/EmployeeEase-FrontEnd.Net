import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllEmployeePaymentInfo() {
  const URL = endpoints.employeePaymentInfo.getAll;
  // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      educationList: data?.data.filter((item) => item.statusId !== 2) || [],
      educationLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  return memoizedValue;
}

export function useGetEmployeeAccountInfo() {
  const URL = endpoints.employeePaymentInfo.accountInfo;
  // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

  const username = sessionStorage.getItem('username'); // Replace with the actual username

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      EmployeeaccountInfoList: data?.data,
      accountInfoLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  console.log(data);

  return memoizedValue;
}

export function useAddOne() {
  const URL = endpoints.employeePaymentInfo.addOne;

  const submitFormEmployeePayment = async (data) => {
    const responseData = await fetcherPost(URL, data, {});
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormEmployeePayment, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormEmployeePayment,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.employeePaymentInfo.updateOne;

  const employeePaymentInfoUpdate = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, employeePaymentInfoUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    employeePaymentInfoUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
