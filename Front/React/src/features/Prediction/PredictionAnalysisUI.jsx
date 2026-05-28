import React from "react";
import { Text } from "../../components/Text/Text";

const PredictionAnalysisUI = ({ adviceData }) => {
  const analysisContent = adviceData.total_advice;
  return (
    analysisContent &&
    analysisContent.length > 0 && (
      <div
        className="bigcard vertical-flex"
        style={{ width: "90%", padding: "30px 40px", gap: 16 }}
      >
        <Text textStyle={"medium"}>종합 건강 분석</Text>
        <div style={{ width: "100%", height: 1, backgroundColor: "#e0e0e0" }} />
        <ul
          style={{
            margin: 0,
            padding: "0 0 0 8px",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {(Array.isArray(analysisContent)
            ? analysisContent
            : [analysisContent]
          ).map((item, idx) => (
            <li
              key={idx}
              style={{
                fontFamily: "Pretendard-Regular",
                fontSize: 22,
                lineHeight: 1.8,
                color: "#444",
                paddingLeft: 24,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: "#5b8dee",
                  fontWeight: "bold",
                }}
              >
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default PredictionAnalysisUI;
