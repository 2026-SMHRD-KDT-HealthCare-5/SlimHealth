import client from "./axios";

//건강 데이터 저장 api
export const saveHealthDataApi = (body) => {
  return new Promise((resolve) => {
    resolve("데이터 저장 성공!");
  });
};

//이전 데이터 가져오기 api
export const getHealthDataApi = () => {
  return new Promise((resolve) => {
    resolve({
      userHeight: 130,
      age: 30,
      userWeight: 60,
      waistLine: 300,
      cholesterol: 20,
      systolicBp: 30,
      diastolicBp: 30,
      bloodGlucose: 40,
      triglyceride: 20,
    });
  });
};

//ocr 데이터 입력 api
export const ocrInputApi = (file) => {
  return new Promise((resolve) => {
    resolve({
      userHeight: 170,
      age: 50,
      userWeight: 70,
      waistLine: 400,
      cholesterol: 30,
      systolicBp: 50,
      diastolicBp: 50,
      bloodGlucose: 60,
      triglyceride: 30,
    });
  });
};

//5대지표 예측결과 api
export const getKPIPredictionApi = () => {
  return new Promise((resolve) => {
    resolve([
      {
        key: "waistLine",
        title: "허리둘레",
        titleColor: "black",
        unit: "cm",
        currentValue: 150,
        predictionValue: 170,
      },
      {
        key: "cholesterol",
        title: "콜레스테롤",
        titleColor: "red",
        unit: "mg/dl",
        currentValue: 80,
        predictionValue: 90,
      },
      {
        key: "bloodGlucose",
        title: "혈당",
        titleColor: "blue",
        unit: "mg/dl",
        currentValue: 100,
        predictionValue: 130,
      },
      {
        key: "bloodPressure",
        title: "혈압",
        titleColor: "black",
        unit: "mmHg",
        currentValue: 90,
        predictionValue: 160,
      },
      {
        key: "triglyceride",
        title: "중성지방",
        titleColor: "black",
        unit: "mg/dl",
        currentValue: 30,
        predictionValue: 50,
      },
    ]);
  });
};

//요약박스 내용 가져오기 api
export const getSummaryResultApi = () => {
  return new Promise((resolve) => {
    resolve({
      title: "건강 주의보! 지금 바로 확인하세요!",
      score: 72,
      grade: "danger",
      description:
        "대사증후군 위험군에 해당할 수 있습니다. 방치하면 당뇨병, 고혈압, 심혈관 질환의 위험이 3배 이상 증가합니다!",
    });
  });
};

//개선사항 리스트 api
export const getImprovementListApi = () => {
  return new Promise((resolve) => {
    resolve([
      {
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "heart",
        title: "식습관 개선",
      },
      {
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "check",
        title: "식습관 개선",
      },
      {
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "lightning",
        title: "식습관 개선",
      },
      {
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "arrow",
        title: "식습관 개선",
      },
    ]);
  });
};

//분석내용 받기 api
export const getAnalysisContentApi = () => {
  return new Promise((resolve) => {
    resolve("긴 분석내용입니다.");
  });
};
