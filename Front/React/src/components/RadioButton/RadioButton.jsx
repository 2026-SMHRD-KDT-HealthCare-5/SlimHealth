import "./RadioButton.css";
import "../../index.css";
import { Text } from "../Text/Text";
import radioOff from "../../assets/radioOff.png";
import radioOn from "../../assets/radioOn.png";

export const RadioButton = ({ title, isChecked, onClick }) => {
  return (
    <div className="radioButton" onClick={onClick}>
      <Text textStyle={"medium"}>{title}</Text>
      <img
        src={isChecked ? radioOn : radioOff}
        style={{ width: 30, height: 30 }}
      />
    </div>
  );
};
