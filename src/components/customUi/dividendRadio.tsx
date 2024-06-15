import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type DividendTimeFrameProps = {
    timeFrame: "monthly" | "quarterly" | "annually";
    setTimeFrame: (timeFrame: "monthly" | "quarterly" | "annually") => void;
  };
  
export const DividendTimeFrame = ({
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
        className="ml-2 flex"
        onValueChange={(value) => {
        handleRadioChange(value);
        }}
    >
        <div className="flex items-center space-x-2">
        <RadioGroupItem value="monthly" id="r1" />
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