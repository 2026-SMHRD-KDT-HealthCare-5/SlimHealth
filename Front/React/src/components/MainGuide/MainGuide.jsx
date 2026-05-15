import "./MainGuide.css";
import "../../index.css";
import heart from "../../assets/heart.png";
import arrow from "../../assets/arrow.png";
import shield from "../../assets/shield.png";
import { Text } from "../Text/Text";

const ICONS = {
  heart,
  arrow,
  shield,
};

export const MainGuide = ({ iconType, title, content }) => {
  const icon = ICONS[iconType];

  return (
    <div className="mainGuide">
      <img className="guideImage" src={icon} />
      <Text textStyle={"bold"} align={"center"}>
        {title}
      </Text>
      <Text align={"center"}>{content}</Text>
    </div>
  );
};
