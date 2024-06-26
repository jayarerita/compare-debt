import { useEffect, useState } from "react";
import "./App.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import TimeChart from "@/components/data/lineChart";
import type { ChartData } from "@/lib/customTypes";
import { DataTable } from "@/components/data/dataTable";
import { DividendTimeFrame } from "@/components/customUi/dividendRadio";
import { LoanTerm } from "@/components/customUi/loanTermRadio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Latex from "react-latex";

const calc_dividends = (
  investBalance: number,
  dividendRate: number,
  timeFrame: "monthly" | "quarterly" | "annually"
): number => {
  if (timeFrame === "monthly") {
    return investBalance * dividendRate;
  }
  if (timeFrame === "quarterly") {
    return (investBalance * dividendRate) / 3;
  }
  return (investBalance * dividendRate) / 12;
};

const calc_invest_balance = (
  invest_balance: number,
  exp_ratio: number,
  return_rate: number,
  dividend_rate: number,
  monthly_contribution: number,
  timeFrame: "monthly" | "quarterly" | "annually" = "quarterly"
): number =>
  invest_balance +
  invest_balance * (return_rate / 12 - exp_ratio / 12) +
  calc_dividends(invest_balance, dividend_rate, timeFrame) +
  monthly_contribution;

const req_mon_payment = (
  loan_amt: number,
  apr: number,
  loan_length: number = 30,
  annual_pay_periods: number = 12
): number => {
  const months = loan_length * 12;
  const rate = apr / annual_pay_periods;
  // M = P [ I(1 + I)^N ] / [ (1 + I)^N − 1]
  return (loan_amt * rate * (1 + rate) ** months) / ((1 + rate) ** months - 1);
};

const loan_remaining = (
  mon_pay: number,
  prin_pay: number,
  rate: number,
  balance: number
): number => balance - (mon_pay + prin_pay - balance * (rate / 12));

