import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register Roboto Font
Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          padding: '40px 24px',
          fontSize: 10,
          fontFamily: 'Roboto',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        companySection: {
          marginBottom: 20,
        },
        companyName: {
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 4,
        },
        companyAddress: {
          fontSize: 10,
          color: '#637381',
          marginBottom: 4,
        },
        dateReference: {
          alignItems: 'flex-end',
        },
        referenceText: {
          fontSize: 10,
          color: '#637381',
          marginBottom: 4,
        },
        divider: {
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          marginVertical: 12,
        },
        recipientSection: {
          marginBottom: 20,
        },
        recipientName: {
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 4,
        },
        recipientAddress: {
          fontSize: 10,
          color: '#637381',
        },
        offerLabel: {
          backgroundColor: '#C8FAD6',
          color: '#118D57',
          padding: 8,
          fontSize: 12,
          fontWeight: 700,
          alignSelf: 'flex-start',
          borderRadius: 4,
          marginBottom: 12,
        },
        sectionTitle: {
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 8,
          marginTop: 16,
        },
        detailsSection: {
          backgroundColor: '#F4F6F8',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        },
        detailRow: {
          flexDirection: 'row',
          marginBottom: 8,
        },
        detailLabel: {
          width: '40%',
          fontSize: 10,
          color: '#637381',
        },
        detailValue: {
          flex: 1,
          fontSize: 10,
        },
        paragraph: {
          fontSize: 10,
          marginBottom: 8,
          lineHeight: 1.5,
        },
        signatureSection: {
          marginTop: 40,
        },
        signatureBox: {
          marginTop: 20,
          borderTopWidth: 1,
          borderColor: '#DFE3E8',
          paddingTop: 20,
        },
        signatureLine: {
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          width: '60%',
          marginTop: 40,
          marginBottom: 8,
        },
      }),
    []
  );

export default function OfferLetterPDF({ offerData }) {
  const styles = useStyles();
  const currentDate = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>{offerData.companyName}</Text>
            <Text style={styles.companyAddress}>{offerData.companyAddress}</Text>
            <Text style={styles.companyAddress}>Phone: {offerData.officeNo}</Text>
            <Text style={styles.companyAddress}>Email: {offerData.officeEmail}</Text>
          </View>
          <View style={styles.dateReference}>
            <Text style={styles.referenceText}>Date: {format(currentDate, 'MMMM dd, yyyy')}</Text>
          </View>
        </View>

        <View style={styles.recipientSection}>
          <Text style={styles.recipientName}>{offerData.fullName}</Text>
          <Text style={styles.recipientAddress}>{offerData.candidateAddress}</Text>
          <Text style={styles.recipientAddress}>{offerData.candidateEmail}</Text>
        </View>

        <Text style={styles.offerLabel}>Employment Offer</Text>

        <Text style={styles.paragraph}>Dear {offerData.fullName},</Text>

        <Text style={styles.paragraph}>
          We are pleased to extend to you an offer of employment with {offerData.companyName}.
          Following our recent discussions, we believe your skills and experience will be a valuable
          addition to our organization.
        </Text>

        <Text style={styles.sectionTitle}>Position Details</Text>
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Position Title:</Text>
            <Text style={styles.detailValue}>{offerData.jobTitle}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Employment Type:</Text>
            <Text style={styles.detailValue}>
              {offerData.contract === 1 ? 'Contract' : 'Full Time'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{offerData.contractDuration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Salary:</Text>
            <Text style={styles.detailValue}>Rs. {offerData.salary.toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Work Schedule</Text>
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-In Time:</Text>
            <Text style={styles.detailValue}>{offerData.clockInTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-Out Time:</Text>
            <Text style={styles.detailValue}>{offerData.clockOutTime}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Important Dates</Text>
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Offer Valid Until:</Text>
            <Text style={styles.detailValue}>
              {format(new Date(offerData.offerExpiryDate), 'MMMM dd, yyyy')}
            </Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Response Required:</Text>
            <Text style={styles.detailValue}>Within {offerData.currentNoticePeriod} days</Text>
          </View> */}
        </View>

        <Text style={styles.paragraph}>
          This offer is contingent upon successful completion of background verification and
          submission of required documents. The detailed terms and conditions of your employment
          will be covered in the employment agreement, which will be provided to you upon acceptance
          of this offer.
        </Text>

        <Text style={styles.paragraph}>
          We are excited about the prospect of you joining our team and believe that your skills and
          experience will be a valuable addition to our organization.
        </Text>

        <View style={styles.signatureSection}>
          <Text style={styles.paragraph}>Best regards,</Text>
          <Text style={[styles.paragraph, { fontWeight: 700 }]}>{offerData.hrManagerName}</Text>
          <Text style={styles.paragraph}>Human Resources Manager</Text>
          <Text style={styles.paragraph}>{offerData.companyName}</Text>
        </View>

        <View style={styles.signatureBox}>
          <Text style={styles.sectionTitle}>Offer Acceptance</Text>
          <Text style={styles.paragraph}>
            I, {offerData.fullName}, accept the position as offered above and agree to the terms and
            conditions outlined in this letter.
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.paragraph}>Signature and Date</Text>
        </View>
      </Page>
    </Document>
  );
}

OfferLetterPDF.propTypes = {
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
