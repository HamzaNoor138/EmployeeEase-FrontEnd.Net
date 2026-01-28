import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        items: [
          // {
          //   title: t('app'),
          //   path: paths.dashboard.root,
          //   icon: ICONS.dashboard,
          // },

          {
            title: t('Dashboard'),
            path: paths.dashboard.general.superDashboard,
            icon: ICONS.dashboard,
            roles: ['sa'],
          },

          {
            title: t('Company Dashboard'),
            path: paths.dashboard.general.companyDashboard,
            icon: ICONS.dashboard,
            roles: ['co'],
          },

          {
            title: t('Employee Dashboard'),
            path: paths.dashboard.general.employeeDashboard,
            icon: ICONS.dashboard,
            roles: [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'cj',
            ],
          },
          // {
          //   title: t('ecommerce'),
          //   path: paths.dashboard.general.ecommerce,
          //   icon: ICONS.ecommerce,
          // },
          // {
          //   title: t('analytics'),
          //   path: paths.dashboard.general.analytics,
          //   icon: ICONS.analytics,
          // },
          // {
          //   title: t('banking'),
          //   path: paths.dashboard.general.banking,
          //   icon: ICONS.banking,
          // },
          // {
          //   title: t('booking'),
          //   path: paths.dashboard.general.booking,
          //   icon: ICONS.booking,
          // },
          // {
          //   title: t('file'),
          //   path: paths.dashboard.general.file,
          //   icon: ICONS.file,
          // },
        ],
      },

      // MANAGEMENT
      //  ----------------------------------------------------------------------

      // {
      //   subheader: t('management'),
      //   items: [
      //     //     // USER
      //     //     {
      //     //       title: t('user'),
      //     //       path: paths.dashboard.user.root,
      //     //       icon: ICONS.user,
      //     //       children: [
      //     //         { title: t('profile'), path: paths.dashboard.user.root },
      //     //         { title: t('cards'), path: paths.dashboard.user.cards },
      //     //         { title: t('list'), path: paths.dashboard.user.list },
      //     //         { title: t('create'), path: paths.dashboard.user.new },
      //     //         { title: t('edit'), path: paths.dashboard.user.demo.edit },
      //     //         { title: t('account'), path: paths.dashboard.user.account },
      //     //       ],
      //     //     },
      //     //     // PRODUCT
      //     //     {
      //     //       title: t('product'),
      //     //       path: paths.dashboard.product.root,
      //     //       icon: ICONS.product,
      //     //       children: [
      //     //         { title: t('list'), path: paths.dashboard.product.root },
      //     //         {
      //     //           title: t('details'),
      //     //           path: paths.dashboard.product.demo.details,
      //     //         },
      //     //         { title: t('create'), path: paths.dashboard.product.new },
      //     //         { title: t('edit'), path: paths.dashboard.product.demo.edit },
      //     //       ],
      //     //     },
      //     //     // ORDER
      //     //     {
      //     //       title: t('order'),
      //     //       path: paths.dashboard.order.root,
      //     //       icon: ICONS.order,
      //     //       children: [
      //     //         { title: t('list'), path: paths.dashboard.order.root },
      //     //         { title: t('details'), path: paths.dashboard.order.demo.details },
      //     //       ],
      //     //     },
      //     // INVOICE
      //     // {
      //     //   title: t('invoice'),
      //     //   path: paths.dashboard.invoice.root,
      //     //   icon: ICONS.invoice,
      //     //   children: [
      //     //     { title: t('list'), path: paths.dashboard.invoice.root },
      //     //     {
      //     //       title: t('details'),
      //     //       path: paths.dashboard.invoice.demo.details,
      //     //     },
      //     //     { title: t('create'), path: paths.dashboard.invoice.new },
      //     //     { title: t('edit'), path: paths.dashboard.invoice.demo.edit },
      //     //   ],
      //     // },
      //     //     // BLOG
      //     //     {
      //     //       title: t('blog'),
      //     //       path: paths.dashboard.post.root,
      //     //       icon: ICONS.blog,
      //     //       children: [
      //     //         { title: t('list'), path: paths.dashboard.post.root },
      //     //         { title: t('details'), path: paths.dashboard.post.demo.details },
      //     //         { title: t('create'), path: paths.dashboard.post.new },
      //     //         { title: t('edit'), path: paths.dashboard.post.demo.edit },
      //     //       ],
      //     //     },
      //     //     // JOB
      //     //     {
      //     //       title: t('job'),
      //     //       path: paths.dashboard.job.root,
      //     //       icon: ICONS.job,
      //     //       children: [
      //     //         { title: t('list'), path: paths.dashboard.job.root },
      //     //         { title: t('details'), path: paths.dashboard.job.demo.details },
      //     //         { title: t('create'), path: paths.dashboard.job.new },
      //     //         { title: t('edit'), path: paths.dashboard.job.demo.edit },
      //     //       ],
      //     //     },
      //     //     // TOUR
      //     //     {
      //     //       title: t('tour'),
      //     //       path: paths.dashboard.tour.root,
      //     //       icon: ICONS.tour,
      //     //       children: [
      //     //         { title: t('list'), path: paths.dashboard.tour.root },
      //     //         { title: t('details'), path: paths.dashboard.tour.demo.details },
      //     //         { title: t('create'), path: paths.dashboard.tour.new },
      //     //         { title: t('edit'), path: paths.dashboard.tour.demo.edit },
      //     //       ],
      //     //     },
      //     //     // FILE MANAGER
      //     //     {
      //     //       title: t('file_manager'),
      //     //       path: paths.dashboard.fileManager,
      //     //       icon: ICONS.folder,
      //     //     },
      //     //     // MAIL
      //     //     {
      //     //       title: t('mail'),
      //     //       path: paths.dashboard.mail,
      //     //       icon: ICONS.mail,
      //     //       info: <Label color="error">+32</Label>,
      //     //     },
      //     //     // CHAT
      //     //     {
      //     //       title: t('chat'),
      //     //       path: paths.dashboard.chat,
      //     //       icon: ICONS.chat,
      //     //     },
      //     //     // CALENDAR
      //     //     {
      //     //       title: t('calendar'),
      //     //       path: paths.dashboard.calendar,
      //     //       icon: ICONS.calendar,
      //     //     },
      //     //     // KANBAN
      //     //     {
      //     //       title: t('kanban'),
      //     //       path: paths.dashboard.kanban,
      //     //       icon: ICONS.kanban,
      //     //     },
      //   ],
      // },

      {
        subheader: t('Menu'),
        items: [
          //  USER
          {
            title: t('Performance Evaluation'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'co',
              'pe',
              'cj',
              'interview_performance',
            ],
            children: [
              {
                title: t('Performance Evaluation Team '),
                path: paths.dashboard.setup.PerformanceEvaluationTeamPage,
                roles: ['co'],
              },
              {
                title: t('Performance Self Evaluation'),
                path: paths.dashboard.setup.EmployeeSelfEvaluation,
                roles: [
                  'Candidate_interview',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                  'cj',
                ],
              },
              {
                title: t('Performance Evaluation'),
                path: paths.dashboard.setup.PerformanceEvaluationPage,
                roles: [
                  'co',
                  'pe',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                  'interview_performance',
                ],
              },
            ],
          },

          {
            title: t('Company Employee '),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: ['co'],
            children: [
              {
                title: t('Company Employee List'),
                path: paths.dashboard.setup.CompanyEmployeePage,
                roles: ['co'],
              },
            ],
          },

          {
            title: t('Register Candidate'),
            path: paths.dashboard.setup.CreateCandidate,
            roles: ['rc'],
          },

          {
            title: t(' Facial Recognition Attendance'),
            path: paths.dashboard.setup.FacialAttendancePage,
            roles: ['ap'],
          },

          {
            title: t('Recruitment'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'interview_performance',
              'ca',
              'co',
              'ci',
              'cj',
            ],
            children: [
              {
                title: t('Company Schedule Interview'),
                path: paths.dashboard.setup.CompanyScheduleInterviewPage,
                roles: [
                  'co',
                  'ci',
                  'Candidate_interview',
                  'Candidate_interview_Performance',
                  'interview_performance',
                ],
              },
              {
                title: t('Candidate Interview '),
                path: paths.dashboard.setup.CandidateInterviewPage,
                roles: [
                  'Candidate_interview',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                  'ca',
                  'cj',
                ],
              },

              {
                title: t('Interview Panel'),
                path: paths.dashboard.setup.InterviewPanelPage,
                roles: ['co'],
              },
              {
                title: t('Job Description'),
                path: paths.dashboard.setup.JobDescriptionPage,
                roles: ['co'],
              },
            ],
          },

          {
            title: t('Attendance'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'co',
              'cj',
            ],
            children: [
              {
                title: t('Attendance'),
                path: paths.dashboard.setup.AttendancePage,
                roles: [
                  'co',
                  'cj',
                  'Candidate_interview',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                ],
              },
              {
                title: t('Attendance Status'),
                path: paths.dashboard.setup.AttendanceCandidatePage,
                roles: [
                  'Candidate_interview',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                  'cj',
                ],
              },

              {
                title: t('Register Employee Face'),
                path: paths.dashboard.setup.RegisterEmployeeFacePage,
                roles: ['co'],
              },
            ],
          },

          {
            title: t('Payrolls'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            roles: [
              'Candidate_interview',
              'Candidate_Performance',
              'Candidate_interview_Performance',
              'co',
              'cj',
              'sa',
            ],
            children: [
              {
                title: t('Company Payroll'),
                path: paths.dashboard.setup.CompanyPayrollPage,
                roles: ['co'],
              },
              {
                title: t('Employee Salary Page '),
                path: paths.dashboard.setup.employeeSalaryInfoPage,
                roles: [
                  'Candidate_interview',
                  'Candidate_Performance',
                  'Candidate_interview_Performance',
                  'cj',
                ],
              },
              {
                title: t('HRMS payment'),
                path: paths.dashboard.setup.HrmsPaymentPage,
                roles: ['sa'],
              },
            ],
          },
        ],
      },

      {
        items: [
          //  USER
          // {
          //   title: t('General Configuration list'),
          //   path: paths.dashboard.user.root,
          //   icon: ICONS.user,

          //   children: [
          //     { title: t('profile'), path: paths.dashboard.user.root },
          //     { title: t('cards'), path: paths.dashboard.user.cards },
          //     { title: t('list'), path: paths.dashboard.user.list },
          //     { title: t('create'), path: paths.dashboard.user.new },
          //     { title: t('edit'), path: paths.dashboard.user.demo.edit },
          //     { title: t('account'), path: paths.dashboard.user.account },
          //     { title: t('institute'), path: paths.dashboard.user.institute },
          //   ],
          // },
          {
            title: t('Employee Information'),
            path: paths.dashboard.setup.root,
            icon: ICONS.kanban,
            roles: ['sa'],
            children: [
              {
                title: t('Out Source Candidate '),
                path: paths.dashboard.setup.OutSourceCandidatePage,
                roles: ['sa'],
              },
            ],
          },
          {
            title: t('Central HR Setups'),
            path: paths.dashboard.setup.root,
            icon: ICONS.kanban,
            roles: ['sa'],
            children: [
              // {
              //   title: t('Bussiness Group '),
              //   path: paths.dashboard.setup.BussinessGroupPage,
              // },

              {
                title: t('City '),
                path: paths.dashboard.setup.Addcity,
                roles: ['sa'],
              },

              {
                title: t('Country '),
                path: paths.dashboard.setup.AddCountry,
                roles: ['sa'],
              },
              {
                title: t('State '),
                path: paths.dashboard.setup.AddState,
                roles: ['sa'],
              },

              // {
              //   title: t('Company Type'),
              //   path: paths.dashboard.setup.CompanyType,
              //   roles: ['sa'],
              // },

              {
                title: t('Company '),
                path: paths.dashboard.setup.Company,
                roles: ['sa'],
              },

              {
                title: t('Profession '),
                path: paths.dashboard.setup.ProfessionPage,
                roles: ['sa'],
              },

              {
                title: t('Designation '),
                path: paths.dashboard.setup.DesignationPage,
                roles: ['sa'],
              },

              {
                title: t('Education '),
                path: paths.dashboard.setup.EducationPage,
                roles: ['sa'],
              },

              {
                title: t('Bank '),
                path: paths.dashboard.setup.BankPage,
                roles: ['sa'],
              },
              {
                title: t('Skill '),
                path: paths.dashboard.setup.SkillPage,
                roles: ['sa'],
              },

              // {
              //   title: t('User Profile '),
              //   path: paths.dashboard.setup.UserProfilePage,
              // },

              // {
              //   title: t('add '),
              //   path: paths.dashboard.setup.AddPage,
              // },
            ],
          },

          // PRODUCT
          // {
          //   title: t('Academic Structure'),
          //   path: paths.dashboard.product.root,
          //   icon: ICONS.product,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.product.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.product.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.product.new },
          //     { title: t('edit'), path: paths.dashboard.product.demo.edit },
          //   ],
          // },

          // FILE MANAGER
          // {
          //   title: t('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },

          // MAIL
          // {
          //   title: t('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color="error">+32</Label>,
          // },

          // CHAT
          // {
          //   title: t('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          // {
          //   title: t('calendar'),
          //   path: paths.dashboard.calendar,
          //   icon: ICONS.calendar,
          // },

          // KANBAN
          // {
          //   title: t('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },
        ],
      },
      // DEMO MENU STATES
      // {
      //   subheader: t(t('other_cases')),
      //   items: [
      //     {
      //       // default roles : All roles can see this entry.
      //       // roles: ['user'] Only users can see this item.
      //       // roles: ['admin'] Only admin can see this item.
      //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
      //       // Reference from 'src/guards/RoleBasedGuard'.
      //       title: t('item_by_roles'),
      //       path: paths.dashboard.permission,
      //       icon: ICONS.lock,
      //       roles: ['admin', 'manager'],
      //       caption: t('only_admin_can_see_this_item'),
      //     },
      //     {
      //       title: t('menu_level'),
      //       path: '#/dashboard/menu_level',
      //       icon: ICONS.menuItem,
      //       children: [
      //         {
      //           title: t('menu_level_1a'),
      //           path: '#/dashboard/menu_level/menu_level_1a',
      //         },
      //         {
      //           title: t('menu_level_1b'),
      //           path: '#/dashboard/menu_level/menu_level_1b',
      //           children: [
      //             {
      //               title: t('menu_level_2a'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2a',
      //             },
      //             {
      //               title: t('menu_level_2b'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b',
      //               children: [
      //                 {
      //                   title: t('menu_level_3a'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
      //                 },
      //                 {
      //                   title: t('menu_level_3b'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       title: t('item_disabled'),
      //       path: '#disabled',
      //       icon: ICONS.disabled,
      //       disabled: true,
      //     },
      //     {
      //       title: t('item_label'),
      //       path: '#label',
      //       icon: ICONS.label,
      //       info: (
      //         <Label color="info" startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}>
      //           NEW
      //         </Label>
      //       ),
      //     },
      //     {
      //       title: t('item_caption'),
      //       path: '#caption',
      //       icon: ICONS.menuItem,
      //       caption:
      //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      //     },
      //     {
      //       title: t('item_external_link'),
      //       path: 'https://www.google.com/',
      //       icon: ICONS.external,
      //     },
      //     {
      //       title: t('blank'),
      //       path: paths.dashboard.blank,
      //       icon: ICONS.blank,
      //     },
      //   ],
      // },
    ],
    [t]
  );

  return data;
}
