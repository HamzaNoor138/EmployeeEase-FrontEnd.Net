import useSWR, { mutate } from 'swr'; // Import the mutate function
import { useMemo, useCallback } from 'react';

import { fetcher, fetcherPost, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function useGetTeamLeadEvaluationRecords() {
  const URL = endpoints.PerformanceEvaluation.getTeamLeadEvaluationRecords;
  const username = sessionStorage.getItem('username');

  const TeamLeadEvaluationRecords = async (data) => {
    const responseData = await fetcherPost(URL, username, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, TeamLeadEvaluationRecords, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    TeamLeadEvaluationRecords,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useGetAllCurrentEvaluationRecords() {
  const URL = endpoints.PerformanceEvaluation.getAllCurrentEvaluationRecords;
  const username = sessionStorage.getItem('username');

  const AllCurrentEvaluationRecords = async (data) => {
    const responseData = await fetcherPost(URL, username, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, AllCurrentEvaluationRecords, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    AllCurrentEvaluationRecords,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useGetAllEvaluationRecords() {
  const URL = endpoints.PerformanceEvaluation.getAllPerformanceSubmissions;
  const username = sessionStorage.getItem('username');

  const AllEvaluationRecords = async (data) => {
    const responseData = await fetcherPost(URL, username);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, AllEvaluationRecords, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    AllEvaluationRecords,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useGetSelfEvaluationRecordPost() {
  const URL = endpoints.PerformanceEvaluation.getSelfEvaluationRecord;

  const GetSelfEvaluationRecordPost = async (data) => {
    const responseData = await fetcherPost(URL, data, {});

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, GetSelfEvaluationRecordPost, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    GetSelfEvaluationRecordPost,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useAddPerformanceEvaluation() {
  const URL = endpoints.PerformanceEvaluation.addOne;

  const submitFormAddEvaluation = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, submitFormAddEvaluation, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    submitFormAddEvaluation,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useGetEmployeeFormData() {
  const URL = endpoints.PerformanceEvaluation.getEmployeeFormData;
  let date;
  const GetEmployeeFormData = async (data) => {
    if (data.date == null) {
      date = new Date().toISOString().split('T')[0];
    } else {
      date = data.date;
    }

    const responseData = await fetcherPost(
      URL,
      { employeeId: data.employeeId, date },
      {
        // method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(data), // Send the form data as JSON
      }
    );
    // if (!response.ok) {
    //   throw new Error('Failed to submit the form.');
    // }
    // // Optionally, you can return the response data or handle it as needed
    // const responseData = await response.json();
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, GetEmployeeFormData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    GetEmployeeFormData,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function usegetEmployeePerformanceReportData() {
  const URL = endpoints.PerformanceEvaluation.getEmployeePerformanceReportData;

  const EmployeePerformanceReportData = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, EmployeePerformanceReportData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    EmployeePerformanceReportData,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateEmployeeFormData() {
  const URL = endpoints.PerformanceEvaluation.updateOne;

  const UpdateEmployeeFormData = async (data) => {
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
  const { data, error, isValidating } = useSWR(null, UpdateEmployeeFormData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    UpdateEmployeeFormData,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
