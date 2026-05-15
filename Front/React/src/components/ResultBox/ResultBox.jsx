import "./ResultBox.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const ResultBox = ({
  title,
  titleColor,
  unit,
  currentValue,
  predictionValue,
}) => {
  return (
    <div className="resultBox">
      <div style={{ color: titleColor }}>
        <Text textStyle={"bold"}>{title}</Text>
      </div>
      <div className="resultValueBox">
        <Text textStyle={"medium"}>{`현재 : ${currentValue} ${unit}`}</Text>
        <Text textStyle={"medium"}>{`예측 : ${predictionValue} ${unit}`}</Text>
      </div>
    </div>
  );
};
