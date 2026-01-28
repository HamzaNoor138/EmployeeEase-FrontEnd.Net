import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCountry() {
  const URL = endpoints.addCountry.getAll;
  // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  //hello

  const refetchDataa = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      countryList: data?.data.filter((item) => item.statusId !== 2) || [],
      countryLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchDataa,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchDataa]
  );
  console.log(data);

  return memoizedValue;
}

export function useAddOnes() {
  const URL = endpoints.addCountry.addOne;

  const submitFormAdd = async (data) => {
    const responseData = await fetcherPost(URL, data, {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify(data), // Send the form data as JSON
    });
    // if (!response.ok) {
    //   throw new Error('Failed to submit the form.');
    // }
    // // Optionally, you can return the response data or handle it as needed
    // const responseData = await response.json();
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormAdd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAdd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOnes() {
  const URL = endpoints.addCountry.updateOne;

  const submitFormUpdate = async (data) => {
    const responseData = await fetcherPost(URL, data, {
      // method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify(data), // Send the form data as JSON
    });
    // if (!response.ok) {
    //   throw new Error('Failed to submit the form.');
    // }
    // // Optionally, you can return the response data or handle it as needed
    // const responseData = await response.json();
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
