import { useRef, useState, useEffect } from "react";
import "./Slider.css";
import "../../index.css";
import { Text } from "../Text/Text";

export const sliderWidth = 299;

export const Slider = ({ value, onChange, maxValue, minValue }) => {
  const sliderRef = useRef(null);
  const frameRef = useRef(null);
  const latestValueRef = useRef(value);
  const [dragging, setDragging] = useState(false);

  const emitChange = (newValue) => {
    latestValueRef.current = newValue;

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      onChange(latestValueRef.current);
    });
  };

  const updateValueFromPointer = (clientX) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    let newValue = clientX - rect.left;

    newValue = Math.max(0, Math.min(newValue, rect.width - 10));
    emitChange(newValue);
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    updateValueFromPointer(e.clientX);
  };

  const handlePointerUp = (e) => {
    setDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const centerValue = parseInt((maxValue + minValue) / 2);
  const valueArray = [maxValue, centerValue, minValue];

  return (
    <div className="vertical-flex">
      <div
        className="slider"
        style={{ width: sliderWidth }}
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="sliderLine"></div>

        <div className="sliderCircle" style={{ left: value }}></div>
      </div>
      <div className="sliderValueContainer">
        {valueArray.map((item, index) => {
          return <Text key={index}>{item}</Text>;
        })}
      </div>
    </div>
  );
};
