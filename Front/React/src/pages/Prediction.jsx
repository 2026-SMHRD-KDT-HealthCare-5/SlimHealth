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
import PredictionImprovementUI from "../features/Prediction/PredictionImprovementUI";
import PredictionAnalysisUI from "../features/Prediction/PredictionAnalysisUI";

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
        <PredictionImprovementUI adviceData={adviceData} />
      </div>
      <div style={{ height: 30 }}></div>
      {/* 긴 분석내용 부분 */}
      <PredictionAnalysisUI adviceData={adviceData} />
      <div style={{ height: 30 }}></div>
    </div>
  );
};

export default Prediction;
