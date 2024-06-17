import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChartData } from "@/lib/customTypes";

export const DataTable = ({ data }: { data: ChartData[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Month</TableHead>
          <TableHead>Investment Balance</TableHead>
          <TableHead>Loan Balance</TableHead>
          <TableHead>Loan Payment</TableHead>
          <TableHead>Investment Payment</TableHead>
          <TableHead>Principal Payment</TableHead>
          <TableHead>Out of Pocket</TableHead>
          <TableHead>Cash Investment Value</TableHead>
          <TableHead>Net Worth</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {data.map((row) => (
          <TableRow key={row.month}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.month}</TableCell>
            <TableCell>{row.investBalance.toFixed(2)}</TableCell>
            <TableCell>{row.loanBalance.toFixed(2)}</TableCell>
            <TableCell>{row.loanPayment.toFixed(2)}</TableCell>
            <TableCell>{row.investmentPayment.toFixed(2)}</TableCell>
            <TableCell>{row.principalPayment.toFixed(2)}</TableCell>
            <TableCell>{row.outOfPocket.toFixed(2)}</TableCell>
            <TableCell>{row.cashInvestmentValue.toFixed(2)}</TableCell>
            <TableCell>{row.netWorth.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
