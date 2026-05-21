import "./SummaryBox.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const SummaryBox = ({ grade, title, score, description }) => {
  const gradeClass =
    grade === "위험" ? "danger" : grade === "주의" ? "warning" : "normal";
  return (
    <div className={`summaryBox ${gradeClass}`}>
      <Text textStyle={"bold"}>{title}</Text>
      <Text
        textStyle={"medium"}
      >{`당신의 건강 점수는 ${score}/100점입니다.`}</Text>
      <Text>{description}</Text>
    </div>
  );
};
