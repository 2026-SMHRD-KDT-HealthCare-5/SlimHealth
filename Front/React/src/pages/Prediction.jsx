import React, { useContext, useEffect, useState } from "react";
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
  const { isLoading, setIsLoading } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");

  //슬라이더 부분
  const [predictions, setPredictions] = useState([]);

  const [currentSliderImage, setCurrentSliderImage] = useState(
    sliderImageList[0],
  );

  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(0);
  const [sliderMinValue, setSliderMinValue] = useState(0);

  const [bmi, setBmi] = useState(0);
  const [maxLossKg, setMaxLossKg] = useState(0);
  const [weight, setWeight] = useState(0);

  //요약 부분
  const [summary, setSummary] = useState(null);

  //5대 지표 예측 부분
  const [kpiResultList, setKpiResultList] = useState([]);

  //개선사항 부분
  const [improvementList, setImprovementList] = useState(null);

  //긴 분석내용 부분
  const [analysisContent, setAnalysisContent] = useState("");

  const handleChangeSlider = (value) => {
    setSliderValue(value);

    const tempWeight = sliderValueToWeight(
      value,
      sliderMaxValue,
      sliderMinValue,
    );
    setWeight(tempWeight);

    const currentLossKg = sliderMaxValue - tempWeight;
    setCurrentSliderImage(
      sliderImageList[
        getCurrentCharacterStage({
          bmi,
          currentLossKg,
          maxLossKg,
        }) - 1
      ],
    );

    //예측 부분 조정
    setKpiResultList((prev) =>
      prev.map((item) => ({
        ...item,
        predictionValue:
          currentLossKg == 0
            ? item.current_value
            : predictions[predictions.length - currentLossKg][item.key],
      })),
    );
  };

  useEffect(() => {
    //5대지표 예측결과 및 슬라이더 초기값 설정
    const fetchKPIPrediction = async () => {
      setIsLoading(true);
      try {
        const [data, adviceData] = await Promise.all([
          getHealthDataApi(id),
          getHealthAdviceApi(id),
        ]);

        const tempPredictions = data.predictions;
        setPredictions(tempPredictions);

        const tempSliderMaxValue = parseInt(data.physical.weight);
        setSliderMaxValue(tempSliderMaxValue);
        const tempSliderMinValue =
          parseInt(data.physical.weight) - data.predictions.length;
        setSliderMinValue(tempSliderMinValue);

        const tempWeight = parseInt(data.physical.weight);
        setWeight(tempWeight);
        const tempBmi = getBmi(data.physical.height, tempWeight);
        setBmi(tempBmi);
        const tempMaxLossKg = data.predictions.length;
        setMaxLossKg(tempMaxLossKg);

        const sliderVal = weightToSliderValue(
          tempWeight,
          tempSliderMaxValue,
          tempSliderMinValue,
        );
        setSliderValue(sliderVal);

        setCurrentSliderImage(
          sliderImageList[
            getCurrentCharacterStage({
              bmi: tempBmi,
              currentLossKg: tempSliderMaxValue - tempWeight,
              maxLossKg: tempMaxLossKg,
            }) - 1
          ],
        );

        //5대지표 예측결과 설정
        setKpiResultList(convertKPIResultList(adviceData));

        //요약박스 설정
        setSummary({
          grade: adviceData.risk_level,
          overall_summary: adviceData.overall_summary,
          syndrome_count: adviceData.syndrome_count,
          recommended_loss_kg: adviceData.recommended_loss_kg,
          recommended_reason: adviceData.recommended_reason,
        });

        //개선사항 설정
        setImprovementList(adviceData.lifestyle_tips);

        //긴 분석내용 설정
        setAnalysisContent(adviceData.total_advice);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIPrediction();
  }, [id, setIsLoading]);

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
      {analysisContent && analysisContent.length > 0 && (
        <div className="bigcard vertical-flex" style={{ width: "90%", padding: "30px 40px", gap: 16 }}>
          <Text textStyle={"medium"}>종합 건강 분석</Text>
          <div style={{ width: "100%", height: 1, backgroundColor: "#e0e0e0" }} />
          <ul style={{ margin: 0, padding: "0 0 0 8px", listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            {(Array.isArray(analysisContent) ? analysisContent : [analysisContent]).map((item, idx) => (
              <li key={idx} style={{ fontFamily: "Pretendard-Regular", fontSize: 22, lineHeight: 1.8, color: "#444", paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#5b8dee", fontWeight: "bold" }}>•</span>
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
