import { PieChart } from "@mui/x-charts/PieChart";

const LinksPieChart: React.FC = ({options, series, labels }: any) => {
    return (
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
              },
            },
          }}
          series={[
            {
              data: series.map((serial: number, id: number) => ({
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
    )
}

export default LinksPieChart