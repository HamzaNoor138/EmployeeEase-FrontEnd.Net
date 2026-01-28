import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCompanyPaymentInfo() {
  const URL = endpoints.companyPaymentInfo.getAll;
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

export function useAddOne() {
  const URL = endpoints.companyPaymentInfo.addOne;

  const submitFormCompanyPayment = async (data) => {
    const responseData = await fetcherPost(URL, data, {});
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormCompanyPayment, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormCompanyPayment,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.companyPaymentInfo.updateOne;

  const CompanyPaymentInfoUpdate = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, CompanyPaymentInfoUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    CompanyPaymentInfoUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
