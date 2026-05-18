import "./Text.css";
import "../../index.css";
export const Text = ({ children, textStyle, isUnderLine, isShadow, align }) => {
  return (
    <div
      className={`text ${textStyle} ${isUnderLine && "underline"} ${isShadow && "shadow"}`}
      style={{ textAlign: align || "left" }}
    >
      {children}
    </div>
  );
};
