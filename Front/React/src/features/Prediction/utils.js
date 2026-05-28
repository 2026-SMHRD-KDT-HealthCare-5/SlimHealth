import { KPIInputFields } from "../../utils/utils";

export const convertKPIResultList = (adviceData) => {
  const result = adviceData.advices.map((item) => {
    const targetField = KPIInputFields.find((field) => {
      return field.title == item.indicator;
    });
    return {
      key: targetField.key,
      indicator: item.indicator,
      status: item.status,
      unit: targetField.unit,
      current_value: item.current_value.replace(targetField.unit, ""),
      predictionValue: item.current_value.replace(targetField.unit, ""),
      message: item.message,
    };
  });
  return result;
};
