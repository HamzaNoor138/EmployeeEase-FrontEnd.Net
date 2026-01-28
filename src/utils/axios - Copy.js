import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

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
  addCountry: {
    getAll: '/api/country/getAll',
  },

  employee: {
    getAll: '/api/employee/getAll',
  },

  profession: {
    getAll: '/api/profession/getAll',
  },

  designation: {
    getAll: '/api/designation/getAll',
  },

  education: {
    getAll: '/api/education/getAll',
  },

  bank: {
    getAll: '/api/bank/getAll',

    addState: {
      getAll: '/api/country/getAll',
    },
    addCity: {
      getAll: '/api/country/getAll',
    },

    companyType: {
      getAll: '/api/CompanyType/getAll',
    },
    company: {
      getAll: '/api/Company/getCompanyView',
    },
    interviewPanel: {
      getAll: '/api/InterviewPanel/getAll',
    },
    attendance: {
      getByUsername: '/api/AddAttendance/getByUsername',
    },
    skill: {
      getAll: '/api/Skill/getAll',
    },
  },
};
