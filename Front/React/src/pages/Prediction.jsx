import React, { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Text } from "../components/Text/Text";
import { SummaryBox } from "../components/SummaryBox/SummaryBox";
import { ResultBox } from "../components/ResultBox/ResultBox";
import { ImprovementBox } from "../components/ImprovementBox/ImprovementBox";
import { Slider } from "../components/Slider";
import { getHealthAdviceApi, getHealthDataApi } from "../api/healthDataApi";
import { EBarChart } from "../components/EBarChart/EBarChart";
import {
  getBmi,
  getCurrentCharacterStage,
  sliderImageList,
  sliderValueToWeight,
  weightToSliderValue,
} from "../utils/utils";
import { useSearchParams } from "react-router-dom";
import { convertKPIResultList } from "../features/Prediction/utils";
import Context from "../context/context";
import PredictionTopUI from "../features/Prediction/PredictionTopUI";

const Prediction = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  //예측 데이터 불러오기
  const { data: predictionData } = useSuspenseQuery({
    queryKey: ["prediction", id],
    queryFn: async () => {
      const [healthData, adviceData] = await Promise.all([
        getHealthDataApi(id),
        getHealthAdviceApi(id),
      ]);

      return { healthData, adviceData };
    },
  });

  const { healthData, adviceData } = predictionData;

  const improvementList = adviceData.lifestyle_tips;
  const analysisContent = adviceData.total_advice;

  return (
    <div className="contentContainer">
      <div style={{ height: 20 }}></div>
      <Text textStyle={"bold"}>예측 결과</Text>
      <div style={{ height: 20 }}></div>
      <PredictionTopUI healthData={healthData} adviceData={adviceData} />
      <div style={{ height: 30 }}></div>
      {/* 개선사항 부분 */}
      <div
        className="bigcard vertical-flex flex-align-center"
        style={{ width: "90%", gap: 30 }}
      >
        <div style={{ width: 850 }}>
          <Text textStyle={"medium"}>개선사항</Text>
        </div>
        {improvementList && (
          <>
            <ImprovementBox
              content={improvementList.diet}
              iconType={"heart"}
              title={"식습관 개선"}
            />
            <ImprovementBox
              content={improvementList.exercise}
              iconType={"lightning"}
              title={"운동하기"}
            />
            <ImprovementBox
              content={improvementList.habit}
              iconType={"check"}
              title={"생활습관 개선"}
            />
          </>
        )}
      </div>
      <div style={{ height: 30 }}></div>
      {/* 긴 분석내용 부분 */}
      {analysisContent && analysisContent.length > 0 && (
        <div
          className="bigcard vertical-flex"
          style={{ width: "90%", padding: "30px 40px", gap: 16 }}
        >
          <Text textStyle={"medium"}>종합 건강 분석</Text>
          <div
            style={{ width: "100%", height: 1, backgroundColor: "#e0e0e0" }}
          />
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
      )}
      <div style={{ height: 30 }}></div>
    </div>
  );
};

export default Prediction;
