import { ImprovementBox } from "./ImprovementBox";
export default {
  title: "Components/ImprovementBox",
  component: ImprovementBox,
  tags: ["autodocs"],
  argTypes: {
    iconType: {
      control: "radio",
      options: ["heart", "check", "lightning", "arrow"],
    },
  },
};
export const Default = {
  args: {
    title: "식습관 개선",
    content:
      "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
    iconType: "heart",
  },
};
