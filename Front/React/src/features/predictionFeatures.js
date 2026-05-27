import { KPIInputFields } from "../utils/utils";

export const convertKPIResultList = (data, adviceData) => {
  const result = KPIInputFields.map((item) => {
    return {
      key: item.key,
      indicator: item.title,
      status: "위험",
      unit: item.unit,
      current_value: data.physical[item.key],
      predictionValue: data.physical[item.key],
      message: adviceData.messages[item.key],
    };
  });
  return result;
};
