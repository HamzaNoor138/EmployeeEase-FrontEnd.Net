import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Card, CardContent, Typography, Box, Divider, Stack, Grid, styled } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Document, Page } from '@react-pdf/renderer';

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const OfferLetterTemplate = ({ offerData }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  const currentDate = new Date();

  return (
    <Document>
      <Page size="A4">
        <Card sx={{ maxWidth: '4xl', mx: 'auto', p: 4, bgcolor: 'background.paper' }}>
          <CardContent>
            {/* Header with Company Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Iconify icon="mdi:building" width={40} sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {offerData.companyName}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Excellence in Innovation
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Date: {format(currentDate, 'MMMM dd, yyyy')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Recipient Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {offerData.fullName}
              </Typography>
              <Typography color="text.secondary">{offerData.candidateAddress}</Typography>
              <Typography color="text.secondary">{offerData.candidateEmail}</Typography>
            </Box>

            {/* Rest of the content structure remains the same, updating only the icons */}

            {/* Work Location */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle variant="h6">Work Location</SectionTitle>
              <Stack spacing={2}>
                <IconWrapper>
                  <Iconify icon="mdi:map-marker" width={24} />
                  <Typography>{offerData.companyAddress}</Typography>
                </IconWrapper>
                <IconWrapper>
                  <Iconify icon="mdi:phone" width={24} />
                  <Typography>{offerData.officeNo}</Typography>
                </IconWrapper>
                <IconWrapper>
                  <Iconify icon="mdi:email" width={24} />
                  <Typography>{offerData.officeEmail}</Typography>
                </IconWrapper>
              </Stack>
            </Box>

            {/* Work Schedule */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle variant="h6">Work Schedule</SectionTitle>
              <Stack spacing={2}>
                <IconWrapper>
                  <Iconify icon="mdi:clock" width={24} />
                  <Typography>
                    Working Hours: {offerData.clockInTime} - {offerData.clockOutTime}
                  </Typography>
                </IconWrapper>
              </Stack>
            </Box>

            {/* Important Dates */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle variant="h6">Important Dates</SectionTitle>
              <Stack spacing={2}>
                <IconWrapper>
                  <Iconify icon="mdi:calendar" width={24} />
                  <Box>
                    <Typography variant="subtitle2">Offer Valid Until</Typography>
                    <Typography>{formatDate(offerData.offerExpiryDate)}</Typography>
                  </Box>
                </IconWrapper>
                <IconWrapper>
                  <Iconify icon="mdi:clock-time-four" width={24} />
                  <Box>
                    <Typography variant="subtitle2">Response Required Within</Typography>
                    <Typography>
                      {offerData.currentNoticePeriod} days from the date of this letter
                    </Typography>
                  </Box>
                </IconWrapper>
              </Stack>
            </Box>

            {/* Position Details */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle variant="h6">Position Details</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <IconWrapper>
                      <Iconify icon="mdi:briefcase" width={24} />
                      <Box>
                        <Typography variant="subtitle2">Position Title</Typography>
                        <Typography>{offerData.jobTitle}</Typography>
                      </Box>
                    </IconWrapper>
                    <IconWrapper>
                      <Iconify icon="mdi:file-document" width={24} />
                      <Box>
                        <Typography variant="subtitle2">Employment Type</Typography>
                        <Typography>
                          {offerData.contract === 1 ? 'Contract' : 'Full Time'}
                        </Typography>
                      </Box>
                    </IconWrapper>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <IconWrapper>
                      <Iconify icon="mdi:calendar-clock" width={24} />
                      <Box>
                        <Typography variant="subtitle2">Contract Duration</Typography>
                        <Typography>{offerData.contractDuration}</Typography>
                      </Box>
                    </IconWrapper>
                    <IconWrapper>
                      <Iconify icon="mdi:currency-usd" width={24} />
                      <Box>
                        <Typography variant="subtitle2">Monthly Salary</Typography>
                        <Typography>Rs. {offerData.salary.toLocaleString()}</Typography>
                      </Box>
                    </IconWrapper>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Rest of the template remains the same... */}
          </CardContent>
        </Card>
      </Page>
    </Document>
  );
};

OfferLetterTemplate.propTypes = {
  offerData: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    salary: PropTypes.number.isRequired,
    contract: PropTypes.number.isRequired,
    contractDuration: PropTypes.string.isRequired,
    currentNoticePeriod: PropTypes.number.isRequired,
    offerExpiryDate: PropTypes.string.isRequired,
    companyAddress: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    officeNo: PropTypes.string.isRequired,
    officeEmail: PropTypes.string.isRequired,
    clockInTime: PropTypes.string.isRequired,
    clockOutTime: PropTypes.string.isRequired,
    referenceNumber: PropTypes.string.isRequired,
    candidateAddress: PropTypes.string.isRequired,
    candidateEmail: PropTypes.string.isRequired,
    hrManagerName: PropTypes.string.isRequired,
  }).isRequired,
};

export default OfferLetterTemplate;
