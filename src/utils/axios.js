import axios from 'axios';

import { SERVICE_API } from 'src/config-global';
import { getAuthToken } from './storage-available';
import { CompanyScheduleInterview } from 'src/sections/setup/view';
import PerformanceEvaluationTeamPage from 'src/pages/dashboard/setup/performanceEvaluationTeamPage';

// ----------------------------------------------------------------------
// const axiosInstance = axios.create({ baseURL: HOST_API });
// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

const axiosInstance = axios.create({ baseURL: SERVICE_API });

axiosInstance.interceptors.request.use((config) => {
  const authToken = getAuthToken();

  // if (authToken) {
  //   const parsedTokenData = JSON.parse(tokenData);
  //   config.headers.Authorization = `Bearer ${parsedTokenData.access_token}`;
  // }
  if (authToken) {
    try {
      const parsedTokenData = authToken;
      console.log(parsedTokenData);
      config.headers.Authorization = `Bearer ${parsedTokenData}`;
    } catch (error) {
      console.error('Error parsing token data:', error);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.error('Error:', error); // Log the error for debugging
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);
export default axiosInstance;
// ----------------------------------------------------------------------
export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};
// export const fetcherPost = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args];
//   const res = await axiosInstance.post(url, { ...config });
//   return res.data;
// };

export const fetcherBinary = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  // Set responseType to 'blob' to handle binary data
  const responseConfig = {
    ...config,
    responseType: 'blob', // This ensures Axios treats the response as binary data
  };

  const res = await axiosInstance.get(url, responseConfig);
  return res.data; // This will be a Blob for binary responses
};

export const fetcherPost = async (url, data, config = {}) => {
  try {
    const res = await axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        ...config.headers, // You can override default headers if needed
      },
      ...config, // You can pass additional Axios configuration options
    });

    return res.data;
  } catch (error) {
    // Handle errors if needed
    console.error('Error in fetcherPost:', error);
    throw error; // Rethrow the error or handle it according to your needs
  }
};

export const fetcherFormData = async (url, formData, config = {}) => {
  try {
    const res = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        ...config.headers, // You can override default headers if needed
      },
      ...config, // You can pass additional Axios configuration options
    });

    return res.data;
  } catch (error) {
    // Handle errors if needed
    console.error('Error in fetcherFormData:', error);
    throw error; // Rethrow the error or handle it according to your needs
  }
};

export const getHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// export const fetcher12 = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args];

//   // Check if config is defined and if it has a method property
//   if (config && config.method) {
//     const authToken = getAuthToken();
//     if (authToken) {
//       try {
//         const parsedTokenData = JSON.parse(authToken);
//         config.headers.Authorization = `Bearer ${parsedTokenData.access_token}`;
//       } catch (error) {
//         console.error('Error parsing token data:', error);
//       }
//     }
//   }

//   const res = await axiosInstance({
//     method: 'post',  // or 'get', 'put', 'delete', etc.
//     url,
//     data: config.data,  // include the data if it's a POST request
//     headers: config.headers,
//   });

