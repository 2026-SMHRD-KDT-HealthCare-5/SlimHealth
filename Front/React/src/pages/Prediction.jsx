import React, { useEffect, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { SummaryBox } from "../components/SummaryBox/SummaryBox";
import { ResultBox } from "../components/ResultBox/ResultBox";
import { ImprovementBox } from "../components/ImprovementBox/ImprovementBox";
import { KpiBarChart } from "../components/KpiBarChart/KpiBarChart";
import { Slider, sliderWidth } from "../components/Slider";
import {
  getAnalysisContentApi,
  getImprovementListApi,
  getKPIPredictionApi,
  getSummaryResultApi,
} from "../api/healthDataApi";
import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";
import character5 from "../assets/character5.png";
import { EBarChart } from "../components/EBarChart/EBarChart";
import {
  getCurrentCharacterStage,
  sliderImageList,
  sliderValueToWeight,
  weightToSliderValue,
} from "../utils/utils";
import { useSearchParams } from "react-router-dom";

const Prediction = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");

  //슬라이더 부분
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(0);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [maxLossKg, setMaxLossKg] = useState(0);
  const [weight, setWeight] = useState(0);
  const [currentSliderImage, setCurrentSliderImage] = useState(
    sliderImageList[0],
  );

  //요약 부분
  const [summary, setSummary] = useState(null);

  //5대 지표 예측 부분
  const [kpiResultList, setKpiResultList] = useState([]);

  //개선사항 부분
  const [improvementList, setImprovementList] = useState({});

  //긴 분석내용 부분
  const [analysisContent, setAnalysisContent] = useState("");

  const handleChangeSlider = (value, isSetResult) => {
    setSliderValue(value);

    const tempWeight = sliderValueToWeight(
      value,
      sliderMaxValue,
      sliderMinValue,
    );
    setWeight(tempWeight);

    setCurrentSliderImage(
      sliderImageList[
        getCurrentCharacterStage({
          bmi,
          currentLossKg: sliderMaxValue - tempWeight,
          maxLossKg,
        }) - 1
      ],
    );

    //예측 부분 조정
    if (isSetResult) {
      setKpiResultList((prev) =>
        prev.map((item) => ({
          ...item,
          predictionValue: parseInt(80 + value),
        })),
      );
    }
  };

  //api 연결 부분 필요
  useEffect(() => {
    //5대지표 예측결과 및 슬라이더 초기값 설정
    const fetchKPIPrediction = async () => {
      try {
        const data = await getKPIPredictionApi(id);
        //5대지표 예측결과 설정
        setKpiResultList(data.result);

        const tempSliderMaxValue = data.weight;
        setSliderMaxValue(tempSliderMaxValue);
        const tempSliderMinValue = data.weight - data.max_loss_kg;
        setSliderMinValue(tempSliderMinValue);

        const tempWeight = data.weight;
        setWeight(tempWeight);
        const tempBmi = data.current_bmi;
        setBmi(tempBmi);
        const tempMaxLossKg = data.max_loss_kg;
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
      } catch (e) {
        console.log(e);
      }
    };

    //요약 박스 설정
    const fetchSummaryResult = async () => {
      try {
        const data = await getSummaryResultApi(id);
        setSummary(data);
      } catch (e) {
        console.log(e);
      }
    };

    //개선사항 설정
    const fetchImprovementList = async () => {
      try {
        const data = await getImprovementListApi(id);
        setImprovementList(data);
      } catch (e) {
        console.log(e);
      }
    };

    //분석내용 설정
    const fetchAnalysisContent = async () => {
      try {
        const data = await getAnalysisContentApi(id);
        setAnalysisContent(data);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchSummaryResult(),
        fetchKPIPrediction(),
        fetchImprovementList(),
        fetchAnalysisContent(),
      ]);
    };
    fetchData();
  }, [id]);

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
                  handleChangeSlider(value, true);
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
                  description={summary.description}
                  grade={summary.risk_level}
                  score={summary.score}
                  title={summary.title}
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
