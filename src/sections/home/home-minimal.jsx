import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: <Iconify width={48} icon="mdi:file-document" />,
    title: 'CV Parsing and Inspection',
    description: 'Utilize CV parsing techniques to extract relevant information from resumes, with automated inspection filters for keywords, experience, and location.',
  },
  {
    icon: <Iconify width={48} icon="mdi:account-group" />,
    title: 'Recruitment Management',
    description: 'Manage the recruitment workflow efficiently, from candidate calling to sending offer letters, and moving candidates through interview stages.',
  },
  {
    icon: <Iconify width={48} icon="mdi:account-plus" />,
    title: 'Company Registration and Job Postings',
    description: 'Allow companies to register, log in, and add job descriptions along with salary packages for potential employees.',
  },

  {
    icon: <Iconify width={48} icon="mdi:trophy" />,
    title: 'Ranking Algorithm',
    description: 'Rank registered employees based on performance metrics, showcasing top-ranked candidates for recruitment on the company’s page.',
  },
  {
    icon: <Iconify width={48} icon="mdi:currency-usd" />,
    title: 'Payroll Management',
    description: 'Manage payrolls through a centralized HRMS system, with payments processed by the HRMS to outsourced employees based on company agreements.',
  },
  {
    icon: <Iconify width={48} icon="mdi:chart-line" />,
    title: 'Performance Management',
    description: 'Allow companies to evaluate employee performance through self-assessments and feedback from evaluators, ranking employees based on performance.',
  },
  {
    icon: <Iconify width={48} icon="mdi:face-recognition" />,
    title: 'Facial Recognition for Attendance',
    description: 'Track employee attendance using facial recognition technology, reducing manual check-ins and improving security and accuracy.',
  },
  {
    icon: <Iconify width={48} icon="mdi:clock" />,
    title: 'Attendance Management',
    description: 'HR departments can manage employee attendance, exit times, overtime, and other attendance-related details through the company portal.',
  },
];


// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          {/* <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            Minimal UI
          </Typography> */}
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            How Employee Ease <br /> helps you?
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 10 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {CARDS.map((card, index) => (
          <m.div variants={varFade().inUp} key={card.title}>
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: { md: 'none' },
                bgcolor: 'background.default',
                p: (theme) => theme.spacing(10, 5),
                ...({
                  boxShadow: (theme) => ({
                    md: `-40px 40px 80px ${
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.grey[500], 0.16)
                        : alpha(theme.palette.common.black, 0.4)
                    }`,
                  }),
                }),
              }}
            >
             <Box sx={{ mx: 'auto' }}>
        {card.icon}
      </Box>

              <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>{card.description}</Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
