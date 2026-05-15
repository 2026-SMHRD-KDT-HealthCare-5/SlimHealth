import "./CheckBox.css";
import "../../index.css";
import checkbox from "../../assets/checkbox.png";
import unchecked from "../../assets/unchecked.png";
import { Text } from "../Text/Text";

export const CheckBox = ({ title, isChecked, onClick }) => {
  return (
    <div className="checkBox" onClick={onClick}>
      <Text textStyle={"medium"}>{title}</Text>
      <img
        src={isChecked ? checkbox : unchecked}
        style={{ width: 30, height: 30 }}
      />
    </div>
  );
};
