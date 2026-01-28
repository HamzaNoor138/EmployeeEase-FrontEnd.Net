import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      registerCandidate: `${ROOTS.AUTH}/jwt/candidateRegister`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      forgotPassword2: `${ROOTS.AUTH_DEMO}/classic/forgot-password-v2`,
      resetPassword: `${ROOTS.AUTH_DEMO}/classic/reset-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
      verifyV2: `${ROOTS.AUTH_DEMO}/classic/verify-v2`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      registerCompany: `${ROOTS.AUTH_DEMO}/modern/register-company`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD

  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      superDashboard: `${ROOTS.DASHBOARD}/superDashboard`,
      companyDashboard: `${ROOTS.DASHBOARD}/companyDashboardPage`,
      employeeDashboard: `${ROOTS.DASHBOARD}/employeeDashboardPage`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      institute: `${ROOTS.DASHBOARD}/user/institute`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      add: (id) => `${ROOTS.DASHBOARD}/user/add`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    setup: {
      root: `${ROOTS.DASHBOARD}/setup`,
      CompanyPayrollPage: `${ROOTS.DASHBOARD}/setup/companyPayrollPage`,
      RegisterEmployeeFacePage: `${ROOTS.DASHBOARD}/setup/registerEmployeeFacePage`,
      employeeSalaryInfoPage: `${ROOTS.DASHBOARD}/setup/employeeSalaryInfoPage`,
      EmployeeSelfEvaluation: `${ROOTS.DASHBOARD}/setup/EmployeeSelfEvaluationPage`,
      PerformanceEvaluationPage: `${ROOTS.DASHBOARD}/setup/performanceEvaluationPage`,
      FacialAttendancePage: `${ROOTS.DASHBOARD}/setup/facialAttendancePage`,
      BussinessGroupPage: `${ROOTS.DASHBOARD}/setup/BussinessGroupPage`,
      CountryPage: `${ROOTS.DASHBOARD}/setup/CountryPage`,
      JobDescriptionPage: `${ROOTS.DASHBOARD}/setup/jobDescriptionPage`,
      EmployeePage: `${ROOTS.DASHBOARD}/setup/employeePage`,
      ProfessionPage: `${ROOTS.DASHBOARD}/setup/professionPage`,
      DesignationPage: `${ROOTS.DASHBOARD}/setup/designationPage`,
      EducationPage: `${ROOTS.DASHBOARD}/setup/educationPage`,
      CompanyScheduleInterviewPage: `${ROOTS.DASHBOARD}/setup/companyScheduleInterviewPage`,
      CandidateInterviewPage: `${ROOTS.DASHBOARD}/setup/CandidateInterviewPage`,
      CompanyEmployeePage: `${ROOTS.DASHBOARD}/setup/companyEmployeePage`,
      BankPage: `${ROOTS.DASHBOARD}/setup/bankPage`,
      ZohaibPage: `${ROOTS.DASHBOARD}/setup/ZohaibPage`,
      CompanyType: `${ROOTS.DASHBOARD}/setup/CompanyType`,
      Company: `${ROOTS.DASHBOARD}/setup/Company`,
      HrmsPaymentPage: `${ROOTS.DASHBOARD}/setup/hrmsPaymentPage`,
      UserProfilePage: `${ROOTS.DASHBOARD}/setup/userProfilePage`,
      Addcity: `${ROOTS.DASHBOARD}/setup/addCityPage`,
      AddCountry: `${ROOTS.DASHBOARD}/setup/addCountryPage`,
      AddState: `${ROOTS.DASHBOARD}/setup/addStatePage`,
      CreateCandidate: `${ROOTS.DASHBOARD}/setup/CreateNewCandidate`,
      AttendancePage: `${ROOTS.DASHBOARD}/setup/attendancePage`,
      AttendanceCandidatePage: `${ROOTS.DASHBOARD}/setup/attendanceCandidatePage`,
      InterviewPanelPage: `${ROOTS.DASHBOARD}/setup/interviewPanelPage`,
      SkillPage: `${ROOTS.DASHBOARD}/setup/SkillPage`,
      OutSourceCandidatePage: `${ROOTS.DASHBOARD}/setup/OutSourceCandidatePage`,
      PerformanceEvaluationTeamPage: `${ROOTS.DASHBOARD}/setup/performanceEvaluationTeamPage`,
      AddPage: `${ROOTS.DASHBOARD}/setup/AddPage`,
    },

    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
