import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useAddWeightsOne() {
  const URL = endpoints.performanceWeights.addOne;

  const submitFormAddWeight = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormAddWeight, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAddWeight,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

// export function useGetQuestionWeights() {
//   const URL = endpoints.performanceWeights.getAll;

//   const username = sessionStorage.getItem('username');

//   const GetQuestionWeights = async () => {
//     const responseData = await fetcherPost(URL, username);

//     return responseData;
//   };
//   const { data, error, isValidating } = useSWR(null, GetQuestionWeights, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });
//   return {
//     GetQuestionWeights,
//     isSubmitting: isValidating,
//     submitError: error,
//     submitData: data,
//   };
// }

// export function useGetQuestionWeights() {
//   const URL = endpoints.performanceWeights.getAll;

//   const username = sessionStorage.getItem('username');

//   const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   const refetchData = useCallback(async () => {
//     await mutate(URL);
//   }, [URL]);

//   const memoizedValue = useMemo(
//     () => ({
//       QuestionWeightList: data?.data || [],
//       QuestionWeightLoading: isLoading,
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

export function useGetQuestionWeights() {
  const URL = endpoints.performanceWeights.getAll;
  const username = sessionStorage.getItem('username');
  const GetQuestionWeights = async () => {
    const responseData = await fetcherPost(URL, username);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, GetQuestionWeights, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    GetQuestionWeights,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateWeights() {
  const URL = endpoints.performanceWeights.updateOne;

  const updateWeightages = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, updateWeightages, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    updateWeightages,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
