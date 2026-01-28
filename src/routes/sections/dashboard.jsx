import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
//const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserinstitutePage = lazy(() => import('src/pages/dashboard/user/institute'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const UserAddPage = lazy(() => import('src/pages/dashboard/user/add'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
const CompanyPayroll = lazy(() => import('src/pages/dashboard/setup/companyPayrollPage'));
const RegisterEmployeeFacePage = lazy(() =>
  import('src/pages/dashboard/setup/registerEmployeeFacePage')
);
const EmployeeSelfEvaluationPage = lazy(() =>
  import('src/pages/dashboard/setup/EmployeeSelfEvaluationPage')
);
const PerformanceEvaluationPage = lazy(() =>
  import('src/pages/dashboard/setup/performanceEvaluationPage')
);
const FacialAttendancePage = lazy(() => import('src/pages/dashboard/setup/facialAttendancePage'));
const HrmsPaymentPage = lazy(() => import('src/pages/dashboard/setup/hrmsPaymentPage'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/setup/userProfilePage'));
const PerformanceEvaluationTeamPage = lazy(() =>
  import('src/pages/dashboard/setup/performanceEvaluationTeamPage')
);

const SuperDashboard = lazy(() => import('src/pages/dashboard/setup/superDashboard'));
const CompanyDashboardPage = lazy(() => import('src/pages/dashboard/setup/companyDashboardPage'));
const EmployeeDashboardPage = lazy(() => import('src/pages/dashboard/setup/employeeDashboardPage'));
const AddPage = lazy(() => import('src/pages/dashboard/setup/addPage'));

const InterviewPanelPage = lazy(() => import('src/pages/dashboard/setup/interviewPanelPage'));

const EmployeePage = lazy(() => import('src/pages/dashboard/setup/employeePage'));
const ProfessionPage = lazy(() => import('src/pages/dashboard/setup/professionPage'));
const DesignationPage = lazy(() => import('src/pages/dashboard/setup/designationPage'));
const EducationPage = lazy(() => import('src/pages/dashboard/setup/educationPage'));
const BankPage = lazy(() => import('src/pages/dashboard/setup/bankPage'));

const CompanyType = lazy(() => import('src/pages/dashboard/setup/CompanyType'));

const Company = lazy(() => import('src/pages/dashboard/setup/Company'));
const Country = lazy(() => import('src/pages/dashboard/setup/addCountryPage'));
// ----------------------------------------------------------------------

const AddStatePage = lazy(() => import('src/pages/dashboard/setup/addStatePage'));
const AddCityPage = lazy(() => import('src/pages/dashboard/setup/addCityPage'));
const SkillPage = lazy(() => import('src/pages/dashboard/setup/skillPage'));
const JobDescriptionPage = lazy(() => import('src/pages/dashboard/setup/jobDescriptionPage'));

const EmployeeSalaryInfoPage = lazy(() =>
  import('src/pages/dashboard/setup/employeeSalaryInfoPage')
);

const OutSourceCandidatePage = lazy(() =>
  import('src/pages/dashboard/setup/outSourceCandidatePage')
);
const CreateNewCandidate = lazy(() => import('src/pages/dashboard/setup/CreateNewCandidate'));
const CandidateInterviewPage = lazy(() => import('src/pages/dashboard/setup/CandidateInterview'));
const CompanyEmployeePage = lazy(() => import('src/pages/dashboard/setup/CompanyEmployeePage'));
const AttendancePage = lazy(() => import('src/pages/dashboard/setup/attendancePage'));
const AttendanceCandidatePage = lazy(() =>
  import('src/pages/dashboard/setup/attendanceCandidatePage')
);
const CompanyScheduleInterviewPage = lazy(() =>
  import('src/pages/dashboard/setup/CompanyScheduleInterviewPage')
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'SuperDashboard', element: <SuperDashboard /> },
      { path: 'CompanyDashboardPage', element: <CompanyDashboardPage /> },
      { path: 'EmployeeDashboardPage', element: <EmployeeDashboardPage /> },

      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'add', element: <UserAddPage /> },
          { path: 'account', element: <UserAccountPage /> },
          { path: 'institute', element: <UserinstitutePage /> },
        ],
      },
      {
        path: 'setup',
        children: [
          { path: 'companyPayrollPage', element: <CompanyPayroll /> },
          { path: 'facialAttendancePage', element: <FacialAttendancePage /> },
          { path: 'registerEmployeeFacePage', element: <RegisterEmployeeFacePage /> },
          { path: 'performanceEvaluationPage', element: <PerformanceEvaluationPage /> },
          { path: 'EmployeeSelfEvaluationPage', element: <EmployeeSelfEvaluationPage /> },

          { path: 'EmployeeSalaryInfoPage', element: <EmployeeSalaryInfoPage /> },

          { path: 'EmployeePage', element: <EmployeePage /> },
          { path: 'ProfessionPage', element: <ProfessionPage /> },
          { path: 'DesignationPage', element: <DesignationPage /> },
          { path: 'EducationPage', element: <EducationPage /> },
          { path: 'BankPage', element: <BankPage /> },

          { path: 'CompanyType', element: <CompanyType /> },
          { path: 'Company', element: <Company /> },
          { path: 'AttendancePage', element: <AttendancePage /> },
          { path: 'AttendanceCandidatePage', element: <AttendanceCandidatePage /> },
          { path: 'JobDescriptionPage', element: <JobDescriptionPage /> },
          { path: 'CreateNewCandidate', element: <CreateNewCandidate /> },
          { path: 'CandidateInterviewPage', element: <CandidateInterviewPage /> },
          { path: 'CompanyScheduleInterviewPage', element: <CompanyScheduleInterviewPage /> },
          { path: 'CompanyEmployeePage', element: <CompanyEmployeePage /> },
          { path: 'InterviewPanelPage', element: <InterviewPanelPage /> },

          { path: 'HrmsPaymentPage', element: <HrmsPaymentPage /> },
          { path: 'UserProfilePage', element: <UserProfilePage /> },
          { path: 'PerformanceEvaluationTeamPage', element: <PerformanceEvaluationTeamPage /> },
          { path: 'AddPage', element: <AddPage /> },
          { path: 'SkillPage', element: <SkillPage /> },
          { path: 'OutSourceCandidatePage', element: <OutSourceCandidatePage /> },
          { path: 'addCountryPage', element: <Country /> },
          { path: 'addStatePage', element: <AddStatePage /> },
          { path: 'addCityPage', element: <AddCityPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
