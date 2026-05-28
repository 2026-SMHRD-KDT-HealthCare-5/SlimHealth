import { KPIInputFields } from "../../utils/utils";

export const convertKPIResultList = (healthData, adviceData) => {
  const result = adviceData.advices.map((item) => {
    const targetField = KPIInputFields.find((field) => {
      return field.title == item.indicator;
    });
    return {
      key: targetField.key,
      indicator: item.indicator,
      status: item.status,
      unit: targetField.unit,
      current_value: healthData.physical[targetField.key],
      predictionValue: healthData.physical[targetField.key],
      message: item.message,
    };
  });
  return result;
};
