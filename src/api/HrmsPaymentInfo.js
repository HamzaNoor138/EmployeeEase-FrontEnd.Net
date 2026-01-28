import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllHrmsPaymentInfo() {
  const URL = endpoints.hrmsPaymentInfo.getAll;
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
      HrmsAccountList: data?.data,
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

// export function useGetHrmsAccountInfo() {
//   const URL = endpoints.companyPaymentInfo.accountInfo;
//   // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

//   const username = sessionStorage.getItem('username'); // Replace with the actual username

//   const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   const refetchData = useCallback(async () => {
//     await mutate(URL);
//   }, [URL]);

//   const memoizedValue = useMemo(
//     () => ({
//       accountInfoList: data?.data,
//       accountInfoLoading: isLoading,
//       errors: error,
//       validation: isValidating,
//       refetchData,
//       // productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.data, error, isLoading, isValidating, refetchData]
//   );

//   console.log(data);

//   return memoizedValue;
// }

export function useAddOne() {
  const URL = endpoints.hrmsPaymentInfo.addOne;

  const submitFormHrmsPayment = async (data) => {
    const responseData = await fetcherPost(URL, data, {});
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormHrmsPayment, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormHrmsPayment,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.hrmsPaymentInfo.updateOne;

  const HrmsPaymentInfoUpdate = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, HrmsPaymentInfoUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    HrmsPaymentInfoUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
