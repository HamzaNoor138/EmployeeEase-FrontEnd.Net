import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCandidateOfferedJob() {
  const URL = endpoints.candidateOfferedJob.getAll;
  // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchOfferData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      candidateOfferedJobList: data?.data || [],
      candidateOfferedJobLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchOfferData,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchOfferData]
  );

  console.log(data);

  return memoizedValue;
}

export function useRenegedOffer() {
  const URL = endpoints.candidateOfferedJob.RenegedOffer;

  const RenegedOffer = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, RenegedOffer, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    RenegedOffer,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useAddCandidateOfferLetter() {
  const URL = endpoints.candidateOfferedJob.addOne;

  const submitCandidateOfferLetter = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitCandidateOfferLetter, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitCandidateOfferLetter,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useCandidateOfferedUpdateOne() {
  const URL = endpoints.candidateOfferedJob.updateOne;

  const submitCandidateOfferFormUpdate = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitCandidateOfferFormUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitCandidateOfferFormUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
