import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../../index.css";

export const EBarChart = ({ metrics }) => {
  const option = {
    title: {
      text: "5대 지표 차트",
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    legend: {},

    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },

    yAxis: {
      type: "category",
      data: metrics.map((item) => item.name),
    },

    series: [
      {
        name: "현재값",
        type: "bar",
        data: metrics.map((item) => item.current),
      },

      {
        name: "예측값",
        type: "bar",
        data: metrics.map((item) => item.target),
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "550px", height: "500px" }} />
  );
};
