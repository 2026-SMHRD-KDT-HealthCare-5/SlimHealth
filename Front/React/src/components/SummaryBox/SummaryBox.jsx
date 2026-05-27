import "./SummaryBox.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const SummaryBox = ({
  grade,
  overall_summary,
  syndrome_count,
  recommended_loss_kg,
  recommended_reason,
}) => {
  const gradeClass =
    grade === "위험" ? "danger" : grade === "주의" ? "warning" : "normal";

  return (
    <div className={`summaryBox ${gradeClass}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className={`summaryBadge ${gradeClass}`}>{grade}</span>
        <div style={{ fontSize: "30px", fontFamily: "Pretendard-Medium" }}>
          {overall_summary}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div className={`miniCard ${gradeClass}`}>
          <Text>대사증후군 항목</Text>
          <Text textStyle={"bold"}>{`${syndrome_count} / 5`}</Text>
        </div>
        <div className={`miniCard ${gradeClass}`}>
          <Text>권장 감량</Text>
          <Text textStyle={"bold"}>{`${recommended_loss_kg} kg`}</Text>
        </div>
      </div>
      <Text>{`${recommended_loss_kg}kg 감량 시, ${recommended_reason}`}</Text>
    </div>
  );
};
