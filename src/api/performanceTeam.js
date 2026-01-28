import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// export function useGetAllPerformanceTeam() {
//   const URL = endpoints.performanceTeam.getAll;

//   // const URL = `http://localhost:5010${endpoints.businessGroup.get}`;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   const refetchData = useCallback(async () => {
//     await mutate(URL);
//   }, [URL]);

//   const memoizedValue = useMemo(
//     () => ({
//       performanceTeamList: data?.data || [],
//       performanceTeamLoading: isLoading,
//       errors: error,
//       validation: isValidating,
//       refetchData,
//       // productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.data, error, isLoading, isValidating, refetchData]
//   );

//   console.log('data is ', data);

//   return memoizedValue;
// }

export function useGetAllPerformanceTeam() {
  const URL = endpoints.performanceTeam.GetAllTeambyName;

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
      performanceTeamList: data?.data.filter((item) => item.employeeStatus !== 2) || [],
      performanceTeamLoading: isLoading,
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

export function useAddTeamOne() {
  const URL = endpoints.performanceTeam.addOne;

  const submitFormAddTeam = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormAddTeam, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAddTeam,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useAddTeamLeadCredential() {
  const URL = endpoints.performanceTeam.teamLeadCredential;

  const submitTeamLeadCredential = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitTeamLeadCredential, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitTeamLeadCredential,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateTeamOne() {
  const URL = endpoints.performanceTeam.updateOne;

  const submitFormUpdateTeam = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormUpdateTeam, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormUpdateTeam,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function GetOneTeamLeadCredential() {
  const URL = endpoints.performanceTeam.GetTeamLeadCredential;

  const GetTeamLeadCredential = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, GetTeamLeadCredential, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    GetTeamLeadCredential,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function UpdateOneTeamLeadCredential() {
  const URL = endpoints.performanceTeam.UpdateTeamLeadCredential;

  const UpdateTeamLeadCredential = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, UpdateTeamLeadCredential, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    UpdateTeamLeadCredential,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
