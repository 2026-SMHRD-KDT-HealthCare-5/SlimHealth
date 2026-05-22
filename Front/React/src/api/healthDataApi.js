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
      height: 130,
      age: 30,
      weight: 60,
      waist: 300,
      hdl: 20,
      sbp: 30,
      dbp: 30,
      bs: 40,
      tg: 20,
      isDrink: true,
      isSmoke: false,
      gender: "남성",
    });
  });
};

//ocr 데이터 입력 api
export const ocrInputApi = (files) => {
  return new Promise((resolve) => {
    resolve({
      height: 170,
      age: 50,
      weight: 70,
      waist: 400,
      hdl: 30,
      sbp: 50,
      dbp: 50,
      bs: 60,
      tg: 30,
      gender: "여성",
    });
  });
};

//5대지표 예측결과 및 슬라이더 초기값 api
export const getKPIPredictionApi = (id) => {
  return new Promise((resolve) => {
    resolve({
      result: [
        {
          key: "waist",
          indicator: "허리둘레",
          status: "위험",
          unit: "cm",
          current_value: 150,
          predictionValue: 170,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "hdl",
          indicator: "HDL",
          status: "주의",
          unit: "mg/dl",
          current_value: 80,
          predictionValue: 90,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "bs",
          indicator: "혈당",
          status: "정상",
          unit: "mg/dl",
          current_value: 100,
          predictionValue: 130,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "sbp",
          indicator: "수축기 혈압",
          status: "위험",
          unit: "mmHg",
          current_value: 90,
          predictionValue: 160,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "dbp",
          indicator: "이완기 혈압",
          status: "주의",
          unit: "mmHg",
          current_value: 90,
          predictionValue: 160,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
        {
          key: "tg",
          indicator: "중성지방",
          status: "정상",
          unit: "mg/dl",
          current_value: 30,
          predictionValue: 50,
          message:
            "허리둘레가 긴 편입니다. 혹시 살이 찐 건 아닌지 의심해보시고, 꾸준한 운동을 하시는 걸 추천드립니다",
        },
      ],
      weight: 85,
      max_loss_kg: 20,
      current_bmi: 32,
    });
  });
};

//요약박스 내용 가져오기 api
export const getSummaryResultApi = (id) => {
  return new Promise((resolve) => {
    resolve({
      title: "건강 주의보! 지금 바로 확인하세요!",
      score: 72,
      risk_level: "위험",
      description:
        "대사증후군 위험군에 해당할 수 있습니다. 방치하면 당뇨병, 고혈압, 심혈관 질환의 위험이 3배 이상 증가합니다!",
    });
  });
};

//개선사항 리스트 api
export const getImprovementListApi = (id) => {
  return new Promise((resolve) => {
    resolve({
      diet: "짠 음식과 가공식품 섭취를 줄이고, 채소와 통곡물 위주의 식단을 실천하세요. 규칙적인 식사와 과식 피하기가 중요합니다.",
      exercise:
        "매일 30분 이상 중등도 유산소 운동(걷기, 조깅 등)과 주 2회 근력 운동을 병행하세요. 꾸준함이 가장 중요합니다.",
      habit:
        "현재 흡연 중이시므로 금연은 가장 시급하고 중요한 과제입니다. 음주량도 줄이고 충분한 수면을 취하며 스트레스를 관리하세요.",
    });
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
        height: 137,
        age: 32,
        weight: 60,
        waist: 300,
        hdl: 20,
        sbp: 30,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 2,
        date: "2026-04-03",
        height: 145,
        age: 32,
        weight: 63,
        waist: 303,
        hdl: 24,
        sbp: 35,
        dbp: 34,
        bs: 42,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 3,
        date: "2026-04-06",
        height: 143,
        age: 32,
        weight: 63,
        waist: 340,
        hdl: 26,
        sbp: 34,
        dbp: 30,
        bs: 41,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 4,
        date: "2026-04-11",
        height: 150,
        age: 32,
        weight: 70,
        waist: 300,
        hdl: 20,
        sbp: 39,
        dbp: 43,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 5,
        date: "2026-04-15",
        height: 140,
        age: 32,
        weight: 65,
        waist: 300,
        hdl: 24,
        sbp: 37,
        dbp: 32,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 6,
        date: "2026-04-21",
        height: 137,
        age: 32,
        weight: 60,
        waist: 300,
        hdl: 20,
        sbp: 30,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 7,
        date: "2026-04-27",
        height: 156,
        age: 32,
        weight: 76,
        waist: 304,
        hdl: 22,
        sbp: 23,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 8,
        date: "2026-05-01",
        height: 165,
        age: 32,
        weight: 64,
        waist: 356,
        hdl: 21,
        sbp: 32,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 9,
        date: "2026-05-03",
        height: 137,
        age: 32,
        weight: 63,
        waist: 306,
        hdl: 27,
        sbp: 38,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
      {
        id: 10,
        date: "2026-05-07",
        height: 137,
        age: 32,
        weight: 60,
        waist: 300,
        hdl: 20,
        sbp: 30,
        dbp: 30,
        bs: 40,
        tg: 20,
        isDrink: true,
        isSmoke: false,
        gender: "남성",
      },
    ]);
  });
};

export const deleteDataHistory = (id) => {
  return new Promise((resolve) => {
    resolve("삭제 성공!");
  });
};
