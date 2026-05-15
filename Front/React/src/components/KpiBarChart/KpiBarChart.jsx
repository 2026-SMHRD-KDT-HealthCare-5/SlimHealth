import "./KpiBarChart.css";
import "../../index.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const KpiBarChart = ({ metrics }) => {
  return (
    <div className="kpiBarChart">
      <ResponsiveContainer>
        <BarChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />
          <Legend />

          {/* 현재값 */}
          <Bar
            dataKey="current"
            name="현재값"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />

          {/* 예측값 */}
          <Bar
            dataKey="target"
            name="예측값"
            fill="#94a3b8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
