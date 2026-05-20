import React, { useContext, useEffect, useState } from "react";
import { Text } from "../components/Text/Text";
import { totalInputFields } from "../utils/utils";
import { TableData } from "../components/TableData/TableData";
import {
  deleteDataHistory,
  getHealthDataHistories,
} from "../api/healthDataApi";
import { Button } from "../components/Button/Button";
import { CheckBox } from "../components/CheckBox/CheckBox";
import { OutlinedButton } from "../components/OutlinedButton/OutlinedButton";
import Context from "../context/context";
import { useNavigate } from "react-router-dom";
import { dataInputPath, predictionPath } from "../App";

const modifyKey = "modify";
const deleteKey = "delete";
const predictionKey = "prediction";

const tableColumns = [
  {
    title: "번호",
    key: "id",
  },
  {
    title: "날짜",
    key: "date",
  },
  ...totalInputFields,
  {
    title: "수정",
    key: modifyKey,
    type: "button",
  },
  {
    title: "삭제",
    key: deleteKey,
    type: "button",
  },
  {
    title: "예측",
    key: predictionKey,
    type: "button",
  },
];

const DataInputHistory = () => {
  const { openDialog, closeDialog } = useContext(Context);
  const nav = useNavigate();

  const [page, setPage] = useState(1);
  const [dataHistoryList, setDataHistoryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //내역 연동
        const data = await getHealthDataHistories(page);
        setDataHistoryList(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [page]);

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
    nav(`${dataInputPath}?id=${id}`);
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
      setDataHistoryList(
        dataHistoryList.filter((item) => {
          return item.id != id;
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  //예측 버튼
  const movePredictionPage = (id) => {
    nav(`${predictionPath}?id=${id}`);
  };

  return (
    <div className="contentContainer" style={{ gap: 30 }}>
      <div></div>
      <Text textStyle={"bold"}>건강 데이터 조회</Text>

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
                      ) : typeof dataHistory[column.key] === "boolean" ? (
                        <CheckBox isChecked={dataHistory[column.key]} />
                      ) : (
                        dataHistory[column.key]
                      )}
                    </TableData>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지 이동 버튼 */}
      <div className="horizontal-flex flex-align-center">
        {page >= 2 && (
          <OutlinedButton
            onClick={() => {
              setPage(page - 1);
            }}
          >
            이전
          </OutlinedButton>
        )}
        <Text textStyle={"bold"}>{page}</Text>
        <OutlinedButton
          onClick={() => {
            setPage(page + 1);
          }}
        >
          다음
        </OutlinedButton>
      </div>
    </div>
  );
};

export default DataInputHistory;
