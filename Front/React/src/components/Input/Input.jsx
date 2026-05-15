import "./Input.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const Input = ({
  title,
  fixWidth,
  type,
  maxLength,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="input">
      <div style={fixWidth ? { width: fixWidth, textAlign: "right" } : {}}>
        <Text>{title}</Text>
      </div>
      <input
        className="inputBox"
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
