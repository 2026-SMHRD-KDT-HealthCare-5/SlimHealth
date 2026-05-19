import { useRef, useState, useEffect } from "react";
import "./Slider.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const sliderWidth = 299;

export const Slider = ({ value, onChange, maxValue, minValue }) => {
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();

    // 마우스 위치 계산
    let newValue = e.clientX - rect.left;

    // 범위 제한
    newValue = Math.max(0, Math.min(newValue, rect.width - 10));

    onChange(newValue);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const centerValue = parseInt((maxValue + minValue) / 2);
  const valueArray = [maxValue, centerValue, minValue];

  return (
    <div className="vertical-flex">
      <div className="slider" style={{ width: sliderWidth }} ref={sliderRef}>
        <div className="sliderLine"></div>

        <div
          className="sliderCircle"
          style={{ left: value }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>
      <div className="sliderValueContainer">
        {valueArray.map((item, index) => {
          return <Text key={index}>{item}</Text>;
        })}
      </div>
    </div>
  );
};
