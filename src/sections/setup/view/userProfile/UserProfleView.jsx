import { useState, useCallback, useEffect } from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import { useGetCandidateByName } from 'src/api/candidate';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { paths } from 'src/routes/paths';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { _userAbout } from 'src/_mock';

import { useGetAllProfessions } from 'src/api/profession';
import Iconify from 'src/components/iconify';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProfileCover from './profile-cover';
import ProfileHome from './profileHome';

import { useGetCompanyByName } from 'src/api/company';
import CompanyProfileHome from './CompanyProfileHome';

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { user } = useMockedUser();
  const [currentTab, setCurrentTab] = useState('profile');
  const [animationState, setAnimationState] = useState('slide-in');
  const { CandidateList, refetchData } = useGetCandidateByName();
  const { CompanyList } = useGetCompanyByName();
  const { professionList } = useGetAllProfessions();

  const handleChangeTab = useCallback((event, newValue) => {
    setAnimationState('slide-out');
    setTimeout(() => {
      setCurrentTab(newValue);
      setAnimationState('slide-in');
    }, 300);
  }, []);

  useEffect(() => {
    if (animationState === 'slide-in') {
      setAnimationState('');
    }
  }, [animationState]);

  const TABS = [
    {
      value: 'profile',
      label: 'Profile',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'EditProfile',
      label: 'Edit Profile',
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'bill',
      label: 'Billing',
      icon: <Iconify icon="stash:billing-info-solid" width={24} />,
    },
  ];

  return (
    <>
      {sessionStorage.getItem('userType') == 'co' ? (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Profile"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'User', href: paths.dashboard.user.root },
              { name: user?.displayName },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          <Card sx={{ mb: 3, height: 290 }}>
            {CompanyList.length > 0 && (
              <ProfileCover
                role={'Company'}
                name={sessionStorage.getItem('username')}
                avatarUrl={user?.photoURL}
                coverUrl={_userAbout.coverUrl}
              />
            )}
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                width: 1,
                bottom: 0,
                padding: 1,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .${tabsClasses.flexContainer}`]: {
                  pr: { md: 3 },
                  justifyContent: {
                    sm: 'center',
                    md: 'flex-end',
                  },
                },
              }}
            >
              {sessionStorage.getItem('userType') === 'co'
                ? TABS.filter((tab) => tab.value !== 'EditProfile').map((tab) => (
                    <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                  ))
                : null}
            </Tabs>
          </Card>
          <div>
            {CompanyList.length > 0 && CompanyList[0] != null && (
              <CompanyProfileHome
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                CandidateList={CompanyList}
                professionList={professionList}
                refetchData={refetchData}
              />
            )}
          </div>
        </Container>
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Profile"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'User', href: paths.dashboard.user.root },
              { name: user?.displayName },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          <Card sx={{ mb: 3, height: 290 }}>
            {CandidateList.length > 0 && CandidateList[0] != null && (
              <ProfileCover
                role={
                  professionList.find((prof) => prof.professionId == CandidateList[0].professionId)
                    ?.fullName
                }
                name={CandidateList[0].fullname}
                avatarUrl={user?.photoURL}
                coverUrl={_userAbout.coverUrl}
              />
            )}
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                width: 1,
                padding: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .${tabsClasses.flexContainer}`]: {
                  pr: { md: 3 },
                  justifyContent: {
                    sm: 'center',
                    md: 'flex-end',
                  },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Card>
          <div>
            {CandidateList.length > 0 && CandidateList[0] != null && (
              <ProfileHome
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                CandidateList={CandidateList}
                professionList={professionList}
                refetchData={refetchData}
              />
            )}
          </div>
        </Container>
      )}
    </>
  );
}
