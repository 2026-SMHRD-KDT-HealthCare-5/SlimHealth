import { Text } from "./Text";
export default {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    textStyle: {
      control: "radio",
      options: ["", "medium", "bold"],
    },
    align: {
      control: "radio",
      options: ["left", "center", "right"],
    },
  },
};
export const Default = {
  args: { children: "Text", textStyle: "", align: "left" },
};
