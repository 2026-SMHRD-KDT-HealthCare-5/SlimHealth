import "./SummaryBox.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const SummaryBox = ({ grade, title, score, description }) => {
  return (
    <div className={`summaryBox ${grade}`}>
      <Text textStyle={"bold"}>{title}</Text>
      <Text
        textStyle={"medium"}
      >{`당신의 건강 점수는 ${score}/100점입니다.`}</Text>
      <Text>{description}</Text>
    </div>
  );
};
