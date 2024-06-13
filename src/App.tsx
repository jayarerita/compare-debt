import { useState, useRef } from "react";
import "./App.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import Example from "./components/data/lineChart";

const DividendTimeFrame = () => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="dividend-time-frame" className="w-max">
        Dividend Time Frame
      </Label>
      <RadioGroup defaultValue="comfortable" className="ml-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="r1" />
          <Label htmlFor="r1">Monthly</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="comfortable" id="r2" />
          <Label htmlFor="r2">Quarterly</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Annually</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

function App() {
  const [loanAprLive, setLoanAprLive] = useState(5.0);
  const [loanAprCommitted, setLoanAprCommitted] = useState(5.0);

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
              />
              <div className="text-sm text-gray-500 w-16">%</div>
            </div>
          </div>
          <DividendTimeFrame />
        </div>
        <div className="mx-auto">
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="time-horizon" className="w-max">
              Time Horizon
            </Label>
            <Input
              type="number"
              id="time-horizon"
              placeholder="20"
              className="ml-2"
            />
          </div>
        </div>
        <div className="w-full h-96">
          <Example />
        </div>
      </div>
    </>
  );
}

export default App;
