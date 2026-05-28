import { totalInputFields } from "../../utils/utils";

export const rowCount = 10;

export const modifyKey = "modify";
export const deleteKey = "delete";
export const predictionKey = "prediction";

export const tableColumns = [
  {
    title: "번호",
    key: "id",
  },
  {
    title: "검진날짜",
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
