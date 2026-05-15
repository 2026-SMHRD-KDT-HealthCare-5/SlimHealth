import { MemoryRouter } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
export default {
  title: "Components/TopNavigation",
  component: TopNavigation,
  tags: ["autodocs"],
  argTypes: {
    menuList: {
      control: "check",
      options: ["login", "join", "main", "dataInput", "prediction", "logout"],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export const Default = { args: { menuList: [], isBackButton: false } };
