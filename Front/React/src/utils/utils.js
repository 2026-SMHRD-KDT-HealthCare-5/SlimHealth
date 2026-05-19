import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";
import character5 from "../assets/character5.png";
import { sliderWidth } from "../components/Slider";

export const inputFixWidth = 140;
export const checkBoxSize = 30;

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
