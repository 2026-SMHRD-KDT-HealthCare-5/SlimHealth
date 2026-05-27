import React, { useContext, useEffect, useRef, useState } from "react";
import { TopNavigation } from "../components/TopNavigation";
import { Text } from "../components/Text/Text";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getHealthDataApi,
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

const DataInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");

  const { openDialog, closeDialog } = useContext(Context);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    userHeight: 0,
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

  const [checkupDate, setCheckupDate] = useState("");

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //ocr 이미지
  const [ocrImages, setOcrImages] = useState(null);

  const fileInputRef = useRef(null);

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 실행
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files) {
      setOcrImages(files);

      //ocr 입력 api 연결
      handleOcrInput(files);
    }
  };

  //ocr로 입력
  const handleOcrInput = async (files) => {
    //ocr 입력 api 연결
    try {
      const data = (await ocrInputApi(files)).ocr;

      setFormData({
        userHeight: data.height,
        userWeight: data.weight,
        waistLine: data.waist,
        cholesterol: data.hdl,
        systolicBp: data.sbp,
        diastolicBp: data.dbp,
        bloodGlucose: data.bs,
        triglyceride: data.tg,
      });
    } catch (e) {
      console.log(e);
    }
  };

  //저장 버튼 활성화 여부
  const isSaveButtonDisable =
    dataInputFields.some((item) => !formData[item.key]) || !checkupDate;

  //데이터 저장 버튼
  const handleSaveData = async () => {
    try {
      await saveHealthDataApi({
        ...formData,
        checkupDate,
        isDrink: isDrink ? 1 : 0,
        isSmoke: isSmoke ? 1 : 0,
        id,
      });

      openDialog(
        "데이터 저장 성공", //title
        "데이터가 저장되었습니다. 해당 데이터로 바로 예측하시겠습니까?", //content
        true, //isCancelButton
        () => {
          if (id) {
            nav(`${predictionPath}?id=${id}`);
          } else {
            nav(predictionPath);
          }
          closeDialog();
        }, //onConfirmClick
      );

      nav("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveDataDialog = () => {
    openDialog(
      "데이터 저장 확인", //title
      "이 데이터로 저장하시겠습니까?", //content
      true, //isCancelButton
      handleSaveData, //onConfirmClick
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          //이전 데이터 연동
          const data = (await getHealthDataApi(id)).physical;

          setFormData({
            userHeight: data.height,
            userWeight: data.weight,
            waistLine: data.waist,
            cholesterol: data.hdl,
            systolicBp: data.sbp,
            diastolicBp: data.dbp,
            bloodGlucose: data.bs,
            triglyceride: data.tg,
          });
          setIsDrink(data.drink === 1);
          setIsSmoke(data.smoke === 1);
          setCheckupDate(data.checkup_date);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (ocrImages) {
        ocrImages.forEach((item) => {
          URL.revokeObjectURL(item.preview);
        });
      }
    };
  }, [ocrImages]);

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
        <div className="vertical-flex">
          {dataInputFields.map((item) => {
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
          <div className="horizontal-flex flex-align-center">
            <div style={{ width: 30 }}></div>
            <Text>검진날짜</Text>
            <input
              type="date"
              value={checkupDate}
              onChange={(e) => {
                setCheckupDate(e.target.value);
              }}
              max="9999-12-31"
              style={{
                width: "220px",
                height: "44px",
                padding: "0 12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>
          <div style={{ height: 30 }}></div>
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
            <Button
              isDisabled={isSaveButtonDisable}
              onClick={handleSaveDataDialog}
            >
              건강 데이터 저장
            </Button>
          </div>
        </div>
        <div style={{ width: 120 }}></div>
        {/* ocr 입력 부분 */}
        <div className="vertical-flex">
          <div style={{ width: ocrImageSize + 20, height: ocrImageSize + 20 }}>
            {ocrImages && (
              <>
                {ocrImages[0].type === "application/pdf" ? (
                  <iframe
                    src={URL.createObjectURL(ocrImages[0])}
                    width={ocrImageSize}
                    height={ocrImageSize}
                    title="pdf-viewer"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(ocrImages[0])}
                    alt="preview"
                    style={{
                      width: ocrImageSize,
                      height: ocrImageSize,
                      objectFit: "cover",
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="horizontal-flex flex-align-center">
            <Button onClick={handleButtonClick}>OCR로 입력</Button>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DataInput;
