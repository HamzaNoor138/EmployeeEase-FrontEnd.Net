import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';
import { CompanyScheduleInterview } from 'src/sections/setup/view';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// export function useGetAllCandidates() {
//   const URL = endpoints.CompanyScheduleInterview.getAll;

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
//       CompanyScheduleInterviewList: data?.data.filter((item) => item.statusId !== 2) || [],
//       CompanyScheduleInterviewLoading: isLoading,
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

export function useGetAllOutSourceCandidate() {
  const URL = endpoints.candidate.getAllOutSourceCandidate;
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
      outSourceCandidateList: data?.data || [],
      outSourceCandidateLoading: isLoading,
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

export function useGetCandidateByName() {
  const URL = endpoints.candidate.ByUserName;
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
      CandidateList: data?.data || [],
      CandidateLoading: isLoading,
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

// export function useAddOne() {
//   const URL = endpoints.CompanyScheduleInterview.addOne;

//   const submitFormAdd = async (data) => {
//     const responseData = await fetcherPost(URL, data, {
//       // method: 'POST',
//       // headers: {
//       //   'Content-Type': 'application/json',
//       // },
//       // body: JSON.stringify(data), // Send the form data as JSON
//     });
//     // if (!response.ok) {
//     //   throw new Error('Failed to submit the form.');
//     // }
//     // // Optionally, you can return the response data or handle it as needed
//     // const responseData = await response.json();
//     return responseData;
//   };
//   const { data, error, isValidating } = useSWR(null, submitFormAdd, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });
//   return {
//     submitFormAdd,
//     isSubmitting: isValidating,
//     submitError: error,
//     submitData: data,
//   };
// }

export function getCandidateById() {
  const URL = endpoints.candidate.getCandidateById;

  const CandidateById = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, CandidateById, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    CandidateById,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.candidate.updateOne;

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

export function useDownloadResume() {
  const URL = endpoints.candidate.downloadResume;

  const DownloadResume = async (candidateId) => {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(candidateId),
      headers: { 'Content-Type': 'application/json' },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CandidateResume.pdf`); // use template literal for dynamic filename
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  const { data, error, isValidating } = useSWR(null, DownloadResume, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    DownloadResume,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
