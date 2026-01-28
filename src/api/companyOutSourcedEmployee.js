import useSWR, { mutate } from 'swr'; // Import the mutate function

import { fetcherPost, endpoints } from 'src/utils/axios';

export function getCompanyOutsourcedEmployeeView() {
  const URL = endpoints.companyOutsourcedEmployee.getCompanyOutsourcedEmployeeView;

  const CompanyOutsourcedEmployeeView = async () => {
    const username = sessionStorage.getItem('username');
    const responseData = await fetcherPost(URL, username);
    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, CompanyOutsourcedEmployeeView, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    CompanyOutsourcedEmployeeView,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}

export function useUpdateOutsourcedEmployee() {
  const URL = endpoints.companyOutsourcedEmployee.updateOutsourcedEmployee;

  const UpdateOutsourcedEmployee = async (data) => {
    const responseData = await fetcherPost(URL, data);

    return responseData;
  };
  const { data, error, isValidating } = useSWR(null, UpdateOutsourcedEmployee, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    UpdateOutsourcedEmployee,
    isSubmitting: isValidating,
    submitError: error,
    submitData: data,
  };
}
