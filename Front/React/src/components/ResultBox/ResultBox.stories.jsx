import { ResultBox } from "./ResultBox";
export default {
  title: "Components/ResultBox",
  component: ResultBox,
  tags: ["autodocs"],
  argTypes: {
    titleColor: {
      control: "radio",
      options: ["위험", "주의", "정상"],
    },
  },
};
export const Default = {
  args: {
    title: "혈당",
    status: "위험",
    unit: "mg/dl",
    currentValue: 150,
    predictionValue: 150,
    improvementContent:
      "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
  },
};
