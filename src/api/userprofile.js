import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

export function UseGetAllUserProfileNames() {
  const URL = endpoints.userProfile.getAllUsername;

  const getAllUsernames = async (data) => {
    const responseData = await fetcher(URL);

    return responseData.data;
  };
  const { data, error, isValidating } = useSWR(null, getAllUsernames, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    getAllUsernames,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
