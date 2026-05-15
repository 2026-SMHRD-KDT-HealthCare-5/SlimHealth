import "./OutlinedButton.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const OutlinedButton = ({ children, onClick, isDisabled }) => {
  return (
    <div
      className={`outlinedButton ${isDisabled && "disabled"}`}
      onClick={isDisabled ? () => {} : onClick}
    >
      <Text>{children}</Text>
    </div>
  );
};
