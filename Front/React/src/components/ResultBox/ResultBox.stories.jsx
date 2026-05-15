import { ResultBox } from "./ResultBox";
export default {
  title: "Components/ResultBox",
  component: ResultBox,
  tags: ["autodocs"],
  argTypes: {
    titleColor: {
      control: "radio",
      options: ["black", "red", "blue"],
    },
  },
};
export const Default = {
  args: {
    title: "혈당",
    titleColor: "black",
    unit: "mg/dl",
    currentValue: 150,
    predictionValue: 150,
  },
};
