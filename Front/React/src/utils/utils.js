import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";
import character5 from "../assets/character5.png";
import { sliderWidth } from "../components/Slider";

export const userInfoKey = "userInfo";

export const inputFixWidth = 140;
export const checkBoxSize = 30;

export const inputFields = [
  {
    title: "키",
    placeholder: "현재 키(cm) 입력",
    key: "height",
    unit: "cm",
  },
  {
    title: "나이",
    placeholder: "현재 나이 입력",
    key: "age",
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
    title: "음주여부",
    key: "isDrink",
  },
  {
    title: "흡연여부",
    key: "isSmoke",
  },
  {
    title: "성별",
    key: "gender",
  },
];

//슬라이더 이미지 url은 나중에 정해지면 변경하기
export const sliderImageList = [
  character1,
  character2,
  character3,
  character4,
  character5,
];

export const getSliderImageIndex = (sliderValue) => {
  return parseInt(sliderValue / ((sliderWidth + 1) / sliderImageList.length));
};

export const sliderValueToWeight = (
  sliderValue,
  sliderMaxValue,
  sliderMinValue,
) => {
  return parseInt(
    sliderMaxValue - (sliderValue / sliderWidth) * sliderMinValue,
  );
};

export const weightToSliderValue = (weight, sliderMaxValue, sliderMinValue) => {
  return (
    ((sliderMaxValue - weight) / (sliderMaxValue - sliderMinValue)) *
    sliderWidth
  );
};
