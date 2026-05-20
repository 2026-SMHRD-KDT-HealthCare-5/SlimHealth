import { TableData } from "./TableData";
export default {
  title: "Components/TableData",
  component: TableData,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <tr>
            <Story />
          </tr>
        </tbody>
      </table>
    ),
  ],
};
export const Default = {
  args: {
    children: "TableData",
    isThick: false,
  },
};
