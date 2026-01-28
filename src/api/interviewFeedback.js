import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllInterviewFeedback() {
  const URL = endpoints.InterviewFeedback.getByUsername;
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
      interviewFeedbackList: data?.data.filter((item) => item.statusId !== 2) || [],
      interviewFeedbackListLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  return memoizedValue;
}

export function useAddInterviewFeedbackOne() {
  const URL = endpoints.InterviewFeedback.addOne;

  const submitInterviewFeedbackAdd = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitInterviewFeedbackAdd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitInterviewFeedbackAdd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateInterviewFeedback() {
  const URL = endpoints.InterviewFeedback.updateOne;

  const submitInterviewFeedbackUpdate = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitInterviewFeedbackUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitInterviewFeedbackUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
