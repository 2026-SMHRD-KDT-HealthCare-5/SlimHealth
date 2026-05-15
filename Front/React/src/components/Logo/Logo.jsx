import "./Logo.css";
import "../../index.css";
import lightningYellow from "../../assets/lightning_yellow.png";
import { Text } from "../Text/Text";

export const Logo = ({ isTitle }) => {
  return (
    <div className="logo">
      <img className="logoImage" src={lightningYellow} />
      {isTitle && <Text textStyle={"bold"}>슬림헬스</Text>}
    </div>
  );
};
