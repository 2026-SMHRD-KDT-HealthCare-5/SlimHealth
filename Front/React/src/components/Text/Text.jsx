import "./Text.css";
import "../../index.css";
export const Text = ({ children, textStyle, isUnderLine, align }) => {
  return (
    <div
      className={`text ${textStyle} ${isUnderLine && "underline"}`}
      style={{ textAlign: align || "left" }}
    >
      {children}
    </div>
  );
};
