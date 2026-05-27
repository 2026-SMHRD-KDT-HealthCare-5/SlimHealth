import React, { useContext, useEffect, useState } from "react";
import Context from "../context/context";
import { TopNavigation } from "../components/TopNavigation";
import { Slider } from "../components/Slider";
import "../index.css";
import { Text } from "../components/Text/Text";
import { Logo } from "../components/Logo/Logo";
import { Introduction } from "../components/Introduction/Introduction";
import { MainGuide } from "../components/MainGuide/MainGuide";
import mainImage from "../assets/mainImage.png";

const guideList = [
  {
    key: "heart",
    iconType: "heart",
    title: "건강 데이터 입력",
    content: "키, 나이, 체중 및 대사증후군 5대 요소를 간편하게 입력하세요",
  },
  {
    key: "arrow",
    iconType: "arrow",
    title: "AI 건강 예측",
    content: "머신러닝 알고리즘으로 건강 상태를 예측하고 시각화합니다",
  },
  {
    key: "shield",
    iconType: "shield",
    title: "개선 가이드",
    content: "개인 맞춤형 건강 개선 방안을 제공받으세요",
  },
];

const Main = () => {
  return (
    <div className="contentContainer">
      {/* 타이틀 부분 */}
      <div className="vertical-flex flex-align-center" style={{ padding: 10 }}>
        <div style={{ height: 30 }}></div>
        <Logo isTitle />
        <Text textStyle={"medium"}>AI 기반 건강 예측 및 관리 시스템</Text>
      </div>
      {/* 메인 이미지 부분 */}
      <div style={{ height: 20 }}></div>
      <img src={mainImage} />
      <div style={{ height: 20 }}></div>
      {/* 소개 부분 */}
      <div className="bigcard vertical-flex" style={{ width: "90%" }}>
        <Introduction
          title="프로젝트 소개"
          content="슬림헬스는 인공지능 기술을 활용하여 개인의 건강 데이터를 분석하고 예측하는 혁신적인 건강 관리 플랫폼입니다."
        />
        <div
          className="horizontal-flex flex-align-center"
          style={{ gap: 50, padding: 50 }}
        >
          {guideList.map((item) => {
            return (
              <MainGuide
                key={item.key}
                content={item.content}
                iconType={item.iconType}
                title={item.title}
              />
            );
          })}
        </div>
      </div>
      <div style={{ height: 30 }}></div>
    </div>
  );
};

export default Main;
