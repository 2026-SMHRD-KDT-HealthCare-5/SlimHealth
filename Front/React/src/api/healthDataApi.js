import client from "./axios";

//건강 데이터 저장 api
export const saveHealthDataApi = (body) => {
  return new Promise((resolve) => {
    resolve("데이터 저장 성공!");
  });
};

//이전 데이터 가져오기 api
export const getHealthDataApi = (id) => {
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
      isDrink: true,
      isSmoke: false,
      gender: "Male",
    });
  });
};

//ocr 데이터 입력 api
export const ocrInputApi = (files) => {
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
      gender: "Female",
    });
  });
};

//5대지표 예측결과 및 슬라이더 초기값 api
export const getKPIPredictionApi = (id) => {
  return new Promise((resolve) => {
    resolve({
      result: [
        {
          key: "waistLine",
          title: "허리둘레",
          titleColor: "black",
          backgroundColor: "white",
          isShadow: false,
          unit: "cm",
          currentValue: 150,
          predictionValue: 170,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "cholesterol",
          title: "콜레스테롤",
          titleColor: "red",
          backgroundColor: "white",
          isShadow: false,
          unit: "mg/dl",
          currentValue: 80,
          predictionValue: 90,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "bloodGlucose",
          title: "혈당",
          titleColor: "orange",
          backgroundColor: "white",
          isShadow: true,
          unit: "mg/dl",
          currentValue: 100,
          predictionValue: 130,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "systolicBp",
          title: "수축기 혈압",
          titleColor: "black",
          backgroundColor: "skyBlue",
          isShadow: false,
          unit: "mmHg",
          currentValue: 90,
          predictionValue: 160,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "diastolicBp",
          title: "이완기 혈압",
          titleColor: "black",
          backgroundColor: "skyBlue",
          isShadow: false,
          unit: "mmHg",
          currentValue: 90,
          predictionValue: 160,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "triglyceride",
          title: "중성지방",
          titleColor: "black",
          backgroundColor: "white",
          isShadow: false,
          unit: "mg/dl",
          currentValue: 30,
          predictionValue: 50,
          improvementContent:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
      ],
      weight: 120,
    });
  });
};

//요약박스 내용 가져오기 api
export const getSummaryResultApi = (id) => {
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
export const getImprovementListApi = (id) => {
  return new Promise((resolve) => {
    resolve([
      {
        id: 1,
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "heart",
        title: "식습관 개선",
      },
      {
        id: 2,
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "check",
        title: "식습관 개선",
      },
      {
        id: 3,
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "lightning",
        title: "식습관 개선",
      },
      {
        id: 4,
        content:
          "중성지방 수치가 다소 높습니다. 포화지방과 당분 섭취를 줄이고, 오메가-3 지방산이 풍부한 생선을 주 2-3회 섭취하세요.",
        iconType: "arrow",
        title: "식습관 개선",
      },
    ]);
  });
};

//분석내용 받기 api
export const getAnalysisContentApi = (id) => {
  return new Promise((resolve) => {
    resolve("긴 분석내용입니다.");
  });
};

//건강 데이터 저장 내역 조회 api
export const getHealthDataHistories = (page) => {
  return new Promise((resolve) => {
    resolve([
      {
        id: 1,
        date: "2026-01-01",
        userHeight: 137,
        age: 32,
        userWeight: 60,
        waistLine: 300,
        cholesterol: 20,
        systolicBp: 30,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 2,
        date: "2026-04-03",
        userHeight: 145,
        age: 32,
        userWeight: 63,
        waistLine: 303,
        cholesterol: 24,
        systolicBp: 35,
        diastolicBp: 34,
        bloodGlucose: 42,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 3,
        date: "2026-04-06",
        userHeight: 143,
        age: 32,
        userWeight: 63,
        waistLine: 340,
        cholesterol: 26,
        systolicBp: 34,
        diastolicBp: 30,
        bloodGlucose: 41,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 4,
        date: "2026-04-11",
        userHeight: 150,
        age: 32,
        userWeight: 70,
        waistLine: 300,
        cholesterol: 20,
        systolicBp: 39,
        diastolicBp: 43,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 5,
        date: "2026-04-15",
        userHeight: 140,
        age: 32,
        userWeight: 65,
        waistLine: 300,
        cholesterol: 24,
        systolicBp: 37,
        diastolicBp: 32,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 6,
        date: "2026-04-21",
        userHeight: 137,
        age: 32,
        userWeight: 60,
        waistLine: 300,
        cholesterol: 20,
        systolicBp: 30,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 7,
        date: "2026-04-27",
        userHeight: 156,
        age: 32,
        userWeight: 76,
        waistLine: 304,
        cholesterol: 22,
        systolicBp: 23,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 8,
        date: "2026-05-01",
        userHeight: 165,
        age: 32,
        userWeight: 64,
        waistLine: 356,
        cholesterol: 21,
        systolicBp: 32,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 9,
        date: "2026-05-03",
        userHeight: 137,
        age: 32,
        userWeight: 63,
        waistLine: 306,
        cholesterol: 27,
        systolicBp: 38,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
      {
        id: 10,
        date: "2026-05-07",
        userHeight: 137,
        age: 32,
        userWeight: 60,
        waistLine: 300,
        cholesterol: 20,
        systolicBp: 30,
        diastolicBp: 30,
        bloodGlucose: 40,
        triglyceride: 20,
        isDrink: true,
        isSmoke: false,
        gender: "Male",
      },
    ]);
  });
};

export const deleteDataHistory = (id) => {
  return new Promise((resolve) => {
    resolve("삭제 성공!");
  });
};
