import { Input } from "./Input";
export default {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["text", "password", "number"],
    },
  },
};
export const Default = {
  args: {
    title: "title",
    type: "text",
    maxLength: 30,
    fixWidth: 140,
    value: "",
    placeholder: "placeholder",
    onChange: () => {},
  },
};
