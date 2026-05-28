import React, { useContext, useMemo, useState } from "react";
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
import { dataInputPath, dataUpdatePath, predictionPath } from "../App";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import DataHistoryPagination from "../features/DataInputHistory/DataHistoryPagination";
import DataHistoryTable from "../features/DataInputHistory/DataHistoryTable";

const DataInputHistory = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["healthDataHistories"],
    queryFn: async () => {
      return await getHealthDataHistories(1);
    },
  });

  const [page, setPage] = useState(1);

  return (
    <div className="contentContainer" style={{ gap: 30 }}>
      <div></div>
      <Text textStyle={"bold"}>건강 데이터 조회</Text>

      <DataHistoryTable page={page} data={data} />

      {/* 페이지 이동 버튼 */}
      <DataHistoryPagination data={data} page={page} setPage={setPage} />
    </div>
  );
};

export default DataInputHistory;