//   return res.data;
// };

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  setup: {
    list: '/api/Affiliation/GetAll',
    edit: 'https://lmdcstaging.thetowertech.com/api/Affiliation/Update',
    add: 'https://lmdcstaging.thetowertech.com/api/Affiliation/AddOne',
  },

  companyType: {
    getAll: '/api/CompanyType/getAll',
    addOne: '/api/CompanyType/add',
    updateOne: '/api/CompanyType/update',
  },

  dashboard: {
    superDashboard: '/api/HRMSDashboard/GetHrmsDashboardData',
    companyDashboard: '/api/HRMSDashboard/GetCompanyDashboardData',
    EmployeeDashboard: '/api/HRMSDashboard/GetEmployeeDashboardData',
  },

  addCountry: {
    getAll: '/api/country/getAll',
    addOne: '/api/country/add',
    updateOne: '/api/country/update',
  },

  profession: {
    getAll: '/api/profession/getEduProfView',
    addOne: '/api/profession/add',
    updateOne: '/api/profession/update',
  },

  designation: {
    getAll: '/api/designation/getAll',
    addOne: '/api/designation/add',
    updateOne: '/api/designation/update',
  },

  education: {
    getAll: '/api/education/getAll',
    addOne: '/api/education/add',
    updateOne: '/api/education/update',
  },

  bank: {
    getAll: '/api/bank/getAll',
    addOne: '/api/bank/add',
    updateOne: '/api/bank/update',
  },

  employee: {
    getAll: '/api/employee/getAll',
    addOne: '/api/employee/add',
    updateOne: '/api/employee/update',
  },

  jobDescripton: {
    getAll: '/api/JobDescription/getAll',
    addOne: '/api/JobDescription/add',
    getByUsername: 'api/JobDescription/getByUsername/',
    updateOne: '/api/JobDescription/update',
    filterCandidate: '/api/JobDescription/FilterCandidates',
  },

  addState: {
    getAll: '/api/state/getAll',
    addOne: '/api/state/add',
    updateOne: '/api/state/update',
  },
  addCity: {
    getAll: '/api/city/getAll',
    addOne: '/api/city/add',
    updateOne: '/api/city/update',
  },
  skill: {
    getAll: '/api/Skill/getAll',
    addOne: '/api/Skill/add',
    updateOne: '/api/Skill/update',
  },

  userProfile: {
    getAllUsername: '/api/UserProfile/GetAllExistingUsername',
  },
  candidate: {
    getAll: '/api/Candidate/getAll',
    addOne: '/api/Candidate/add',
    updateOne: '/api/Candidate/update',
    downloadResume: 'http://localhost:5161/api/Candidate/DownloadResume',
    ByUserName: '/api/Candidate/getCandidateByUserName',
    getAllOutSourceCandidate: '/api/Candidate/getOutSourcedEmployeeDetail',
    getCandidateById: '/api/Candidate/getCandidateById',
  },
  company: {
    getAll: '/api/Company/getCompanyView',
    addPublic: '/api/Company/addPublic',
    addOne: '/api/Company/add',
    updateOne: '/api/Company/update',
    ByUserName: '/api/Company/getCompanyByUsername',
  },

  CompanyScheduleInterview: {
    getAll: '/api/ScheduleInterview/GetCompanyScheduleInterviewView',
    addOne: '/api/ScheduleInterview/add',
    updateOne: '/api/ScheduleInterview/update',
  },
  CandidateScheduleInterview: {
    getAll: '/api/ScheduleInterview/GetCandidateScheduleInterviewView',
    addOne: '/api/ScheduleInterview/add',
    updateOne: '/api/ScheduleInterview/CandidateScheduleupdate',
  },
  skill: {
    getAll: '/api/skill/getAll',
    addOne: '/api/skill/add',
    updateOne: '/api/skill/update',
  },
  InterviewQuestion: {
    getAll: '/api/InterviewQuestion/getAll',
  },

  InterviewFeedback: {
    getAll: '/api/InterviewFeedBack/getAll',
    addOne: '/api/InterviewFeedBack/add',
    updateOne: '/api/InterviewFeedBack/update',
  },

  interviewPanel: {
    getAll: '/api/InterviewPanel/getAll',
    addOne: '/api/InterviewPanel/add',
    updateOne: '/api/InterviewPanel/update',
    getByUsername: '/api/InterviewPanel/getByUsername',
  },

  CompanyEmployee: {
    getAll: '/api/CompanyEmployee/getAll',
    addOne: '/api/CompanyEmployee/add',
    updateOne: '/api/CompanyEmployee/update',
    getView: '/api/CompanyEmployee/GetCompanyEmployeesView',
    getInternalView: '/api/CompanyEmployee/GetCompanyInternalEmployeesView',
    downloadSampleExcel: '/api/FileTemplates/DownloadExcelFile',
    uploadExcel: '/api/CompanyEmployee/UploadExcelFile/upload',
    GetCompanyOnboardingEmployee: '/api/CompanyEmployee/GetCompanyOnboardingEmployee',
    ConfirmEmployeeJoined: '/api/CompanyEmployee/ConfirmEmployeeJoined',
  },

  candidateOfferedJob: {
    getAll: '/api/CandidateOfferedJob/getAll',
    addOne: '/api/CandidateOfferedJob/add',
    updateOne: '/api/CandidateOfferedJob/update',
    RenegedOffer: '/api/CandidateOfferedJob/RenegedOffer',
  },

  performanceQuestion: {
    getPerformanceQuestionView: '/api/PerformanceFeedbackQuestion/getPerformanceQuestionView',
    getAll: '/api/PerformanceFeedbackQuestion/getAll',
    addOne: '/api/PerformanceFeedbackQuestion/add',
    updateOne: '/api/PerformanceFeedbackQuestion/update',
  },

  performanceWeights: {
    getAll: '/api/PerformanceQuestionWeightage/GetWeightages',
    addOne: '/api/PerformanceQuestionWeightage/add',
    updateOne: '/api/PerformanceQuestionWeightage/UpdateWeightages',
  },

  selfPerformanceEvaluation: {
    getSelfEvaluationRecord: '/api/EmployeeSelfEvaluation/getSelfEvaluationRecord',
    addOne: '/api/EmployeeSelfEvaluation/add',
    updateOne: '/api/EmployeeSelfEvaluation/update',
    GetEmployeePastEvaluationRecords:
      '/api/EmployeeSelfEvaluation/GetEmployeePastEvaluationRecords',
  },

  PerformanceEvaluation: {
    getAll: '/api/PerformanceFeedback/GetWeightages',
    getTeamLeadEvaluationRecords: '/api/PerformanceFeedback/getTeamLeadEvaluationRecords',
    addOne: '/api/PerformanceFeedback/add',
    updateOne: '/api/PerformanceFeedback/update',
    getEmployeeFormData: '/api/PerformanceFeedback/getEmployeeEvaluationFormData',
    getSelfEvaluationRecord: '/api/PerformanceFeedback/getSelfEvaluationRecord',
    getAllPerformanceSubmissions: '/api/PerformanceFeedback/getAllPerformanceSubmissions',
    getAllCurrentEvaluationRecords: '/api/PerformanceFeedback/getAllCurrentEvaluationRecords',
    getEmployeePerformanceReportData: '/api/PerformanceFeedback/getEmployeePerformanceReportData',
  },

  performanceTeam: {
    getAll: '/api/PerformanceEvaluationTeam/getAll',
    addOne: '/api/PerformanceEvaluationTeam/add',
    updateOne: '/api/PerformanceEvaluationTeam/update',
    getView: '/api/PerformanceEvaluationTeam/GetCompanyEmployeesView',
    teamLeadCredential: '/api/PerformanceEvaluationTeam/AddTeamLeadCredential',
    GetAllTeambyName: '/api/PerformanceEvaluationTeam/GetAllTeambyName',
    GetTeamLeadCredential: '/api/PerformanceEvaluationTeam/GetTeamLeadCredential',
    UpdateTeamLeadCredential: '/api/PerformanceEvaluationTeam/UpdateTeamLeadCredential',
  },

  auth: {
    login: '/api/Login',
  },
  attendance: {
    getByUsername: '/api/AddAttendance/getByUsername',
  },

  attendanceFacialRecognition: {
    GetOutSourcedCompanyEmployee: '/api/AttendanceFacialRecognition/GetOutSourcedCompanyEmployee',
    RegisterEmployee: '/api/FacialRecognition/RegisterEmployee',
    Delete: '/api/AttendanceFacialRecognition/Delete',
    TakeAttendance: '/api/FacialRecognition/TakeAttendance',
  },

  companyOutsourcedEmployee: {
    getCompanyOutsourcedEmployeeView:
      '/api/CompanyOutSourcedEmployee/getCompanyOutSourcedEmployeeView',

    updateOutsourcedEmployee: '/api/CompanyOutSourcedEmployee/updateOutsourcedEmployee',
  },

  companyPaymentInfo: {
    getAll: '/api/CompanyPaymentInfo/getAll',
    addOne: '/api/CompanyPaymentInfo/add',
    updateOne: '/api/CompanyPaymentInfo/update',
    accountInfo: '/api/CompanyPaymentInfo/getCompanyAccountByName',
  },

  employeePaymentInfo: {
    getAll: '/api/EmployeePaymentInfo/getAll',
    addOne: '/api/EmployeePaymentInfo/add',
    updateOne: '/api/EmployeePaymentInfo/update',
    accountInfo: '/api/EmployeePaymentInfo/getEmployeeAccountByName',
  },

  hrmsPaymentInfo: {
    getAll: '/api/HRMSPaymentInfo/getAll',
    addOne: '/api/HRMSPaymentInfo/add',
    updateOne: '/api/HRMSPaymentInfo/update',
  },

  hrmsEmployeePayment: {
    getHrmsPaymentView: '/api/HRMSToEmployeePayment/getHrmsPaymentView',
  },

  EmployeeSalaryInfo: {
    getEmployeeSalaryinfoView: '/api/EmployeeSalaryInfo/getEmployeeSalaryinfoView',
    getEmployeeSalarySlip: '/api/EmployeeSalaryInfo/getEmployeeSalarySlip',
  },

  companyPayrollInfo: {
    getAll: '/api/SalaryDistribute/getAll',
    addList: '/api/SalaryDistribute/addList',
    updateOne: '/api/SalaryDistribute/update',
    getCompanyPayrollView: '/api/SalaryDistribute/getCompanyPayrollView',
    getInvoiceDetailsView: '/api/SalaryDistribute/GetInvoiceDetailsView',
  },
};
