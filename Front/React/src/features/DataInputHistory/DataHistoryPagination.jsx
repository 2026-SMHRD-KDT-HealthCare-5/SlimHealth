import React from "react";
import { OutlinedButton } from "../../components/OutlinedButton/OutlinedButton";
import { Text } from "../../components/Text/Text";
import { rowCount } from "./utils";

const DataHistoryPagination = ({ data, page, setPage }) => {
  const maxPage = Math.ceil(data.length / rowCount);
  return (
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
      {maxPage > page && (
        <OutlinedButton
          onClick={() => {
            setPage(page + 1);
          }}
        >
          다음
        </OutlinedButton>
      )}
    </div>
  );
};

export default DataHistoryPagination;
