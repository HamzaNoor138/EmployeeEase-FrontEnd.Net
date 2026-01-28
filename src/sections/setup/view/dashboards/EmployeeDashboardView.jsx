import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import {
  CheckInIllustration,
  SeoIllustration,
  BookingIllustration,
} from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWelcome from 'src/sections/overview/app/app-welcome';
import AppFeatured from 'src/sections/overview/app/app-featured';

import { useGetEmployeeDashboard } from 'src/api/dashboard';
import { useEffect, useState } from 'react';
import BookingWidgetSummary from 'src/sections/overview/booking/booking-widget-summary';
import BankingBalanceStatistics from 'src/sections/overview/banking/banking-balance-statistics';
import BankingExpensesCategories from 'src/sections/overview/banking/banking-expenses-categories';
import BookingCheckInWidgets from 'src/sections/overview/booking/booking-check-in-widgets';
import { minHeight } from '@mui/system';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();
  const { EmployeeDashboardData } = useGetEmployeeDashboard();

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

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            sx={{ minHeight: '100%' }}
            title="Company Name"
            total={EmployeeDashboardData.companyname ?? ''}
            icon={<BookingIllustration />}
            companyName={true}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            sx={{ minHeight: '100%' }}
            title="Total Salary"
            total={EmployeeDashboardData.currentSalary ?? 0}
            icon={<CheckInIllustration />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingCheckInWidgets
            chart={{
              series: [
                {
                  label: 'Average Performance Score',
                  percent: parseInt(EmployeeDashboardData.performanceAverageScore) ?? 0,
                  total: `${EmployeeDashboardData.performanceAverageScore}/100` ?? 0,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={5}>
          <BankingExpensesCategories
            sx={{ minHeight: '100%' }}
            title="Employee Interview Statistics"
            statusCount={EmployeeDashboardData?.ScheduleInfo?.length ?? 0}
            chart={{
              series: EmployeeDashboardData.scheduleInfo ?? [],

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
        <Grid xs={12} md={7}>
          <BankingBalanceStatistics
            title="Attendance Statistics"
            subheader="(+43% Income | +12% Expense) than last year"
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
              series: EmployeeDashboardData.barGraphData ?? [],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
