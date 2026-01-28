import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency, fPkrCurrency } from 'src/utils/format-number';

import { INVOICE_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import InvoiceToolbar from 'src/sections/invoice/invoice-toolbar';
import { Document, Page } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice }) {
  const [currentStatus, setCurrentStatus] = useState('paid');

  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  // const renderTotal = (
  //   <>
  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ color: 'text.secondary' }}>
  //         <Box sx={{ mt: 2 }} />
  //         Subtotal
  //       </TableCell>
  //       <TableCell width={120} sx={{ typography: 'subtitle2' }}>
  //         <Box sx={{ mt: 2 }} />
  //         {fCurrency(invoice.subTotal)}
  //       </TableCell>
  //     </StyledTableRow>

  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ color: 'text.secondary' }}>Shipping</TableCell>
  //       <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
  //         {fCurrency(-invoice.shipping)}
  //       </TableCell>
  //     </StyledTableRow>

  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ color: 'text.secondary' }}>Discount</TableCell>
  //       <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
  //         {fCurrency(-invoice.discount)}
  //       </TableCell>
  //     </StyledTableRow>

  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ color: 'text.secondary' }}>Hrms fee</TableCell>
  //       <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
  //         {fCurrency(-invoice.discount)}
  //       </TableCell>
  //     </StyledTableRow>

  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ color: 'text.secondary' }}>Taxes</TableCell>
  //       <TableCell width={120}>{fCurrency(invoice.taxes)}</TableCell>
  //     </StyledTableRow>

  //     <StyledTableRow>
  //       <TableCell colSpan={3} />
  //       <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
  //       <TableCell width={140} sx={{ typography: 'subtitle1' }}>
  //         {fCurrency(invoice.totalAmount)}
  //       </TableCell>
  //     </StyledTableRow>
  //   </>
  // );

  const hello = invoice.invoiceEmployeeData.reduce((acc, value) => acc + value.totalSalary, 0);

  console.log('hello', hello);

  const date = new Date();

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@minimals.cc</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Employee Name</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Bank Name</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Absents</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Hrms Fee</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Net Salary</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Total Salary</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoice.invoiceEmployeeData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{row.fullName}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.employeeCode}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{row.bankName}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      Acc # {row.bankAccountNumber}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.previousMonthAbsent}</TableCell>

                <TableCell>{fPkrCurrency(row.hrmsFee)}</TableCell>

                <TableCell>{fPkrCurrency(row.totalNetSalary)}</TableCell>
                <TableCell>{fPkrCurrency(row.totalSalary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <Document>
      <Page size="A4">
        <Card sx={{ pt: 5, px: 5 }}>
          <Box
            rowGap={5}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Box
              component="img"
              alt="logo"
              src="/logo/logo_single.svg"
              sx={{ width: 48, height: 48 }}
            />

            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Label
                variant="soft"
                color={
                  (currentStatus === 'paid' && 'success') ||
                  (currentStatus === 'pending' && 'warning') ||
                  (currentStatus === 'overdue' && 'error') ||
                  'default'
                }
              >
                {currentStatus}
              </Label>

              <Typography variant="h6">{`INV-0${
                date.getMonth() + 1
              }/${date.getFullYear()}`}</Typography>
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Invoice From
              </Typography>
              {invoice.companyName}
              <br />
              {invoice.companyAddress}
              <br />
              Phone: {invoice.companyPhoneNo}
              <br />
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Invoice To
              </Typography>

              {invoice.invoiceEmployeeData.map((element) => {
                return <Typography>{element.fullName}</Typography>;
              })}
              {/* <br />
            {invoice.invoiceTo.fullAddress}
            <br />
            Phone: {invoice.invoiceTo.phoneNumber}
            <br /> */}
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Date Create
              </Typography>
              {fDate(new Date())}
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Due Date
              </Typography>
              {fDate(new Date(date.getFullYear(), date.getMonth(), 9))}
            </Stack>
          </Box>

          {renderList}

          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              paddingRight: '7%',
            }}
          >
            {/* <Typography>Total:</Typography>
          <Typography>4343</Typography> */}

            <StyledTableRow>
              <TableCell colSpan={3} />
              <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
              <TableCell width={140} sx={{ typography: 'subtitle1' }}>
                {fPkrCurrency(
                  invoice.invoiceEmployeeData.reduce((acc, value) => acc + value.totalSalary, 0)
                )}
              </TableCell>
            </StyledTableRow>
          </Box>

          <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

          {renderFooter}
        </Card>
      </Page>
    </Document>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
