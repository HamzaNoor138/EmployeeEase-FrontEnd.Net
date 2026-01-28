import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';
import { fPkrCurrency } from 'src/utils/format-number';

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
          paddingTop: 80,
        },
        companyInfo: {
          marginBottom: 20,
        },
        companyName: {
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 4,
        },
        paymentSection: {
          marginBottom: 12,
        },
        paymentTitle: {
          fontSize: 10,
          color: '#637381',
          marginBottom: 4,
        },
        companyAddress: {
          fontSize: 10,
          color: '#637381',
          marginBottom: 8,
        },
        bankInfo: {
          fontSize: 10,
          color: '#637381',
          marginBottom: 4,
        },
        divider: {
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          marginVertical: 12,
        },
        hrmsSection: {
          marginTop: 12,
        },
        label: {
          fontSize: 9,
          color: '#637381',
          marginBottom: 4,
        },
        value: {
          fontSize: 10,
          marginBottom: 8,
        },
        employeeSection: {
          backgroundColor: '#F4F6F8',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        },
        employeeTitle: {
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 4,
        },
        employeeName: {
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 4,
        },
        bankInfo: {
          fontSize: 10,
          marginBottom: 4,
        },
        paymentStatus: {
          fontSize: 10,
          marginTop: 4,
        },
        table: {
          marginTop: 20,
        },
        tableHeader: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          paddingVertical: 8,
        },
        tableRow: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#DFE3E8',
          paddingVertical: 8,
        },
        descriptionCell: {
          flex: 1,
        },
        amountCell: {
          width: '30%',
          textAlign: 'right',
        },
        notes: {
          marginTop: 30,
        },
        noteTitle: {
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 8,
        },
        noteText: {
          fontSize: 9,
          color: '#637381',
          width: '75%',
        },
        salaryLabel: {
          backgroundColor: '#C8FAD6',
          color: '#118D57',
          padding: 8,
          fontSize: 12,
          fontWeight: 700,
          alignSelf: 'flex-end',
          borderRadius: 4,
        },
      }),
    []
  );

export default function SalarySlipPDF({ invoice, employeePageInvoice }) {
  const styles = useStyles();
  let currentEmployee;
  if (employeePageInvoice) {
    currentEmployee = invoice;
  } else {
    currentEmployee = invoice.invoiceEmployeeData[0];
  }
  const date = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <Text style={styles.paymentTitle}>TransactionId: {currentEmployee.transactionId}</Text>
        <View style={styles.header}>
          <View>
            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Payment From:</Text>
              <Text style={styles.companyName}>
                {employeePageInvoice ? 'Central HRMS' : invoice.companyName}
              </Text>
              {employeePageInvoice && (
                <Text style={styles.bankInfo}>
                  Bank Account: {`${invoice.hrmsBankAccountName}-${invoice.hrmsBankAccountNumber}`}
                </Text>
              )}
              <Text style={styles.companyAddress}>
                {employeePageInvoice ? '' : invoice.companyAddress}
              </Text>
            </View>

            {!employeePageInvoice && (
              <>
                <View>
                  <Text style={styles.label}>Company Phone</Text>
                  <Text style={styles.value}>{invoice.companyPhoneNo}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.hrmsSection}>
                  <Text style={styles.paymentTitle}>Payment To:</Text>
                  <Text style={styles.companyName}>Central HRMS</Text>
                </View>
              </>
            )}
          </View>

          <View>
            <Text style={styles.salaryLabel}>Salary Slip</Text>

            <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
              <Text style={styles.employeeTitle}>
                INV-{String(date.getMonth() + 1).padStart(2, '0')}/{date.getFullYear()}
              </Text>
              <Text style={styles.value}>Employee Code: {currentEmployee.employeeCode}</Text>
            </View>

            <View style={styles.employeeSection}>
              <Text style={styles.employeeTitle}>Employee</Text>
              <Text style={styles.employeeName}>{currentEmployee.fullName}</Text>
              <Text style={styles.bankInfo}>
                {currentEmployee.bankName} - {currentEmployee.bankAccountNumber}
              </Text>
              <Text
                style={[
                  styles.paymentStatus,
                  { color: currentEmployee.paymentStatus === 'p' ? '#118D57' : '#B71D18' },
                ]}
              >
                {currentEmployee.paymentStatus === 'p' ? 'Paid' : 'Unpaid'}
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Details Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionCell}>Description</Text>
            <Text style={styles.amountCell}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.descriptionCell}>Employee Salary</Text>
            <Text style={styles.amountCell}>
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.totalSalary
                  : currentEmployee.currentGrossSalary
              )}
            </Text>
          </View>

          {(currentEmployee.bonus || currentEmployee.bonusAmount > 0) && (
            <View style={styles.tableRow}>
              <Text style={styles.descriptionCell}>Bonus</Text>
              <Text style={[styles.amountCell, { color: '#118D57' }]}>
                +{' '}
                {fPkrCurrency(
                  employeePageInvoice ? currentEmployee.bonusAmount : currentEmployee.bonus
                )}
              </Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={styles.descriptionCell}>
              Attendance Deduction ({currentEmployee.previousMonthAbsent} days)
            </Text>
            <Text style={[styles.amountCell, { color: '#B71D18' }]}>
              -{fPkrCurrency(currentEmployee.attendanceDeduction)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.descriptionCell}>Employee Net Salary</Text>
            <Text style={styles.amountCell}>
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.employeeNetSalary
                  : currentEmployee.totalNetSalary
              )}
            </Text>
          </View>

          {!employeePageInvoice && (
            <View style={styles.tableRow}>
              <Text style={styles.descriptionCell}>HRMS Fee</Text>
              <Text style={styles.amountCell}>{fPkrCurrency(currentEmployee.hrmsFee)}</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={styles.descriptionCell}>
              Total Paid{' '}
              {!employeePageInvoice && (
                <Text style={{ color: '#637381' }}>(Net Salary + HRMS fee)</Text>
              )}
            </Text>
            <Text style={styles.amountCell}>
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.employeeNetSalary
                  : currentEmployee.totalSalary
              )}
            </Text>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notes}>
          <Text style={styles.noteTitle}>Notes</Text>
          <Text style={styles.noteText}>
            This salary has been calculated based on your attendance and performance for the
            previous month. Please review all details and contact HR if you have any questions.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

SalarySlipPDF.propTypes = {
  invoice: PropTypes.object.isRequired,
  employeePageInvoice: PropTypes.bool,
};
