import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TimeChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value, name, item, index, payload) =>
            parseInt(value.toString())
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="investBalance"
          stroke="#143d59"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="loanBalance"
          stroke="#fcac3b"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cashInvestmentValue"
          stroke="#3894d2"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
