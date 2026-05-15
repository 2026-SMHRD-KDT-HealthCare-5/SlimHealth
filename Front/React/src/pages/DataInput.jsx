import React, { useContext, useEffect, useRef, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import {
  getHealthDataApi,
  ocrInputApi,
  saveHealthDataApi,
} from "../api/healthDataApi";
import Context from "../context/context";
import { inputFixWidth } from "../utils/utils";
import { CheckBox } from "../components/CheckBox/CheckBox";

const inputFields = [
  {
    title: "키",
    placeholder: "현재 키(cm) 입력",
    key: "userHeight",
  },
  {
    title: "나이",
    placeholder: "현재 나이 입력",
    key: "age",
  },
  {
    title: "체중",
    placeholder: "현재 체중(kg) 입력",
    key: "userWeight",
  },
  {
    title: "허리둘레",
    placeholder: "현재 허리둘레(cm) 입력",
    key: "waistLine",
  },
  {
    title: "HDL 콜레스테롤",
    placeholder: "현재 HDL 콜레스테롤 수치(mg/dl) 입력",
    key: "cholesterol",
  },
  {
    title: "수축기 혈압",
    placeholder: "현재 수축기 혈압(mmHg) 입력",
    key: "systolicBp",
  },
  {
    title: "이완기 혈압",
    placeholder: "현재 이완기 혈압(mmHg) 입력",
    key: "diastolicBp",
  },
  {
    title: "공복시 혈당",
    placeholder: "현재 혈당(mg/dl) 입력",
    key: "bloodGlucose",
  },
  {
    title: "중성지방",
    placeholder: "현재 중성지방(mg/dl) 입력",
    key: "triglyceride",
  },
];

const DataInput = () => {
  const { openDialog, closeDialog } = useContext(Context);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    userHeight: 0,
    age: 0,
    userWeight: 0,
    waistLine: 0,
    cholesterol: 0,
    systolicBp: 0,
    diastolicBp: 0,
    bloodGlucose: 0,
    triglyceride: 0,
  });

  const [isDrink, setIsDrink] = useState(false);
  const [isSmoke, setIsSmoke] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //ocr 이미지
  const [ocrImage, setOcrImage] = useState(null);

  const fileInputRef = useRef(null);

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 실행
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOcrImage(imageUrl);

      //ocr 입력 api 연결
      handleOcrInput(file);
    }
  };

  //ocr로 입력
  const handleOcrInput = async (file) => {
    //ocr 입력 api 연결
    try {
      const data = await ocrInputApi(file);

      setFormData(data);
    } catch (e) {
      console.log(e);
    }
  };

  //저장 버튼 활성화 여부
  const isSaveButtonDisable = inputFields.some((item) => !formData[item.key]);

  //데이터 저장 버튼
  const handleSaveData = async () => {
    try {
      await saveHealthDataApi({ ...formData, isDrink, isSmoke });

      openDialog(
        "데이터 저장 성공", //title
        "데이터가 저장되었습니다. 해당 데이터로 바로 예측하시겠습니까?", //content
        true, //isCancelButton
        () => {
          nav("/prediction");
          closeDialog();
        }, //onConfirmClick
      );

      nav("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //이전 데이터 연동
        const data = await getHealthDataApi();

        setFormData(data);
        setIsDrink(data.isDrink);
        setIsSmoke(data.isSmoke);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (ocrImage) {
        URL.revokeObjectURL(ocrImage);
      }
    };
  }, [ocrImage]);

  return (
    <div className="mainContainer">
      <TopNavigation isBackButton menuList={[]} />
      <div className="contentContainer">
        <Text textStyle={"bold"}>당신의 현재 건강 데이터를 입력하세요.</Text>
        <Text textStyle={"bold"}>
          또는 진단서 파일을 넣고 OCR로 입력할 수도 있습니다.
        </Text>
        <div style={{ height: 30 }}></div>
        <div className="horizontal-flex">
          {/* 데이터 입력 부분 */}
          <div className="vertical-flex">
            {inputFields.map((item) => {
              return (
                <Input
                  key={item.key}
                  fixWidth={inputFixWidth}
                  maxLength={30}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  placeholder={item.placeholder}
                  title={item.title}
                  type="number"
                  value={formData[item.key]}
                />
              );
            })}
            <div style={{ height: 20 }}></div>
            <div className="vertical-flex flex-align-center">
              <CheckBox
                isChecked={isDrink}
                onClick={() => {
                  setIsDrink(!isDrink);
                }}
                title="음주여부"
              />
              <CheckBox
                isChecked={isSmoke}
                onClick={() => {
                  setIsSmoke(!isSmoke);
                }}
                title="흡연여부"
              />
            </div>
            <div style={{ height: 30 }}></div>
            <div className="horizontal-flex flex-align-center">
              <Button isDisabled={isSaveButtonDisable} onClick={handleSaveData}>
                건강 데이터 저장
              </Button>
            </div>
          </div>
          <div style={{ width: 120 }}></div>
          {/* ocr 입력 부분 */}
          <div className="vertical-flex">
            <div style={{ width: 479, height: 479 }}>
              {ocrImage && (
                <img src={ocrImage} style={{ width: 459, height: 459 }} />
              )}
            </div>
            <div className="horizontal-flex flex-align-center">
              <Button onClick={handleButtonClick}>OCR로 입력</Button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInput;
