import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register the Roboto font
Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

// Create styles using useMemo for performance optimization
const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 12,
          padding: 15,
          fontFamily: 'Roboto',
          lineHeight: 1.6,
          color: '#333',
          border: '2px solid #0047AB', // Adding a border around the page
          // Optional: Rounded corners for the border
        },
        header: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
          color: '#0047AB',
        },
        section: {
          marginBottom: 20,
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
        },
        bold: {
          fontWeight: 'bold',
        },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#0047AB',
          color: '#fff',
          padding: 10,
          borderRadius: 5,
        },
        tableRow: {
          flexDirection: 'row',
          padding: 10,
          borderBottom: '1px solid #eee',
          backgroundColor: '#f9f9f9',
        },
        tableCell: {
          flex: 1,
          textAlign: 'center',
        },
        mb8: {
          marginBottom: 8,
        },
        mb4: {
          marginBottom: 4,
        },
        summary: {
          fontSize: 14,
          fontWeight: 'bold',
          marginTop: 20,
          padding: 10,
          backgroundColor: '#f2f2f2',
          borderRadius: 5,
          textAlign: 'center',
        },
      }),
    []
  );

// Attendance PDF Component
const AttendancePDF = ({ attendanceData, candidateName, month, year }) => {
  const styles = useStyles();

  // Calculate total days in the month up to the current date
  const currentDate = new Date();
  const totalDays = currentDate.getDate();

  // Calculate attendance percentage
  const presentDays = attendanceData.filter((item) => item.status === 'P').length;
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={{ border: '2px solid #0047AB', padding: 15, height: '99%' }}>
          {/* Header */}
          <Text style={styles.header}>
            {`Attendance Report for ${candidateName} - ${format(
              new Date(year, month - 1),
              'MMMM yyyy'
            )}`}
          </Text>

          {/* Attendance Table */}
          <View style={[styles.section, { marginBottom: 20 }]}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { width: '40%' }, styles.bold]}>Date</Text>
              <Text style={[styles.tableCell, { width: '30%' }, styles.bold]}>Day</Text>
              <Text style={[styles.tableCell, { width: '30%' }, styles.bold]}>
                Attendance Status
              </Text>
            </View>
            {attendanceData.map((item) => (
              <View key={item.attendanceId} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '40%' }]}>
                  {format(new Date(item.attendanceDate), 'yyyy-MM-dd')}
                </Text>
                <Text style={[styles.tableCell, { width: '30%' }]}>
                  {format(new Date(item.attendanceDate), 'EEEE')}
                </Text>
                <Text style={[styles.tableCell, { width: '30%' }]}>
                  {item.status === 'P'
                    ? 'Present'
                    : item.status === 'N'
                    ? 'Not Available'
                    : 'Absent'}
                </Text>
              </View>
            ))}
          </View>

          {/* Attendance Summary */}
          <Text style={styles.summary}>{`Attendance Percentage: ${attendancePercentage}%`}</Text>
        </View>
      </Page>
    </Document>
  );
};

AttendancePDF.propTypes = {
  attendanceData: PropTypes.arrayOf(
    PropTypes.shape({
      attendanceId: PropTypes.string.isRequired,
      attendanceDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  candidateName: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
};

export default AttendancePDF;
