import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type LoanTermProps = {
    loanTerm: 15 | 30;
    setLoanTerm: (loanTerm: 15 | 30) => void;
  };
  
export const LoanTerm = ({
loanTerm,
setLoanTerm,
}: LoanTermProps) => {
// Add a change handler to the RadioGroup component
const handleRadioChange = (value: string) => {
    const numberValue = parseInt(value);
    setLoanTerm(numberValue as 15 | 30);
};

return (
    <div className="grid w-full gap-1.5">
    <Label htmlFor="dividend-time-frame" className="w-max">
        Loan Term
    </Label>
    <RadioGroup
        value={loanTerm.toString() as "15" | "30"}
        className="ml-2 flex"
        onValueChange={(value) => {
        handleRadioChange(value);
        }}
    >
        <div className="flex items-center space-x-2">
        <RadioGroupItem value="15" id="r1" />
        <Label htmlFor="r1">15 years</Label>
        </div>
        <div className="flex items-center space-x-2">
        <RadioGroupItem value="30" id="r2" />
        <Label htmlFor="r2">30 years</Label>
        </div>
    </RadioGroup>
    </div>
);
};