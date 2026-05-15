import "./Button.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const Button = ({ children, onClick, isDisabled }) => {
  return (
    <div
      className={`button ${isDisabled && "disabled"}`}
      onClick={isDisabled ? () => {} : onClick}
    >
      <Text align="center">{children}</Text>
    </div>
  );
};
