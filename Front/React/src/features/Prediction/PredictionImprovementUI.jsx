import React from "react";
import { ImprovementBox } from "../../components/ImprovementBox/ImprovementBox";

const PredictionImprovementUI = ({ adviceData }) => {
  const improvementList = adviceData.lifestyle_tips;
  return (
    improvementList && (
      <>
        <ImprovementBox
          content={improvementList.diet}
          iconType={"heart"}
          title={"식습관 개선"}
        />
        <ImprovementBox
          content={improvementList.exercise}
          iconType={"lightning"}
          title={"운동하기"}
        />
        <ImprovementBox
          content={improvementList.habit}
          iconType={"check"}
          title={"생활습관 개선"}
        />
      </>
    )
  );
};

export default PredictionImprovementUI;
