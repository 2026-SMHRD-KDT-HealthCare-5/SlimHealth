import "./ResultBox.css";
import "../../index.css";
import { Text } from "../Text/Text";

const STATUS_THEME = {
  위험: {
    bg: "#FCEBEB",
    title: "#791F1F",
    value: "#501313",
    unit: "#A32D2D",
    predict: "#A32D2D",
    message: "#791F1F",
    badgeBg: "#E24B4A",
    badgeText: "#501313",
  },
  주의: {
    bg: "#FAEEDA",
    title: "#633806",
    value: "#412402",
    unit: "#854F0B",
    predict: "#854F0B",
    message: "#633806",
    badgeBg: "#EF9F27",
    badgeText: "#412402",
  },
  정상: {
    bg: "#E1F5EE",
    title: "#085041",
    value: "#04342C",
    unit: "#0F6E56",
    predict: "#0F6E56",
    message: "#085041",
    badgeBg: "#1D9E75",
    badgeText: "#04342C",
  },
};

export const ResultBox = ({
  title,
  status,
  unit,
  currentValue,
  predictionValue,
  improvementContent,
}) => {
  const theme = STATUS_THEME[status];

  return (
    <div
      className="resultBox"
      style={{
        background: theme.bg,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: theme.title,
            margin: 0,
          }}
        >
          {title}
        </p>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            background: theme.badgeBg,
            color: theme.badgeText,
            padding: "2px 8px",
            borderRadius: 99,
          }}
        >
          {status}
        </span>
      </div>

      {/* 현재값 */}
      <p
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: theme.value,
          margin: "0 0 2px",
        }}
      >
        <span style={{ fontSize: 18, color: theme.unit }}> 현재 : </span>
        {currentValue}
        <span style={{ fontSize: 18, color: theme.unit }}> {unit}</span>
      </p>

      {/* 예측값 */}
      <p style={{ fontSize: 18, color: theme.predict, margin: "0 0 8px" }}>
        예측 :{" "}
        <span style={{ fontSize: 22, color: theme.value }}>
          {predictionValue}
        </span>{" "}
        {unit}
      </p>

      {/* 상태 설명 */}
      <p
        style={{
          fontSize: 14,
          color: theme.message,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {improvementContent}
      </p>
    </div>
  );
};
