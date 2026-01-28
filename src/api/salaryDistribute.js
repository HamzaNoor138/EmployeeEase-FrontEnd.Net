import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCompanyPayrollInfo() {
  const URL = endpoints.companyPayrollInfo.getCompanyPayrollView;

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
      companyPayrollList: data?.data || [],
      companyPayrollLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  return memoizedValue;
}

export function useGetCompanyAccountInfo() {
  const URL = endpoints.companyPaymentInfo.accountInfo;
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
      accountInfoList: data?.data,
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

export function GetInvoiceDetailsView() {
  const URL = endpoints.companyPayrollInfo.getInvoiceDetailsView;

  const InvoiceDetails = async (data) => {
    const responseData = await fetcherPost(URL, data);
    return responseData;
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

export function useAddList() {
  const URL = endpoints.companyPayrollInfo.addList;

  const CompanyPaymentInfoAddList = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, CompanyPaymentInfoAddList, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    CompanyPaymentInfoAddList,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
