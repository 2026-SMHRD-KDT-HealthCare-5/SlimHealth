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

//슬라이더 이미지 url은 나중에 정해지면 변경하기
const sliderImageList = [
  character1,
  character2,
  character3,
  character4,
  character5,
];

const Prediction = () => {
  //슬라이더 부분
  const [sliderValue, setSliderValue] = useState(0);
  const [currentSliderImage, setCurrentSliderImage] = useState(
    sliderImageList[0],
  );

  //요약 부분
  const [summary, setSummary] = useState(null);

  //5대 지표 예측 부분
  const [kpiResultList, setKpiResultList] = useState([]);

  //개선사항 부분
  const [improvementList, setImprovementList] = useState([]);

  //긴 분석내용 부분
  const [analysisContent, setAnalysisContent] = useState("");

  const handleChangeSlider = (value, isSetResult) => {
    setSliderValue(value);
    setCurrentSliderImage(
      sliderImageList[
        parseInt(value / ((sliderWidth + 1) / sliderImageList.length))
      ],
    );

    //예측 부분 조정
    if (isSetResult) {
      setKpiResultList(
        kpiResultList.map((item) => {
          return {
            ...item,
            predictionValue: parseInt(80 + value),
          };
        }),
      );
    }
  };

  //요약 박스 설정
  const fetchSummaryResult = async () => {
    try {
      const data = await getSummaryResultApi();
      setSummary(data);
    } catch (e) {
      console.log(e);
    }
  };

  //개선사항 설정
  const fetchImprovementList = async () => {
    try {
      const data = await getImprovementListApi();
      setImprovementList(data);
    } catch (e) {
      console.log(e);
    }
  };

  //분석내용 설정
  const fetchAnalysisContent = async () => {
    try {
      const data = await getAnalysisContentApi();
      setAnalysisContent(data);
    } catch (e) {
      console.log(e);
    }
  };

  //api 연결 부분 필요
  useEffect(() => {
    //5대지표 예측결과 및 슬라이더 초기값 설정
    const fetchKPIPrediction = async () => {
      try {
        const data = await getKPIPredictionApi();
        //5대지표 예측결과 설정
        setKpiResultList(data.result);

        setSliderValue(data.sliderValue);
        setCurrentSliderImage(
          sliderImageList[
            parseInt(
              data.sliderValue / ((sliderWidth + 1) / sliderImageList.length),
            )
          ],
        );
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
  }, []);

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
                style={{ width: 160, height: 361 }}
              />
              <Slider
                onChange={(value) => {
                  handleChangeSlider(value, true);
                }}
                value={sliderValue}
                maxValue={140}
                minValue={70}
              />
            </div>
            <div style={{ width: 30 }}></div>
            {/* 건강 요약 부분 */}
            <div className="vertical-flex flex-align-center">
              {summary && (
                <SummaryBox
                  description={summary.description}
                  grade={summary.grade}
                  score={summary.score}
                  title={summary.title}
                />
              )}
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          {/* 5대 지표 예측 부분 */}
          <div className="horizontal-flex">
            <div className="horizontal-grid-3">
              {kpiResultList.map((item) => {
                return (
                  <ResultBox
                    key={item.key}
                    currentValue={item.currentValue}
                    predictionValue={item.predictionValue}
                    title={item.title}
                    titleColor={item.titleColor}
                    backgroundColor={item.backgroundColor}
                    isShadow={item.isShadow}
                    unit={item.unit}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* 차트 부분 */}
        <div className="bigcard" style={{ flex: 1 }}>
          <EBarChart
            metrics={kpiResultList.map((item) => {
              return {
                current: item.currentValue,
                name: item.title,
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
        {improvementList.map((item) => {
          return (
            <ImprovementBox
              key={item.id}
              content={item.content}
              iconType={item.iconType}
              title={item.title}
            />
          );
        })}
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
