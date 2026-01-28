import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetSelfEvaluationRecord() {
  const URL = endpoints.selfPerformanceEvaluation.getSelfEvaluationRecord;

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
      selfEvaluationRecord: data || [],
      selfEvaluationRecordLoading: isLoading,
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

export function GetEmployeePastEvaluationRecords() {
  const URL = endpoints.selfPerformanceEvaluation.GetEmployeePastEvaluationRecords;

  const username = sessionStorage.getItem('username');

  const EmployeePastEvaluationRecords = async () => {
    const responseData = await fetcherPost(URL, username);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, EmployeePastEvaluationRecords, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    EmployeePastEvaluationRecords,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useAddSelfEvaluationRecord() {
  const URL = endpoints.selfPerformanceEvaluation.addOne;

  const AddSelfEvaluationRecord = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, AddSelfEvaluationRecord, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    AddSelfEvaluationRecord,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateSelfEvaluationRecord() {
  const URL = endpoints.selfPerformanceEvaluation.updateOne;

  const UpdateSelfEvaluationRecord = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, UpdateSelfEvaluationRecord, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    UpdateSelfEvaluationRecord,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
