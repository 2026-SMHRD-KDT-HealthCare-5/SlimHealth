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
import { convertKPIResultList } from "../features/predictionFeatures";
import Context from "../context/context";

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

  //슬라이더 부분 계산
  const predictions = healthData.predictions;
  const sliderMaxValue = parseInt(healthData.physical.weight);
  const sliderMinValue = sliderMaxValue - predictions.length;
  const maxLossKg = predictions.length;

  const initialWeight = sliderMaxValue;
  const bmi = getBmi(healthData.physical.height, initialWeight);

  const [sliderValue, setSliderValue] = useState(
    weightToSliderValue(initialWeight, sliderMaxValue, sliderMinValue),
  );
  const [weight, setWeight] = useState(initialWeight);

  const currentLossKg = sliderMaxValue - weight;

  const currentSliderImage = useMemo(() => {
    return sliderImageList[
      getCurrentCharacterStage({
        bmi,
        currentLossKg,
        maxLossKg,
      }) - 1
    ];
  }, [bmi, currentLossKg, maxLossKg]);

  //5대 지표 부분
  const kpiResultList = useMemo(() => {
    return convertKPIResultList(adviceData).map((item) => ({
      ...item,
      predictionValue:
        currentLossKg === 0
          ? item.current_value
          : predictions[predictions.length - currentLossKg][item.key],
    }));
  }, [adviceData, predictions, currentLossKg]);

  //요약 박스
  const summary = {
    grade: adviceData.risk_level,
    overall_summary: adviceData.overall_summary,
    syndrome_count: adviceData.syndrome_count,
    recommended_loss_kg: adviceData.recommended_loss_kg,
    recommended_reason: adviceData.recommended_reason,
  };

  const improvementList = adviceData.lifestyle_tips;
  const analysisContent = adviceData.total_advice;

  const handleChangeSlider = (value) => {
    setSliderValue(value);

    const nextWeight = sliderValueToWeight(
      value,
      sliderMaxValue,
      sliderMinValue,
    );

    setWeight(nextWeight);
  };

  return (
    <div className="contentContainer">
      <div style={{ height: 20 }}></div>
      <Text textStyle={"bold"}>예측 결과</Text>
      <div style={{ height: 20 }}></div>
      <div className="horizontal-flex" style={{ width: "90%", gap: 20 }}>
        <div className="vertical-flex">
          <div className="horizontal-flex">
            {/* 슬라이더 부분 */}
            <div className="vertical-flex flex-align-center" style={{ gap: 0 }}>
              <img
                src={currentSliderImage}
                style={{ width: 270, height: 361 }}
              />
              <Slider
                onChange={(value) => {
                  handleChangeSlider(value);
                }}
                value={sliderValue}
                maxValue={sliderMaxValue}
                minValue={sliderMinValue}
              />
              <div style={{ height: 10 }}></div>
              <Text>{`예측 체중 : ${weight}kg`}</Text>
            </div>
            <div style={{ width: 30 }}></div>
            {/* 건강 요약 부분 */}
            <div className="vertical-flex flex-align-center">
              {summary && (
                <SummaryBox
                  grade={summary.grade}
                  overall_summary={summary.overall_summary}
                  syndrome_count={summary.syndrome_count}
                  recommended_loss_kg={summary.recommended_loss_kg}
                  recommended_reason={summary.recommended_reason}
                />
              )}
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          {/* 5대 지표 예측 부분 */}
          <div className="horizontal-flex">
            <div className="horizontal-grid-3">
              {kpiResultList.map((item) => {
                return (
                  <ResultBox
                    key={item.key}
                    title={item.indicator}
                    status={item.status}
                    unit={item.unit}
                    currentValue={item.current_value}
                    predictionValue={item.predictionValue}
                    improvementContent={item.message}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* 차트 부분 */}
        <div className="bigcard" style={{ flex: 1, padding: 10 }}>
          <EBarChart
            metrics={kpiResultList.map((item) => {
              return {
                current: item.current_value,
                name: item.indicator,
                target: item.predictionValue,
              };
            })}
          />
        </div>
      </div>
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
      {analysisContent && (
        <div className="bigcard vertical-flex" style={{ width: "90%" }}>
          <Text>{analysisContent}</Text>
        </div>
      )}
      <div style={{ height: 30 }}></div>
    </div>
  );
};

export default Prediction;
