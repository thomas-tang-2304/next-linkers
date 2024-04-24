import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { PieChart } from "@mui/x-charts/PieChart";

interface SelectedDevices {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
}

const ChartComponent: React.FC = ({ series, labels }: any) => {
  return (
    <div className="w-fit bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <h1 className="text-2xl text-center uppercase">
        Chart Showing Tag Name Percentages
      </h1>
      <div className="py-6" id="donut-chart">
        <PieChart
          margin={{ left: -50 }}
          colors={[
            "#8dd3c7",
            "#ffffb3",
            "#bebada",
            "#fb8072",
            "#80b1d3",
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd",
            "#ccebc5",
            "#ffed6f",
          ]}
          slotProps={{
            legend: {
              itemGap: 20,
              labelStyle: {
                marginLeft: 1000,
                fill: "white",
              },
            },
          }}
          series={[
            {
              data: series.map((serial, id) => ({
                id,
                value: serial,
                label: labels[id],
              })),
              innerRadius: 10,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 3,
              startAngle: 0,
              // endAngle: 180,
              // cx: 150,
              // cy: 150,
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
