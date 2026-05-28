import React, { useContext } from "react";
import {
  deleteKey,
  modifyKey,
  predictionKey,
  rowCount,
  tableColumns,
} from "./utils";
import { totalInputFields } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import Context from "../../context/context";
import { useQueryClient } from "@tanstack/react-query";
import { dataUpdatePath, predictionPath } from "../../App";
import { deleteDataHistory } from "../../api/healthDataApi";
import { TableData } from "../../components/TableData/TableData";
import { Button } from "../../components/Button/Button";
import { CheckBox } from "../../components/CheckBox/CheckBox";

const DataHistoryTable = ({ page, data }) => {
  const { openDialog, closeDialog } = useContext(Context);
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const startIndex = (page - 1) * rowCount;
  const endIndex = startIndex + rowCount;
  const dataHistoryList = data.slice(startIndex, endIndex);

  //버튼 기능
  const handleButtonClick = (id, key) => {
    switch (key) {
      case modifyKey:
        moveModifyHistoryPage(id);
        break;
      case deleteKey:
        openDeleteDialog(id);
        break;
      case predictionKey:
        movePredictionPage(id);
        break;
    }
  };

  //수정 버튼
  const moveModifyHistoryPage = (id) => {
    nav(`${dataUpdatePath}?id=${id}`);
  };

  const openDeleteDialog = (id) => {
    openDialog(
      "데이터 삭제 확인", //title
      "해당 데이터를 삭제하시겠습니까?", //content
      true, //isCancelButton
      () => {
        deleteHistory(id);
        closeDialog();
      }, //onConfirmClick
    );
  };

  //삭제 버튼
  const deleteHistory = async (id) => {
    try {
      await deleteDataHistory(id);
      queryClient.setQueryData(["healthDataHistories"], (oldData) => {
        return oldData.filter((item) => item.id !== id);
      });
    } catch (e) {
      console.log(e);
    }
  };

  //예측 버튼
  const movePredictionPage = (id) => {
    nav(`${predictionPath}?id=${id}`);
  };

  return (
    <table
      style={{
        width: "95%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          {tableColumns.map((item) => {
            return (
              <TableData isThick key={item.key}>
                {item.title}
              </TableData>
            );
          })}
        </tr>
        {dataHistoryList.map((dataHistory) => {
          return (
            <tr key={dataHistory.id}>
              {tableColumns.map((column) => {
                return (
                  <TableData key={column.key}>
                    {column.type === "button" ? (
                      <Button
                        onClick={() => {
                          handleButtonClick(dataHistory.id, column.key);
                        }}
                      >
                        {column.title}
                      </Button>
                    ) : column.type === "boolean" ? (
                      <CheckBox isChecked={dataHistory[column.key]} />
                    ) : (
                      `${dataHistory[column.key]}${column.unit || ""}`
                    )}
                  </TableData>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataHistoryTable;
