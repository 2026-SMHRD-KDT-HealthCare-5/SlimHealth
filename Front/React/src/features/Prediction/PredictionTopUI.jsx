import React, { useMemo, useState } from "react";
import {
  getBmi,
  getCurrentCharacterStage,
  sliderImageList,
  sliderValueToWeight,
  weightToSliderValue,
} from "../../utils/utils";
import { convertKPIResultList } from "./utils";
import { Slider } from "../../components/Slider";
import { SummaryBox } from "../../components/SummaryBox/SummaryBox";
import { ResultBox } from "../../components/ResultBox/ResultBox";
import { EBarChart } from "../../components/EBarChart/EBarChart";
import { Text } from "../../components/Text/Text";

const PredictionTopUI = ({ healthData, adviceData }) => {
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
    return convertKPIResultList(healthData, adviceData).map((item) => ({
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
    <div className="horizontal-flex" style={{ width: "90%", gap: 20 }}>
      <div className="vertical-flex">
        <div className="horizontal-flex">
          {/* 슬라이더 부분 */}
          <div className="vertical-flex flex-align-center" style={{ gap: 0 }}>
            <img src={currentSliderImage} style={{ width: 270, height: 361 }} />
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
  );
};

export default PredictionTopUI;
