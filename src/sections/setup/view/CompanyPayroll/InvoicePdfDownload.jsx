import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet, Image } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency, fPkrCurrency } from 'src/utils/format-number';

// Register Roboto Font
Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 }],
});

// Custom styles
const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          padding: '40px 24px 80px 24px',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 40,
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          paddingBottom: 10,
        },
        companyInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
        title: { fontSize: 20, fontWeight: 700, color: '#333' },
        subtitle: { fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#555' },
        section: { marginBottom: 15 },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          paddingVertical: 8,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
        },
        tableRow: {
          flexDirection: 'row',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
        },
        // Updated cell widths and alignments
        tableCellHeader: { fontWeight: 700, textAlign: 'left', color: '#333' },
        tableCell: { color: '#333' },
        tableCellSmall: { width: '10%', textAlign: 'left', left: 15 }, // Smaller width for index column
        tableCellNormal: { width: '22.5%', textAlign: 'right' }, // Wider for main content columns
        footer: {
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          borderTopWidth: 1,
          borderColor: '#DFE3E8',
          paddingTop: 8,
          fontSize: 8,
          color: '#666',
        },
      }),
    []
  );

export default function InvoicePDF({ invoice }) {
  const styles = useStyles();
  const { companyName, companyAddress, companyPhoneNo, invoiceEmployeeData } = invoice;
  const totalAmount = invoiceEmployeeData.reduce((acc, value) => acc + value.totalSalary, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo/logo_single.png" style={{ width: 48, height: 48 }} />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>Invoice</Text>
            <Text>{fDate(new Date())}</Text>
          </View>
        </View>

        {/* Company Information */}
        <View style={styles.companyInfo}>
          <View>
            <Text style={styles.subtitle}>Invoice From</Text>
            <Text>{companyName}</Text>
            <Text>{companyAddress}</Text>
            <Text>{companyPhoneNo}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.subtitle}>Invoice To</Text>
            {invoiceEmployeeData.map((employee, index) => (
              <Text key={index}>{employee.fullName}</Text>
            ))}
          </View>
        </View>

        {/* Employee Details Table */}
        <Text style={[styles.subtitle, { marginBottom: 8 }]}>Employee Details</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellHeader, styles.tableCellSmall]}>#</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Employee Name</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Bank Name</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Absents</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Hrms Fee</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Net Salary</Text>
          <Text style={[styles.tableCellHeader, styles.tableCellNormal]}>Total Salary</Text>
        </View>
        {invoiceEmployeeData.map((employee, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCell, styles.tableCellSmall]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>{employee.fullName}</Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>{employee.bankName}</Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>
              {employee.previousMonthAbsent}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>
              {fPkrCurrency(employee.hrmsFee)}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>
              {fPkrCurrency(employee.totalNetSalary)}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNormal]}>
              {fPkrCurrency(employee.totalSalary)}
            </Text>
          </View>
        ))}

        {/* Total Amount */}
        <View style={[styles.tableRow, { borderTopWidth: 1, borderColor: '#DFE3E8', left: 40 }]}>
          <Text
            style={[
              styles.tableCell,
              { width: '85%', textAlign: 'right', fontWeight: 700, right: 10 },
            ]}
          >
            Total
          </Text>
          <Text style={[styles.tableCell, { fontWeight: 700, color: '#333' }]}>
            {fPkrCurrency(totalAmount)}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.subtitle}>NOTES</Text>
              <Text>
                We appreciate your business. Let us know if we can help with VAT or additional
                notes!
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.subtitle}>Have a Question?</Text>
              <Text>support@abcapp.com</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
};
