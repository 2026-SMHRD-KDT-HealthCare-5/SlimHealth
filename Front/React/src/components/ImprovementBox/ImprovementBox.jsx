import "./ImprovementBox.css";
import "../../index.css";
import heart from "../../assets/heart_outline.png";
import check from "../../assets/check_outline.png";
import lightning from "../../assets/lightning_outline.png";
import arrow from "../../assets/arrow_outline.png";
import { Text } from "../Text/Text";

const ICONS = {
  heart,
  check,
  lightning,
  arrow,
};

export const ImprovementBox = ({ title, content, iconType }) => {
  const icon = ICONS[iconType];

  return (
    <div className="improvementBox">
      <div className="vertical-flex" style={{ paddingTop: 2 }}>
        <img className="iconImage" src={icon} />
      </div>
      <div className="improvementContent">
        <Text>{title}</Text>
        <div style={{ color: "gray" }}>
          <Text>{content}</Text>
        </div>
      </div>
    </div>
  );
};
