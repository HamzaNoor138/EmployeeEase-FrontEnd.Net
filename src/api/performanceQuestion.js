import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// export function useGetAllPerformanceQuestions() {
//   const URL = endpoints.performanceQuestion.getPerformanceQuestionView;

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
//       performanceQuestionsList: data?.data || [],
//       performanceQuestionsLoading: isLoading,
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

export function useGetAllPerformanceQuestions() {
  const URL = endpoints.performanceQuestion.getPerformanceQuestionView;

  const PerformanceQuestions = async () => {
    const responseData = await fetcher(URL);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, PerformanceQuestions, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    PerformanceQuestions,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
