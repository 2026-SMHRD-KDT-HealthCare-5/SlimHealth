import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../../index.css";

const chartMaxValue = 400;
const currentColor = "#5470c6";
const predictionColor = "#a3cc75";

export const EBarChart = ({ metrics }) => {
  // const option = {
  //   title: {
  //     text: "5대 지표 차트",
  //   },

  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       type: "shadow",
  //     },
  //   },

  //   legend: {},

  //   xAxis: {
  //     type: "value",
  //     boundaryGap: [0, 0.01],
  //   },

  //   yAxis: {
  //     type: "category",
  //     data: metrics.map((item) => item.name),
  //   },

  //   series: [
  //     {
  //       name: "현재값",
  //       type: "bar",
  //       data: metrics.map((item) => item.current),
  //     },

  //     {
  //       name: "예측값",
  //       type: "bar",
  //       data: metrics.map((item) => item.target),
  //     },

  //     {
  //       name: "",
  //       type: "bar",
  //       data: metrics.map(() => chartMaxValue),
  //       color: "transparent",
  //     },
  //   ],
  // };

  const option = {
    animation: false,
    title: {
      text: "5대 지표 차트",
      textStyle: {
        fontSize: 25,
        fontWeight: 700,
      },
    },
    legend: {
      data: ["현재값", "예측값"],
      textStyle: {
        fontSize: 20,
        fontWeight: 500,
      },
    },
    radar: {
      center: ["50%", "56%"],
      radius: "68%",
      axisName: {
        fontSize: 20,
        fontWeight: 500,
      },
      indicator: metrics.map((item) => {
        return { name: item.name, max: chartMaxValue };
      }),
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            name: "예측값",
            value: metrics.map((item) => item.target),
            itemStyle: {
              color: predictionColor,
            },
            lineStyle: {
              color: predictionColor,
            },
          },
          {
            name: "현재값",
            value: metrics.map((item) => item.current),
            itemStyle: {
              color: currentColor,
            },
            lineStyle: {
              color: currentColor,
            },
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      notMerge={true}
      lazyUpdate={false}
      opts={{ renderer: "canvas" }}
      style={{ width: "550px", height: "750px" }}
    />
  );
};
