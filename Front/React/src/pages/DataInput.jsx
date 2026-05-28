import React, { useContext, useEffect, useRef, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getHealthDataApi,
  getRecentData,
  ocrInputApi,
  saveHealthDataApi,
} from "../api/healthDataApi";
import Context from "../context/context";
import {
  dataInputFields,
  inputFields,
  inputFixWidth,
  ocrImageSize,
} from "../utils/utils";
import { CheckBox } from "../components/CheckBox/CheckBox";
import { RadioButton } from "../components/RadioButton/RadioButton";
import { predictionPath } from "../App";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import DataInputForm from "../features/DataInput/DataInputForm";
import OcrInputBox from "../features/DataInput/OcrInputBox";

const DataInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");

  //이전 데이터 불러오기
  const { data: recentInputData } = useSuspenseQuery({
    queryKey: ["recentInput", id],
    queryFn: async () => {
      if (!id) {
        return null;
      } else {
        return (await getHealthDataApi(id)).physical;
      }
    },
  });

  const [formData, setFormData] = useState(
    recentInputData
      ? {
          userHeight: recentInputData.height,
          userWeight: recentInputData.weight,
          waistLine: recentInputData.waist,
          cholesterol: recentInputData.hdl,
          systolicBp: recentInputData.sbp,
          diastolicBp: recentInputData.dbp,
          bloodGlucose: recentInputData.bs,
          triglyceride: recentInputData.tg,
        }
      : {
          userHeight: 0,
          userWeight: 0,
          waistLine: 0,
          cholesterol: 0,
          systolicBp: 0,
          diastolicBp: 0,
          bloodGlucose: 0,
          triglyceride: 0,
        },
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="contentContainer">
      <Text textStyle={"bold"}>당신의 현재 건강 데이터를 입력하세요.</Text>
      <Text textStyle={"bold"}>
        또는 진단서 파일을 넣고 OCR로 입력할 수도 있습니다.
      </Text>
      <Text textStyle={"bold"}>
        (단, OCR 입력의 경우 검진일자와 음주여부와 흡연여부는 인식되지
        않습니다.)
      </Text>
      <div style={{ height: 30 }}></div>
      <div className="horizontal-flex">
        {/* 데이터 입력 부분 */}
        <DataInputForm
          id={id}
          recentInputData={recentInputData}
          formData={formData}
          handleChange={handleChange}
        />
        <div style={{ width: 120 }}></div>
        {/* ocr 입력 부분 */}
        <OcrInputBox setFormData={setFormData} />
      </div>
    </div>
  );
};

export default DataInput;
