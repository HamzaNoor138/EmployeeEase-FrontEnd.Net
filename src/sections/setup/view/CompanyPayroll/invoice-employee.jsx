import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Table,
  Paper,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  useTheme,
  Grid,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fDate } from 'src/utils/format-time';
import { fPkrCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import { Document, Page } from '@react-pdf/renderer';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledSummaryRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    padding: theme.spacing(1.5),
    borderBottom: 'none',
  },
}));

export default function InvoiceEmployeeDetails({ invoice, employeePageInvoice }) {
  const theme = useTheme();
  let currentEmployee;
  if (employeePageInvoice) {
    currentEmployee = invoice;
  } else {
    currentEmployee = invoice.invoiceEmployeeData[0];
  }

  const date = new Date();

  const StyledInfo = ({ label, value }) => (
    <Stack spacing={0.5}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );

  const renderHeader = (
    <>
      <Typography sx={{ color: 'text.secondary', mt: 2, ml: { xs: 2, md: 5 } }}>
        {!employeePageInvoice && (
          <Typography>TransactionId: {currentEmployee.transactionId}</Typography>
        )}
      </Typography>
      <Box
        sx={{
          p: { xs: 2, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          gap: { xs: 3, md: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography sx={{ color: 'text.secondary' }}>Payment From:</Typography>
                <Typography variant="h5">
                  {employeePageInvoice ? 'Central HRMS' : invoice.companyName}
                </Typography>
                {employeePageInvoice && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Bank Account:{' '}
                    {`${invoice.hrmsBankAccountName}-${invoice.hrmsBankAccountNumber}`}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {employeePageInvoice ? '' : invoice.companyAddress}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {!employeePageInvoice && (
            <>
              <StyledInfo
                label="Company Phone"
                value={employeePageInvoice ? '' : invoice.companyPhoneNo}
              />
              <Divider sx={{ mt: 2 }} />

              <Stack sx={{}} spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: 'text.secondary' }}>Payment To:</Typography>
                    <Typography variant="h5">Central HRMS</Typography>
                  </Box>
                </Box>
              </Stack>
            </>
          )}
        </Box>

        <Stack
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          sx={{
            mt: { xs: 3, md: 0 },
          }}
        >
          <Label
            variant="soft"
            color="success"
            sx={{
              py: 1.5,
              px: 2,
              typography: 'subtitle1',
            }}
          >
            Salary Slip
          </Label>

          <Stack spacing={1} sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            <Typography variant="h6">
              {`INV-${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`}
            </Typography>
            <Typography variant="body2">Employee Code: {currentEmployee.employeeCode}</Typography>
          </Stack>

          <Paper
            sx={{
              p: 2.5,
              borderRadius: 1.5,
              bgcolor: theme.palette.background.neutral,
              width: { xs: '100%', md: 250 },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">Employee</Typography>
              <Typography variant="h6">{currentEmployee.fullName}</Typography>
              <Typography variant="body2">
                {currentEmployee.bankName} - {currentEmployee.bankAccountNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: currentEmployee.paymentStatus === 'p' ? 'success.main' : 'error.main',
                }}
              >
                {currentEmployee.paymentStatus === 'p' ? 'Paid' : 'Unpaid'}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </>
  );

  const renderSalaryDetails = (
    <TableContainer sx={{ px: 5, mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <StyledTableCell>Employee Salary</StyledTableCell>
            <StyledTableCell align="right">
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.totalSalary
                  : currentEmployee.currentGrossSalary
              )}
            </StyledTableCell>
          </TableRow>
          {currentEmployee.bonus > 0 && currentEmployee.bonus && (
            <TableRow>
              <StyledTableCell>Bonus</StyledTableCell>
              <StyledTableCell align="right" sx={{ color: 'success.main' }}>
                +{fPkrCurrency(currentEmployee.bonus)}
              </StyledTableCell>
            </TableRow>
          )}

          {currentEmployee.bonusAmount > 0 && currentEmployee.bonusAmount && (
            <TableRow>
              <StyledTableCell>Bonus</StyledTableCell>
              <StyledTableCell align="right" sx={{ color: 'success.main' }}>
                +{fPkrCurrency(currentEmployee.bonusAmount)}
              </StyledTableCell>
            </TableRow>
          )}

          <TableRow>
            <StyledTableCell>
              Attendance Deduction (
              {employeePageInvoice
                ? currentEmployee.previousMonthAbsent
                : currentEmployee.previousMonthAbsent}{' '}
              days)
            </StyledTableCell>
            <StyledTableCell align="right" sx={{ color: 'error.main' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography>-</Typography>
                <Typography>
                  {' '}
                  {fPkrCurrency(
                    employeePageInvoice
                      ? currentEmployee.attendanceDeduction
                      : currentEmployee.attendanceDeduction
                  )}
                </Typography>
              </Box>
            </StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Employee Net Salary</StyledTableCell>
            <StyledTableCell align="right">
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.employeeNetSalary
                  : currentEmployee.totalNetSalary
              )}
            </StyledTableCell>
          </TableRow>
          {!employeePageInvoice && (
            <TableRow>
              <StyledTableCell>HRMS Fee</StyledTableCell>
              <StyledTableCell align="right">
                {fPkrCurrency(currentEmployee.hrmsFee)}
              </StyledTableCell>
            </TableRow>
          )}

          <TableRow>
            <StyledTableCell sx={{ display: 'flex' }}>
              Total Paid{' '}
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                {employeePageInvoice ? '' : '(Net Salary + HRMS fee)'}
              </Typography>{' '}
            </StyledTableCell>
            <StyledTableCell align="right">
              {fPkrCurrency(
                employeePageInvoice
                  ? currentEmployee.employeeNetSalary
                  : currentEmployee.totalSalary
              )}
            </StyledTableCell>
          </TableRow>
        </TableBody>

        <Box sx={{ p: { xs: 0, md: 5 } }}>
          <Grid container>
            <Grid item xs={12} md={9} sx={{ py: 2 }}>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                This salary has been calculated based on your attendance and performance for the
                previous month. Please review all details and contact HR if you have any questions.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Table>
    </TableContainer>
  );

  return (
    <Document>
      <Page size="A4">
        <Card>
          {renderHeader}
          <Divider />
          {renderSalaryDetails}
        </Card>
      </Page>
    </Document>
  );
}

InvoiceEmployeeDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};
