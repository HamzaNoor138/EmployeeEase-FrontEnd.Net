import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import {
  CheckInIllustration,
  CheckoutIllustration,
  SeoIllustration,
  BookingIllustration,
} from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWelcome from 'src/sections/overview/app/app-welcome';
import AppFeatured from 'src/sections/overview/app/app-featured';
import AppNewInvoice from 'src/sections/overview/app/app-new-invoice';
import AppTopAuthors from 'src/sections/overview/app/app-top-authors';
import AppTopRelated from 'src/sections/overview/app/app-top-related';
import AppAreaInstalled from 'src/sections/overview/app/app-area-installed';
import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';
import AppCurrentDownload from 'src/sections/overview/app/app-current-download';
import AppTopInstalledCountries from 'src/sections/overview/app/app-top-installed-countries';
import AppWidget from 'src/sections/overview/app/app-widget';

import { useGetCompanyDashboard } from 'src/api/dashboard';
import { useEffect, useState } from 'react';
import BookingWidgetSummary from 'src/sections/overview/booking/booking-widget-summary';
import BookingBooked from 'src/sections/overview/booking/booking-booked';
import BookingStatistics from 'src/sections/overview/booking/booking-statistics';

import BankingExpensesCategories from 'src/sections/overview/banking/banking-expenses-categories';
import EcommerceSaleByGender from 'src/sections/overview/e-commerce/ecommerce-sale-by-gender';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();
  const { companyDashboardData, refetchData } = useGetCompanyDashboard();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={6}>
          <BookingWidgetSummary
            title="Total Outsourced Employees"
            total={companyDashboardData?.totalEmployee ?? 0}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <BookingWidgetSummary
            title="Total Active Jobs"
            total={companyDashboardData?.totalActiveJob}
            icon={<CheckInIllustration />}
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Hired Employees"
            total={companyDashboardData.totalHired}
            icon={<CheckoutIllustration />}
          />
        </Grid> */}

        <Grid xs={12} md={4} lg={4}>
          <AppCurrentDownload
            title="Panels Information"
            chart={{
              series: [
                {
                  label: 'Performance Team Lead',
                  value: companyDashboardData?.totalPerformanceLeads,
                },
                {
                  label: 'Total Interview Panel',
                  value: companyDashboardData?.totalInterviewPanel,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={4} lg={4}>
          <EcommerceSaleByGender
            title="Daily Attendance"
            total={
              companyDashboardData ?? companyDashboardData?.totalEmployee
                ? companyDashboardData.totalEmployee
                : 0
            }
            chart={{
              series: companyDashboardData?.dailyAttendance ?? [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingBooked
            title="Current Month Payment Status"
            data={
              companyDashboardData?.paymentStatus?.length > 0
                ? companyDashboardData.paymentStatus
                : [
                    { status: 'Pending', quantity: 0, value: 0 },
                    { status: 'Paid', quantity: 0, value: 0 },
                    { status: 'Due', quantity: 0, value: 0 },
                  ]
            }
          />
        </Grid>

        <Grid xs={12} md={5}>
          <BankingExpensesCategories
            title="Recuirtment Information"
            statusCount={companyDashboardData?.scheduledData?.length ?? 0}
            chart={{
              series: companyDashboardData?.scheduledData ?? [],
              colors: [
                theme.palette.primary.main,
                theme.palette.warning.dark,
                theme.palette.success.darker,
                theme.palette.error.main,
                theme.palette.info.dark,
                theme.palette.info.darker,
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.info.main,
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={7} lg={7}>
          <AppAreaInstalled
            title="Employee Joined Information"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series:
                companyDashboardData?.lineGraphData?.length > 0
                  ? companyDashboardData.lineGraphData
                  : [
                      {
                        year: 2024,
                        data: [
                          {
                            name: 'Employee',
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                          },
                        ],
                      },
                    ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
