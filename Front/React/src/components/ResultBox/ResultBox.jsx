import "./ResultBox.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const ResultBox = ({
  title,
  titleColor,
  backgroundColor,
  isShadow,
  unit,
  currentValue,
  predictionValue,
  improvementContent,
}) => {
  return (
    <div
      className="resultBox"
      style={{ backgroundColor: backgroundColor || "white" }}
    >
      <div
        className="horizontal-flex flex-align-center"
        style={{ gap: 30, width: "100%" }}
      >
        <div style={{ color: titleColor }}>
          <Text textStyle={"bold"} isShadow={isShadow}>
            {title}
          </Text>
        </div>
        <div className="resultValueBox">
          <Text textStyle={"medium"}>{`현재 : ${currentValue} ${unit}`}</Text>
          <Text
            textStyle={"medium"}
          >{`예측 : ${predictionValue} ${unit}`}</Text>
        </div>
      </div>
      <Text>{improvementContent}</Text>
    </div>
  );
};
