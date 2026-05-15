import { MainGuide } from "./MainGuide";
export default {
  title: "Components/MainGuide",
  component: MainGuide,
  tags: ["autodocs"],
  argTypes: {
    iconType: {
      control: "radio",
      options: ["heart", "arrow", "shield"],
    },
  },
};
export const Default = {
  args: {
    iconType: "heart",
    title: "건강 데이터 입력",
    content: "키, 나이, 체중 및 대사증후군 5대 요소를 간편하게 입력하세요",
  },
};
