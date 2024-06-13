import { useEffect, useState } from "react";
import "./App.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TimeChart from "./components/data/lineChart";

type DividendTimeFrameProps = {
  timeFrame: "monthly" | "quarterly" | "annually";
  setTimeFrame: (timeFrame: "monthly" | "quarterly" | "annually") => void;
};

const DividendTimeFrame = ({
  timeFrame,
  setTimeFrame,
}: DividendTimeFrameProps) => {
  // Add a change handler to the RadioGroup component
  const handleRadioChange = (value: string) => {
    setTimeFrame(value as "monthly" | "quarterly" | "annually");
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="dividend-time-frame" className="w-max">
        Dividend Time Frame
      </Label>
      <RadioGroup
        value={timeFrame}
        className="ml-2"
        onValueChange={(value) => {
          handleRadioChange(value);
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="montly" id="r1" />
          <Label htmlFor="r1">Monthly</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="quarterly" id="r2" />
          <Label htmlFor="r2">Quarterly</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="annually" id="r3" />
          <Label htmlFor="r3">Annually</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

const calc_dividends = (investBalance: number, dividendRate: number): number =>
  investBalance * dividendRate;

const calc_invest_balance = (
  invest_balance: number,
  exp_ratio: number,
  return_rate: number,
  dividend_rate: number,
  monthly_contribution: number
): number =>
  invest_balance +
  invest_balance * (return_rate - exp_ratio) +
  calc_dividends(invest_balance, dividend_rate) +
  monthly_contribution;

const req_mon_payment = (
  loan_amt: number,
  apr: number,
  loan_length: number = 30,
  annual_pay_periods: number = 12
): number => {
  const months = loan_length * 12;
  const rate = apr / annual_pay_periods;
  return (loan_amt * rate * (1 + rate) ** months) / ((1 + rate) ** months - 1);
};

const loan_remaining = (
  mon_pay: number,
  prin_pay: number,
  rate: number,
  balance: number
): number => balance - (mon_pay - balance * (rate / 12) + prin_pay);

type ChartData = {
  loanBalace: number;
  investBalance: number;
  month: number;
  date: Date;
  netWorth: number;
  name: string;
};

function App() {
  const [loanAprLive, setLoanAprLive] = useState(5.0);
  const [loanAprCommitted, setLoanAprCommitted] = useState(5.0);
  const [loanBalanceCurrent, setLoanBalanceCurrent] = useState(300000);
  const [loanAmt, setLoanAmt] = useState(500000);
  const [invBalanceCurrent, setInvBalanceCurrent] = useState(30000);
  const [invApr, setInvApr] = useState(10);
  const [expenseRatio, setExpenseRatio] = useState(0.5);
  const [estDividend, setEstDividend] = useState(1);
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [timeFrame, setTimeFrame] = useState<
    "monthly" | "quarterly" | "annually"
  >("quarterly");

  const taxRate = 0.2 + 0.038;
  // The tax rate to apply to investment with drawals, expressed as .3 = 30%, here we use 20% capital gains plus 3.8% Net Income Investment Tax

  // Loop over every month in the time horizon
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    for (let i = 0; i < timeHorizon * 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const month = i + 1;
      const loanPayment = req_mon_payment(loanAmt, loanAprCommitted);
      const investBalance = calc_invest_balance(
        invBalanceCurrent,
        expenseRatio,
        invApr,
        estDividend,
        loanPayment
      );
      const loanBalance = loan_remaining(
        loanPayment,
        loanPayment - loanBalanceCurrent * (loanAprCommitted / 12),
        loanAprCommitted / 12,
        loanBalanceCurrent
      );
      const netWorth = investBalance - loanBalance;
      setChartData((prev) => [
        ...prev,
        {
          loanBalace: loanBalance,
          investBalance,
          month,
          date,
          netWorth,
          name: date.toLocaleDateString(),
        },
      ]);
    }
  }, [
    loanBalanceCurrent,
    loanAmt,
    loanAprCommitted,
    invBalanceCurrent,
    invApr,
    expenseRatio,
    estDividend,
    timeHorizon,
  ]);

  return (
    <>
      <div className="flex flex-col gap-16 items-center justify-center min-h-screen py-2">
        <div className="flex flex-col w-max gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid w-full max-w-sm gap-1.5">
              <Label htmlFor="loan-balance" className="w-max">
                Loan Balance
              </Label>
              <Input
                type="number"
                id="loan-balance"
                placeholder="300000"
                className="ml-2"
                value={loanBalanceCurrent}
                onChange={(e) => setLoanBalanceCurrent(Number(e.target.value))}
              />
            </div>
            <div className="grid w-full max-w-sm gap-1.5">
              <Label htmlFor="loan-amt" className="w-max">
                Total Loan Amount
              </Label>
              <Input
                type="number"
                id="loan-amt"
                placeholder="500000"
                className="ml-2"
                value={loanAmt}
                onChange={(e) => setLoanAmt(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="loan-apr" className="w-max">
              Loan APR
            </Label>
            <div className="flex items-center gap-2">
              <Slider
                max={15}
                step={0.05}
                min={0}
                value={[loanAprLive]}
                className={`ml-2`}
                onValueChange={(value) => setLoanAprLive(value[0])}
                onValueCommit={(value) => setLoanAprCommitted(value[0])}
              />
              <div className="text-sm text-gray-500 w-16">{loanAprLive}%</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="inv-balance" className="w-max">
              Investment Balance
            </Label>
            <Input
              type="number"
              id="inv-balance"
              placeholder="30000"
              className="ml-2"
              value={invBalanceCurrent}
              onChange={(e) => setInvBalanceCurrent(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="inv-apr" className="w-max">
              Avg Annual Return
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="inv-apr"
                placeholder="10"
                className="ml-2"
                min={-10}
                max={100}
                value={invApr}
                onChange={(e) => setInvApr(Number(e.target.value))}
              />
              <div className="text-sm text-gray-500 w-6">%</div>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="inv-apr" className="w-max">
              Expense Ratio
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="inv-apr"
                placeholder="0.5"
                className="ml-2"
                min={-10}
                max={100}
                value={expenseRatio}
                onChange={(e) => setExpenseRatio(Number(e.target.value))}
              />
              <div className="text-sm text-gray-500 w-6">%</div>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="inv-apr" className="w-max">
              Est. Dividend
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="inv-apr"
                placeholder="1"
                className="ml-2"
                min={-10}
                max={100}
                value={estDividend}
                onChange={(e) => setEstDividend(Number(e.target.value))}
              />
              <div className="text-sm text-gray-500 w-16">%</div>
            </div>
          </div>
          <DividendTimeFrame
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
          />
        </div>
        <div className="mx-auto">
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="time-horizon" className="w-max">
              Time Horizon
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="time-horizon"
                placeholder="20"
                className="ml-2"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
              />
              <div className="text-sm text-gray-500 w-6">years</div>
            </div>
          </div>
        </div>
        <div className="w-full h-96">
          <TimeChart data={chartData} />
        </div>
      </div>
    </>
  );
}

export default App;
