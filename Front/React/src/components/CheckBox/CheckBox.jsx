import "./CheckBox.css";
import "../../index.css";
import checkbox from "../../assets/checkbox.png";
import unchecked from "../../assets/unchecked.png";
import { Text } from "../Text/Text";
import { checkBoxSize } from "../../utils/utils";

export const CheckBox = ({ title, isChecked, onClick }) => {
  return (
    <div className="checkBox" onClick={onClick}>
      <Text textStyle={"medium"}>{title}</Text>
      <img
        src={isChecked ? checkbox : unchecked}
        style={{ width: checkBoxSize, height: checkBoxSize }}
      />
    </div>
  );
};
