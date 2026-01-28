import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetCompanyByName() {
  const URL = endpoints.company.ByUserName;
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
      CompanyList: data?.data || [],
      CompanyLoading: isLoading,
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

export function useGetAllCompanies() {
  const URL = endpoints.company.getAll;

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
      companyList: data?.data.filter((item) => item.statusId !== 2) || [],
      companyLoading: isLoading,
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

export function useAddOne() {
  const URL = endpoints.company.addOne;

  const submitFormAdd = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormAdd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAdd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useAddPublic() {
  const URL = endpoints.company.addPublic;

  const submitFormAdd = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, submitFormAdd, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAdd,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOne() {
  const URL = endpoints.company.updateOne;

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
