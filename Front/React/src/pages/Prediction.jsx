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

//슬라이더 이미지 url은 나중에 정해지면 변경하기
const sliderImageList = [
  "https://i.namu.wiki/i/roIgweqptMj-UaG7urzHMTseZyGeOlRkCNlFTpJ3dxRK0gwYhEz1oT-67Pdpg1Ejs8f-qsU8dTAfKLXqPhCAmB36n5fXwqp1lG3Yhw9qCwgfvJDM_GXzlG-KX1Gt8b2eLaSimEqQs1Ry46ylSy6OWA.svg",
  "https://i.namu.wiki/i/fS7a7EGv-BXFYaHDTyt5MIIrc61OLHpTtWd1NQuS3yKFoRvFXJFjejBnM0ntDuDvuWf4G_i-Fba3sFcEhiLOhjR_3Mbl1x3SKbpxLQAOqlMxwq7B31kIyHlx_Jj2WW59Si2UB2FhvfoOJ03lc9r9gA.webp",
  "https://i.namu.wiki/i/NuGzMo8W2BdlRvl6Wtly48pGXa0Eg8n20NyrcBQJ47pcrwFQGCaQpZRq1T8ceSOOJc2xCEJTKXl99rU8eUFl4g.svg",
  "https://i.namu.wiki/i/pv5HAEyxu-Zy3LxzTRF6oEpwPvKDJgMXTAhW-HdpJdxMerCI0XU3lzcgOyImRQINA1FFTQbOMmCOCYd_wjeJf69rgLB73skFGgoqMIvzVwksSVllWk_4c08A-gd2s0ELZnPZVGTfbMTaSAm0VMU95A.webp",
  "https://i.namu.wiki/i/vPshBrZDJ1DPIZhPVvMwxFGxPj0w2xQyojtVF07PLDPO4znQ5Pc-g76o8soOuENrE6pV2zbD21QlVTYQg1t5Fedy5x6BpcliLKbjlxjXACBVwLqG6nBLgrBAxcK1QmdoyVt3GlXZqoDNUyk_9Ikkwg.webp",
];

const Prediction = () => {
  //슬라이더 부분
  const [sliderValue, setSliderValue] = useState(0);
  const [currentSliderImage, setCurrentSliderImage] = useState(
    sliderImageList[0],
  );
  const handleChangeSlider = (value) => {
    setSliderValue(value);
    setCurrentSliderImage(
      sliderImageList[
        parseInt(value / ((sliderWidth + 1) / sliderImageList.length))
      ],
    );
  };

  //요약 부분
  const [summary, setSummary] = useState(null);

  //5대 지표 예측 부분
  const [kpiResultList, setKpiResultList] = useState([]);

  //개선사항 부분
  const [improvementList, setImprovementList] = useState([]);

  //긴 분석내용 부분
  const [analysisContent, setAnalysisContent] = useState("");

  //api 연결 부분 필요
  useEffect(() => {
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

  //요약 박스 설정
  const fetchSummaryResult = async () => {
    try {
      const data = await getSummaryResultApi();
      setSummary(data);
    } catch (e) {
      console.log(e);
    }
  };

  //5대지표 예측결과 설정
  const fetchKPIPrediction = async () => {
    try {
      const data = await getKPIPredictionApi();
      //5대지표 예측결과 설정
      setKpiResultList(data);
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

  return (
    <div className="mainContainer">
      <TopNavigation isBackButton menuList={[]} />
      <div className="contentContainer">
        <div style={{ height: 50 }}></div>
        <Text textStyle={"bold"}>예측 결과</Text>
        <div style={{ height: 30 }}></div>
        <div className="horizontal-flex" style={{ width: "90%" }}>
          {/* 슬라이더 부분 */}
          <div className="vertical-flex">
            <img src={currentSliderImage} style={{ width: 300, height: 300 }} />
            <Slider onChange={handleChangeSlider} value={sliderValue} />
          </div>
          <div style={{ width: 90 }}></div>
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
        <div style={{ height: 50 }}></div>
        {/* 5대 지표 예측 부분 */}
        <div className="horizontal-grid-3" style={{ width: "90%" }}>
          {kpiResultList.map((item, index) => {
            return (
              <div className="horizontal-flex flex-align-center">
                <ResultBox
                  key={index}
                  currentValue={item.currentValue}
                  predictionValue={item.predictionValue}
                  title={item.title}
                  titleColor={item.titleColor}
                  unit={item.unit}
                />
              </div>
            );
          })}
        </div>
        <div style={{ height: 50 }}></div>
        {/* 개선사항 부분 */}
        <div
          className="bigcard vertical-flex flex-align-center"
          style={{ width: "90%", gap: 30 }}
        >
          <div style={{ width: 850 }}>
            <Text textStyle={"medium"}>개선사항</Text>
          </div>
          {improvementList.map((item, index) => {
            return (
              <ImprovementBox
                key={index}
                content={item.content}
                iconType={item.iconType}
                title={item.title}
              />
            );
          })}
        </div>
        <div style={{ height: 30 }}></div>
        {/* 차트 부분 */}
        <div className="bigcard" style={{ width: "90%" }}>
          <KpiBarChart
            metrics={kpiResultList.map((item) => {
              return {
                current: item.currentValue,
                name: item.title,
                target: item.predictionValue,
              };
            })}
          />
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
    </div>
  );
};

export default Prediction;
