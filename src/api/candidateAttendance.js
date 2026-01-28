import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback, useState } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

export function getAllCandidateAttendanceRecord() {
  const username = sessionStorage.getItem('username');
  const URL = `http://localhost:5161/api/AddAttendance/getAllCandidateAttendanceRecord`;

  const { data, isLoading, error, isValidating } = useSWR(URL, () => fetcherPost(URL, username), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const refetchData = useCallback(async () => {
    await mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      CandidateDataView: data?.data || [],
      pendingView: isLoading,
      errors: error,
      validation: isValidating,
      refetchData,
    }),
    [data?.data, isLoading, error, isValidating, refetchData]
  );

  return memoizedValue;
}
