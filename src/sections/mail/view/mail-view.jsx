import { useEffect, useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import MailNav from '../mail-nav';
import MailList from '../mail-list';
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';

const LABEL_INDEX = 'inbox';

const sampleLabels = [
  { id: 'inbox', name: 'Inbox', color: '#00a8ff', unreadCount: 34 },
  { id: 'sent', name: 'Sent', color: '#fbc531' },
];

const sampleMails = {
  allIds: ['mail1', 'mail2', 'mail3', 'mail4'],
  byId: {
    mail1: {
      id: 'mail1',
      labelIds: ['inbox'],
      subject: 'Sample Mail Subject 1',
      from: {
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '',
      },
      to: [{ email: 'recipient1@example.com' }],
      message: 'This is a sample email message 1.',
      createdAt: new Date(),
      isStarred: false,
      isImportant: false,
      attachments: [],
    },
    mail2: {
      id: 'mail2',
      labelIds: ['inbox'],
      subject: 'Sample Mail Subject 2',
      from: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: '',
      },
      to: [{ email: 'recipient2@example.com' }],
      message: 'This is a sample email message 2.',
      createdAt: new Date(),
      isStarred: true,
      isImportant: false,
      attachments: [],
    },
    mail3: {
      id: 'mail3',
      labelIds: ['sent'],
      subject: 'Sample Mail Subject 3',
      from: {
        name: 'Alice Brown',
        email: 'alice@example.com',
        avatarUrl: '',
      },
      to: [{ email: 'recipient3@example.com' }],
      message: 'This is a sample email message 3.',
      createdAt: new Date(),
      isStarred: false,
      isImportant: true,
      attachments: [],
    },
    mail4: {
      id: 'mail4',
      labelIds: ['sent'],
      subject: 'Sample Mail Subject 4',
      from: {
        name: 'Bob Green',
        email: 'bob@example.com',
        avatarUrl: '',
      },
      to: [{ email: 'recipient4@example.com' }],
      message: 'This is a sample email message 4.',
      createdAt: new Date(),
      isStarred: false,
      isImportant: false,
      attachments: [],
    },
  },
};

export default function MailView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedLabelId = searchParams.get('label') || LABEL_INDEX;
  const selectedMailId = searchParams.get('id') || '';

  const mdUp = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const [data, setData] = useState(null);

  const openNav = useBoolean();
  const openMail = useBoolean();
  const openCompose = useBoolean();

  const labels = sampleLabels;
  const mails = sampleMails;

  const filteredMailIds = mails.allIds.filter((id) =>
    mails.byId[id].labelIds.includes(selectedLabelId)
  );

  const mailsEmpty = filteredMailIds.length === 0;
  const mail = mails.byId[selectedMailId] || null;

  const firstMailId = filteredMailIds[0] || '';

  const handleToggleCompose = useCallback(() => {
    if (openNav.value) {
      openNav.onFalse();
    }
    openCompose.onToggle();
  }, [openCompose, openNav]);

  const handleClickLabel = useCallback(
    (labelId) => {
      if (!mdUp) {
        openNav.onFalse();
      }

      if (labelId) {
        const href =
          labelId !== LABEL_INDEX
            ? `${paths.dashboard.mail}?label=${labelId}`
            : paths.dashboard.mail;
        router.push(href);
      }
    },
    [openNav, router, mdUp]
  );

  const handleClickMail = useCallback(
    (mailId) => {
      if (!mdUp) {
        openMail.onFalse();
      }

      const href =
        selectedLabelId !== LABEL_INDEX
          ? `${paths.dashboard.mail}?id=${mailId}&label=${selectedLabelId}`
          : `${paths.dashboard.mail}?id=${mailId}`;

      router.push(href);
    },
    [openMail, router, selectedLabelId, mdUp]
  );

  useEffect(() => {
    if (!selectedMailId && firstMailId) {
      handleClickMail(firstMailId);
    }
  }, [firstMailId, handleClickMail, selectedMailId]);

  useEffect(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderEmpty = (
    <EmptyContent
      title={`Nothing in ${selectedLabelId}`}
      description="This folder is empty"
      imgUrl="/assets/icons/empty/ic_folder_empty.svg"
      sx={{
        borderRadius: 1.5,
        maxWidth: { md: 320 },
        bgcolor: 'background.default',
      }}
    />
  );

  const renderMailNav = (
    <MailNav
      openNav={openNav.value}
      onCloseNav={openNav.onFalse}
      onToggleCompose={handleToggleCompose}
      handleClickLabel={handleClickLabel}
      labels={labels}
      selectedLabelId={selectedLabelId}
    />
  );

  const renderMailList = (
    <MailList
      mails={{
        allIds: filteredMailIds,
        byId: mails.byId,
      }}
      loading={false}
      openMail={openMail.value}
      onCloseMail={openMail.onFalse}
      onClickMail={handleClickMail}
      selectedLabelId={selectedLabelId}
      selectedMailId={selectedMailId}
    />
  );

  const renderMailDetails = (
    <>
      {mailsEmpty ? (
        <EmptyContent
          imgUrl="/assets/icons/empty/ic_email_disabled.svg"
          sx={{
            borderRadius: 1.5,
            bgcolor: 'background.default',
            ...(!mdUp && {
              display: 'none',
            }),
          }}
        />
      ) : (
        <MailDetails
          mail={mail}
          renderLabel={(id) => labels.filter((label) => label.id === id)[0]}
        />
      )}
    </>
  );
  const HandleEmailSubmit = async (data) => {
    try {
      // Remove HTML tags from the body
      data.body = data.body.replace(/<\/?p>/g, '');

      data.username = sessionStorage.getItem('username');

      const response = await fetch('http://localhost:5161/api/Email/add', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Mail
        </Typography>

        <Stack
          spacing={1}
          sx={{
            p: 1,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            bgcolor: 'background.neutral',
          }}
        >
          {!mdUp && (
            <MailHeader
              onOpenNav={openNav.onTrue}
              onOpenMail={mailsEmpty ? null : openMail.onTrue}
            />
          )}

          <Stack
            spacing={1}
            direction="row"
            sx={{
              minHeight: { md: 720 },
              height: { xs: 800, md: '72vh' },
            }}
          >
            {renderMailNav}

            {mailsEmpty ? renderEmpty : renderMailList}

            {renderMailDetails}
          </Stack>
        </Stack>
      </Container>

      {openCompose.value && (
        <MailCompose onCloseCompose={openCompose.onFalse} onSubmit={HandleEmailSubmit} />
      )}
    </>
  );
}
