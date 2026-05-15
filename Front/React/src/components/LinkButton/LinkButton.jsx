import "./LinkButton.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const LinkButton = ({ children, onClick, isDisabled }) => {
  return (
    <div
      className={`linkButton ${isDisabled && "disableLink"}`}
      onClick={isDisabled ? () => {} : onClick}
    >
      <Text isUnderLine>{children}</Text>
    </div>
  );
};
