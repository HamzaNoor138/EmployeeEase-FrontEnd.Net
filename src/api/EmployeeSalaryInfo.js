import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllEmployeeSalaryInfo() {
  const URL = endpoints.EmployeeSalaryInfo.getEmployeeSalaryinfoView;

  const username = sessionStorage.getItem('username');

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      EmployeeSalaryinfoList: data?.data || [],
      educationLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  return memoizedValue;
}

export function GetInvoiceDetailsView() {
  const URL = endpoints.EmployeeSalaryInfo.getEmployeeSalarySlip;

  const InvoiceDetails = async (data) => {
    const responseData = await fetcherPost(URL, data, {});
    return responseData.data[0];
  };
  const { data, error, isValidating } = useSWR(null, InvoiceDetails, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    InvoiceDetails,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