function App() {
  const [loanAprLive, setLoanAprLive] = useState(5.0);
  const [loanAprCommitted, setLoanAprCommitted] = useState(5.0);
  const [loanBalanceCurrent, setLoanBalanceCurrent] = useState(300000);
  const [loanAmt, setLoanAmt] = useState(500000);
  const [invBalanceCurrent, setInvBalanceCurrent] = useState(30000);
  const [invApr, setInvApr] = useState(10);
  const [expenseRatio, setExpenseRatio] = useState(0.5);
  const [estDividend, setEstDividend] = useState(1);
  const [timeHorizon, setTimeHorizon] = useState(15);
  const [timeFrame, setTimeFrame] = useState<
    "monthly" | "quarterly" | "annually"
  >("quarterly");
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [contributionBalanceLive, setContributionBalanceLive] = useState(0.5);
  const [contributionBalanceCommitted, setContributionBalanceCommitted] =
    useState(0.5);
  const [loanTerm, setLoanTerm] = useState<30 | 15>(30);

  const taxRate = 0.2 + 0.038;
  // The tax rate to apply to investment with drawals, expressed as .3 = 30%, here we use 20% capital gains plus 3.8% Net Income Investment Tax

  // Loop over every month in the time horizon
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const getMonthlyData = (
    date: Date,
    monthNumber: number,
    currentInvBalance: number,
    currentLoanBalance: number,
    loanLength: number
  ) => {
    date.setMonth(date.getMonth());
    let loanPayment = req_mon_payment(
      loanAmt,
      loanAprCommitted / 100,
      loanLength
    );

    let monthlyContributionActual =
      monthlyContribution * contributionBalanceCommitted;
    let principalPayment =
      monthlyContribution * (1 - contributionBalanceCommitted);
    let loanBalance = currentLoanBalance;
    if (loanPayment + principalPayment > currentLoanBalance) {
      if (currentLoanBalance === 0) {
        loanPayment = 0;
        principalPayment = 0;
        monthlyContributionActual = monthlyContribution + loanPayment;
      } else {
        monthlyContributionActual +=
          loanPayment - currentLoanBalance + principalPayment;
        loanPayment = currentLoanBalance;
        loanBalance = 0;
      }
    } else {
      loanBalance = loan_remaining(
        loanPayment,
        principalPayment,
        loanAprCommitted / 100,
        currentLoanBalance
      );
    }

    const investBalance = calc_invest_balance(
      currentInvBalance,
      expenseRatio / 100,
      invApr / 100,
      estDividend / 100,
      monthlyContributionActual,
      timeFrame
    );
    const netWorth = investBalance - loanBalance;
    const cashInvestmentValue = investBalance * (1 - taxRate);
    const outOfPocket =
      loanPayment + monthlyContributionActual + principalPayment;
    return {
      date,
      month: monthNumber,
      loanPayment,
      investBalance,
      loanBalance,
      netWorth,
      cashInvestmentValue,
      outOfPocket,
      principalPayment: principalPayment,
      investmentPayment: monthlyContributionActual,
    };
  };

  useEffect(() => {
    const curChartData: ChartData[] = [];
    for (let i = 0; i < timeHorizon * 12; i++) {
      if (i === 0) {
        const {
          date,
          month,
          loanPayment,
          investBalance,
          loanBalance,
          netWorth,
          cashInvestmentValue,
          outOfPocket,
          principalPayment,
          investmentPayment,
        } = getMonthlyData(
          new Date(),
          1,
          invBalanceCurrent,
          loanBalanceCurrent,
          loanTerm
        );
        curChartData.push({
          date,
          month,
          loanPayment,
          investBalance,
          loanBalance,
          netWorth,
          cashInvestmentValue,
          outOfPocket,
          principalPayment,
          investmentPayment,
          name: date.toLocaleDateString(),
        });
        continue;
      }
      const prevMonth = curChartData[i - 1];
      const date = new Date(prevMonth.date);
      date.setMonth(date.getMonth() + 1);
      const {
        loanPayment,
        investBalance,
        loanBalance,
        netWorth,
        cashInvestmentValue,
        outOfPocket,
        principalPayment,
        investmentPayment,
      } = getMonthlyData(
        date,
        i + 1,
        prevMonth.investBalance,
        prevMonth.loanBalance,
        loanTerm
      );
      curChartData.push({
        date,
        month: i + 1,
        loanPayment,
        investBalance,
        loanBalance,
        netWorth,
        cashInvestmentValue,
        outOfPocket,
        principalPayment,
        investmentPayment,
        name: date.toLocaleDateString(),
      });
    }
    setChartData(curChartData);
  }, [
    loanBalanceCurrent,
    loanAmt,
    loanAprCommitted,
    invBalanceCurrent,
    invApr,
    expenseRatio,
    estDividend,
    timeHorizon,
    contributionBalanceCommitted,
    monthlyContribution,
    loanTerm,
  ]);

  return (
    <>
      <div className="flex flex-col gap-16 items-center justify-center min-h-screen py-2 px-2 w-full">
        <img
          src="/compare-debt/rocket_money_light.svg"
          alt="logo"
          className="h-24"
        />
        <div className="text-3xl font-bold">Investment vs Loan Calculator</div>

        <div className="flex flex-col md:w-max gap-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="grid w-full max-w-xs gap-1.5">
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
            <div className="grid w-full max-w-xs gap-1.5">
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
            <LoanTerm loanTerm={loanTerm} setLoanTerm={setLoanTerm} />
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
              <Input
                type="number"
                id="loan-apr"
                className="ml-2 w-20"
                max={15}
                min={0}
                value={loanAprLive}
                onChange={(e) => {
                  setLoanAprLive(Number(e.target.value));
                  setLoanAprCommitted(Number(e.target.value));
                }}
              />
              <div className="text-sm text-gray-500 w-4">%</div>
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="loan-apr" className="w-max">
              Monthly Payment
            </Label>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 w-16">
                $
                {req_mon_payment(loanAmt, loanAprLive / 100, loanTerm).toFixed(
                  2
                )}
              </div>
            </div>
          </div>
          <Accordion
            type="single"
            className="max-w-lg w-full opacity-75 mx-auto"
            collapsible
          >
            <AccordionItem value="mortgage-calc">
              <AccordionTrigger>Mortgage Equations</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <p>
                    The following is the equation for the monthly payment on the
                    mortgage.
                  </p>
                  <Latex>
                    {
                      "$$ M = \\large\\frac{T(I(1 + I) ^ N)}{((1 + I) ^ N) - 1} $$"
                    }
                  </Latex>
                  <Latex>{`$$ M = Monthly\\ Payment = ${req_mon_payment(
                    loanAmt,
                    loanAprLive / 100,
                    loanTerm
                  ).toFixed(2)} $$`}</Latex>
                  <Latex>{`$$ T = Total\\ Loan\\ Amount = ${loanAmt} $$`}</Latex>
                  <Latex>
                    {`$$ I = \\frac{Annual\\ Interest\\ Rate}{12} = \\frac{${loanAprCommitted}}{12} = ${(
                      loanAprCommitted / 12
                    ).toFixed(2)}\\%$$`}
                  </Latex>
                  <Latex>{`$$ N = Loan\\ Term\\ in\\ Months = ${
                    loanTerm * 12
                  }$$`}</Latex>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <p>
                    The following is the equation for each month's loan balance.
                  </p>
                  {/* balance - (mon_pay + prin_pay - balance * (rate / 12)); */}
                  <Latex>{`$$ R = L - ( M + P - L * I ) $$`}</Latex>
                  <Latex>{`$$ R = Remaining\\ Loan\\ Balance $$`}</Latex>
                  <Latex>{`$$ M = Monthly\\ Payment = ${req_mon_payment(
                    loanAmt,
                    loanAprLive / 100,
                    loanTerm
                  ).toFixed(2)} $$`}</Latex>
                  <Latex>{`$$ P = Montly\\ Principal\\ Payment = ${
                    monthlyContribution * (1 - contributionBalanceCommitted)
                  }$$`}</Latex>
                  <Latex>{`$$ L = Current\\ Loan\\ Balance $$`}</Latex>
                  <Latex>
                    {`$$ I = \\frac{Annual\\ Interest\\ Rate}{12} = ${(
                      loanAprCommitted / 12
                    ).toFixed(2)}\\%$$`}
                  </Latex>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="grid w-full max-w-xs gap-1.5">
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
          <div className="grid w-full max-w-xs gap-1.5">
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
          <div className="grid w-full max-w-xs gap-1.5">
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
          <div className="grid w-full max-w-xs gap-1.5">
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
        <div className="grid grid-cols-2 gap-4 mx-auto">
          <div className="grid w-full max-w-xs gap-1.5">
            <Label htmlFor="time-horizon" className="w-max">
              Time Horizon
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={2}
                id="time-horizon"
                placeholder="20"
                className="ml-2"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
              />
              <div className="text-sm text-gray-500 w-6">years</div>
            </div>
          </div>
          <div className="grid w-full max-w-xs gap-1.5">
            <Label htmlFor="monthly-contribution" className="w-max">
              Monthly Contribution
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                id="monthly-contribution"
                placeholder="500"
                className="ml-2"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500 w-16">Investment</div>
              <div className="text-sm text-gray-500 w-16">
                {(monthlyContribution * contributionBalanceLive).toFixed(0)}
              </div>
            </div>
            <Slider
              max={1}
              step={0.1}
              min={0}
              value={[contributionBalanceLive]}
              className={`ml-2`}
              onValueChange={(value) => setContributionBalanceLive(value[0])}
              onValueCommit={(value) =>
                setContributionBalanceCommitted(value[0])
              }
            />
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500 w-16">Loan</div>
              <div className="text-sm text-gray-500 w-16">
                {(monthlyContribution * (1 - contributionBalanceLive)).toFixed(
                  0
                )}
              </div>
            </div>
          </div>
        </div>
        <Accordion
          type="single"
          className="w-full max-w-lg opacity-75 mx-auto"
          collapsible
        >
          <AccordionItem value="mortgage-calc">
            <AccordionTrigger>Investment Equations</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <p>
                  The following is the equation for the monthly investment
                  balance.
                </p>
                {/* invest_balance +
                invest_balance * (return_rate / 12 - exp_ratio / 12) +
                calc_dividends(invest_balance, dividend_rate, timeFrame) +
                monthly_contribution; */}
                <Latex>
                  {
                    "$$ B = C + C * ( \\frac{F}{12} - \\frac{E}{12} ) + D + G $$"
                  }
                </Latex>
                <Latex>{"$$ B = Investment\\ Balance $$"}</Latex>
                <Latex>{"$$ C = Current\\ Investment\\ Balance $$"}</Latex>
                <Latex>{`$$ F = Annual\\ Return\\ Rate = ${invApr}\\%$$`}</Latex>
                <Latex>{`$$ E = Expense\\ Ratio $$ = ${expenseRatio}`}</Latex>
                <Latex>{`$$ D = Monthly\\ Dividends = C * D_R $$`}</Latex>
                <Latex>{`$$ D_R = Dividend\\ Rate = \\frac{${estDividend}}{${
                  timeFrame == "monthly" ? 1 : timeFrame == "quarterly" ? 3 : 12
                }}\\%$$`}</Latex>
                <Latex>{`$$ G = Monthly Contribution = ${
                  monthlyContribution * contributionBalanceCommitted
                } $$`}</Latex>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <p>
                  In order to calculate the cash value of the investment, we
                  need to apply the tax rate to the investment balance. We use
                  20% capital gains tax and 3.8% Net Investment Income Tax.
                </p>
                <Latex>{"$$ A = C * TR $$"}</Latex>
                <Latex>{"$$ A = Cash\\ Investment\\ Value $$"}</Latex>
                <Latex>{"$$ C = Current\\ Investment\\ Balance $$"}</Latex>
                <Latex>{`$$ TR = Tax\\ Rate = ${taxRate * 100}\\%$$`}</Latex>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="w-full h-96">
          <TimeChart data={chartData} />
        </div>
        <DataTable data={chartData} />
      </div>
    </>
  );
}

export default App;
