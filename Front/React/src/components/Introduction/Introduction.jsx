import "./Introduction.css";
import "../../index.css";
import { Text } from "../Text/Text";
export const Introduction = ({ title, content }) => {
  return (
    <div className="introduction">
      <Text textStyle={"bold"}>{title}</Text>
      <Text>{content}</Text>
    </div>
  );
};
