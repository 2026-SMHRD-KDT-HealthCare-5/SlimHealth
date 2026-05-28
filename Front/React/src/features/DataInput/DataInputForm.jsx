import React, { useContext, useState } from "react";
import { dataInputFields, inputFixWidth } from "../../utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { saveHealthDataApi } from "../../api/healthDataApi";
import Context from "../../context/context";
import { predictionPath } from "../../App";
import { Input } from "../../components/Input/Input";
import { CheckBox } from "../../components/CheckBox/CheckBox";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";

const DataInputForm = ({ id, recentInputData, formData, handleChange }) => {
  const nav = useNavigate();
  const { openDialog, closeDialog } = useContext(Context);

  const [isDrink, setIsDrink] = useState(
    recentInputData ? recentInputData.drink === 1 : false,
  );
  const [isSmoke, setIsSmoke] = useState(
    recentInputData ? recentInputData.smoke === 1 : false,
  );

  const [checkupDate, setCheckupDate] = useState(
    recentInputData ? recentInputData.checkup_date : "",
  );

  //저장 버튼 활성화 여부
  const isSaveButtonDisable =
    dataInputFields.some((item) => !formData[item.key]) || !checkupDate;

  const saveHealthDataMutation = useMutation({
    mutationFn: saveHealthDataApi,
    onSuccess: (data) => {
      openDialog(
        "데이터 저장 성공", //title
        "데이터가 저장되었습니다. 해당 데이터로 바로 예측하시겠습니까?", //content
        true, //isCancelButton
        async () => {
          if (id) {
            nav(`${predictionPath}?id=${id}`);
          } else {
            nav(`${predictionPath}?id=${data.phyid}`);
          }
          closeDialog();
        }, //onConfirmClick
      );

      nav("/");
    },
  });

  const handleSaveDataDialog = () => {
    openDialog(
      "데이터 저장 확인", //title
      "이 데이터로 저장하시겠습니까?", //content
      true, //isCancelButton
      handleSaveData, //onConfirmClick
    );
  };

  //데이터 저장 버튼
  const handleSaveData = () => {
    saveHealthDataMutation.mutate({
      ...formData,
      checkupDate,
      isDrink: isDrink ? 1 : 0,
      isSmoke: isSmoke ? 1 : 0,
      id,
    });
  };

  return (
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
        <Button isDisabled={isSaveButtonDisable} onClick={handleSaveDataDialog}>
          건강 데이터 저장
        </Button>
      </div>
    </div>
  );
};

export default DataInputForm;
