import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints, fetcherBinary, fetcherFormData } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useAddOne() {
  const URL = endpoints.CompanyEmployee.addOne;

  const submitFormAdd = async (data) => {
    data.companyUsername = sessionStorage.getItem('username');
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

export function useGetAllCompanyEmployee() {
  const URL = endpoints.CompanyEmployee.getView;
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
      companyEmployeeList: data?.data.filter((item) => item.employeeStatus !== 2) || [],
      companyEmployeeLoading: isLoading,
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

export function useGetAllInternalCompanyEmployee() {
  const URL = endpoints.CompanyEmployee.getInternalView;
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
      companyInternalEmployeeList: data?.data.filter((item) => item.employeeStatus !== 2) || [],
      companyEmployeeLoading: isLoading,
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

export function useGetOnBoardingEmployee() {
  const URL = endpoints.CompanyEmployee.GetCompanyOnboardingEmployee;

  const username = sessionStorage.getItem('username'); // Replace with the actual username

  const GetOnBoardingEmployee = async (data) => {
    const responseData = await fetcherPost(URL, username);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, GetOnBoardingEmployee, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    GetOnBoardingEmployee,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useConfirmEmployeeJoined() {
  const URL = endpoints.CompanyEmployee.ConfirmEmployeeJoined;

  const ConfirmEmployeeJoined = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, ConfirmEmployeeJoined, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    ConfirmEmployeeJoined,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUploadExcelOne() {
  const URL = endpoints.CompanyEmployee.uploadExcel;

  const submitExcel = async (data) => {
    const responseData = await fetcherFormData(URL, data, {
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
  const { data, error, isValidating } = useSWR(null, submitExcel, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitExcel,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useDownloadExcelSample() {
  const URL = endpoints.CompanyEmployee.downloadSampleExcel;

  const downloadExcelSample = async () => {
    try {
      // Use the binary fetcher for downloading the Excel file
      const blob = await fetcherBinary(URL, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      let fileName = 'CompanyEmployeeExcelTemplate.xlsx';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return { downloadExcelSample };
}

export function useEmployeeUpdateOne() {
  const URL = endpoints.CompanyEmployee.updateOne;

  const submitFormEmployeeUpdate = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormEmployeeUpdate, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormEmployeeUpdate,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
