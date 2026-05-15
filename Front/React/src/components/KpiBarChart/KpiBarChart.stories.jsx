import { KpiBarChart } from "./KpiBarChart";
export default {
  title: "Components/KpiBarChart",
  component: KpiBarChart,
  tags: ["autodocs"],
};
export const Default = {
  args: {
    metrics: [
      { name: "허리둘레", current: 72, target: 100 },
      { name: "혈압", current: 45, target: 60 },
      { name: "중성지방", current: 80, target: 90 },
      { name: "HDL", current: 55, target: 70 },
      { name: "혈당", current: 92, target: 95 },
    ],
  },
};
