import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';
import { CompanyScheduleInterview } from 'src/sections/setup/view';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetAllCompanyScheduleInterview() {
  const URL = endpoints.CompanyScheduleInterview.getAll;

  // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

  const username = sessionStorage.getItem('username');
  const userType = sessionStorage.getItem('userType');

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    () => fetcherPost(URL, { username, userType }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      CompanyScheduleInterviewList: data?.data[0].scheduledInterviews || [],
      ApprovalStatusCountList: data?.data[0].approvalStatusCounts || [],
      CompanyScheduleInterviewLoading: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
      // productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.data, error, isLoading, isValidating, refetchData]
  );

  console.log('data is ', data);

  return memoizedValue;
}

export function useAddScheduleInterviewOne() {
  const URL = endpoints.CompanyScheduleInterview.addOne;

  const submitScheduleInterviewAdd = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitScheduleInterviewAdd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitScheduleInterviewAdd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.CompanyScheduleInterview.updateOne;

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
