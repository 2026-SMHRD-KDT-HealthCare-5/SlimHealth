import { SummaryBox } from "./SummaryBox";
export default {
  title: "Components/SummaryBox",
  component: SummaryBox,
  tags: ["autodocs"],
  argTypes: {
    grade: {
      control: "radio",
      options: ["위험", "주의", "정상"],
    },
  },
};
export const Default = {
  args: {
    grade: "위험",
    title: "건강 주의보! 지금 바로 확인하세요!",
    score: 72,
    description:
      "대사증후군 위험군에 해당할 수 있습니다. 방치하면 당뇨병, 고혈압, 심혈관 질환의 위험이 3배 이상 증가합니다!",
  },
};
