import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";
import character5 from "../assets/character5.png";
// import pCharacter1 from "../assets/p_character1.png";
// import pCharacter2 from "../assets/p_character2.png";
// import pCharacter3 from "../assets/p_character3.png";
// import pCharacter4 from "../assets/p_character4.png";
// import pCharacter5 from "../assets/p_character5.png";
// import pCharacter6 from "../assets/p_character6.png";
// import pCharacter7 from "../assets/p_character7.png";
// import pCharacter8 from "../assets/p_character8.png";
// import pCharacter9 from "../assets/p_character9.png";
import pCharacter1 from "../assets/stage_1.png";
import pCharacter2 from "../assets/stage_2.png";
import pCharacter3 from "../assets/stage_3.png";
import pCharacter4 from "../assets/stage_4.png";
import pCharacter5 from "../assets/stage_5.png";
import pCharacter6 from "../assets/stage_6.png";
import pCharacter7 from "../assets/stage_7.png";
import pCharacter8 from "../assets/stage_8.png";
import pCharacter9 from "../assets/stage_9.png";
import { sliderWidth } from "../components/Slider";

export const userInfoKey = "userInfo";

export const inputFixWidth = 140;
export const checkBoxSize = 30;

export const ocrImageSize = 509;

export const dataInputFields = [
  {
    title: "키",
    placeholder: "현재 키(cm) 입력",
    key: "userHeight",
    unit: "cm",
  },
  {
    title: "체중",
    placeholder: "현재 체중(kg) 입력",
    key: "userWeight",
    unit: "kg",
  },
  {
    title: "허리둘레",
    placeholder: "현재 허리둘레(cm) 입력",
    key: "waistLine",
    unit: "cm",
  },
  {
    title: "HDL 콜레스테롤",
    placeholder: "현재 HDL 콜레스테롤 수치(mg/dl) 입력",
    key: "cholesterol",
    unit: "mg/dl",
  },
  {
    title: "수축기 혈압",
    placeholder: "현재 수축기 혈압(mmHg) 입력",
    key: "systolicBp",
    unit: "mmHg",
  },
  {
    title: "이완기 혈압",
    placeholder: "현재 이완기 혈압(mmHg) 입력",
    key: "diastolicBp",
    unit: "mmHg",
  },
  {
    title: "공복시 혈당",
    placeholder: "현재 혈당(mg/dl) 입력",
    key: "bloodGlucose",
    unit: "mg/dl",
  },
  {
    title: "중성지방",
    placeholder: "현재 중성지방(mg/dl) 입력",
    key: "triglyceride",
    unit: "mg/dl",
  },
];

export const inputFields = [
  {
    title: "키",
    placeholder: "현재 키(cm) 입력",
    key: "height",
    unit: "cm",
  },
  {
    title: "체중",
    placeholder: "현재 체중(kg) 입력",
    key: "weight",
    unit: "kg",
  },
  {
    title: "허리둘레",
    placeholder: "현재 허리둘레(cm) 입력",
    key: "waist",
    unit: "cm",
  },
  {
    title: "HDL 콜레스테롤",
    placeholder: "현재 HDL 콜레스테롤 수치(mg/dl) 입력",
    key: "hdl",
    unit: "mg/dl",
  },
  {
    title: "수축기 혈압",
    placeholder: "현재 수축기 혈압(mmHg) 입력",
    key: "sbp",
    unit: "mmHg",
  },
  {
    title: "이완기 혈압",
    placeholder: "현재 이완기 혈압(mmHg) 입력",
    key: "dbp",
    unit: "mmHg",
  },
  {
    title: "공복시 혈당",
    placeholder: "현재 혈당(mg/dl) 입력",
    key: "bs",
    unit: "mg/dl",
  },
  {
    title: "중성지방",
    placeholder: "현재 중성지방(mg/dl) 입력",
    key: "tg",
    unit: "mg/dl",
  },
];

export const totalInputFields = [
  ...inputFields,
  {
    title: "나이",
    placeholder: "현재 나이 입력",
    key: "age",
  },
  {
    title: "음주여부",
    key: "drink",
    type: "boolean",
  },
  {
    title: "흡연여부",
    key: "smoke",
    type: "boolean",
  },
  {
    title: "성별",
    key: "gender",
  },
];

//슬라이더 이미지 url은 나중에 정해지면 변경하기
export const sliderImageList = [
  pCharacter1,
  pCharacter2,
  pCharacter3,
  pCharacter4,
  pCharacter5,
  pCharacter6,
  pCharacter7,
  pCharacter8,
  pCharacter9,
];

export const getCharacterRange = (bmi) => {
  // 매우 심한 비만
  if (bmi >= 40) {
    return {
      startStage: 1,
      endStage: 6,
      label: "매우 심한 비만",
    };
  }

  // 초고도 비만
  if (bmi >= 38) {
    return {
      startStage: 2,
      endStage: 6,
      label: "초고도 비만",
    };
  }

  // 고도 비만
  if (bmi >= 35) {
    return {
      startStage: 3,
      endStage: 7,
      label: "고도 비만",
    };
  }

  // 비만
  if (bmi >= 30) {
    return {
      startStage: 4,
      endStage: 7,
      label: "비만",
    };
  }

  // 과체중
  if (bmi >= 27) {
    return {
      startStage: 5,
      endStage: 8,
      label: "과체중",
    };
  }

  // 약간 통통
  if (bmi >= 25) {
    return {
      startStage: 6,
      endStage: 8,
      label: "약간 통통",
    };
  }

  // 정상
  if (bmi >= 22) {
    return {
      startStage: 7,
      endStage: 9,
      label: "정상",
    };
  }

  // 날씬
  if (bmi >= 18.5) {
    return {
      startStage: 8,
      endStage: 9,
      label: "날씬",
    };
  }

  // 매우 날씬
  return {
    startStage: 9,
    endStage: 9,
    label: "매우 날씬",
  };
};

export const getCurrentCharacterStage = ({ bmi, currentLossKg, maxLossKg }) => {
  const { startStage, endStage } = getCharacterRange(bmi);

  // 감량 진행률
  const progress = Math.min(currentLossKg / maxLossKg, 1);

  // 현재 단계 계산
  const currentStage =
    startStage + Math.round((endStage - startStage) * progress);

  return currentStage;
};

export const sliderValueToWeight = (
  sliderValue,
  sliderMaxValue,
  sliderMinValue,
) => {
  return parseInt(
    sliderMaxValue -
      (sliderValue / sliderWidth) * (sliderMaxValue - sliderMinValue),
  );
};

export const weightToSliderValue = (weight, sliderMaxValue, sliderMinValue) => {
  return (
    ((sliderMaxValue - weight) / (sliderMaxValue - sliderMinValue)) *
    sliderWidth
  );
};
