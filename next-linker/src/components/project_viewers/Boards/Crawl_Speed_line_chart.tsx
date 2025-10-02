import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart({crawlSpeed}: any) {


  const amounts: number[] =  crawlSpeed?.map((elem: any) => elem.amount).slice(-15);

  const speeds: number[] =  crawlSpeed?.map((elem: any) => elem.speed).slice(-15);
    
  return (
    <LineChart
        slotProps={{
            legend: {
              itemGap: 20,
              labelStyle: {
                marginLeft: 1000,
                color: "white",
              },
            },
        }}
        
        // yAxis={[ {domainLimit: () => {
        //   const range = {
        //     min:  Math.min(...speeds),
        //     max: Math.max(...speeds)
        //   }
        //   return range;
        // } }]}
        xAxis={[{ data: amounts }]}
        series={[
            {
              curve: "linear",
              data: speeds,
            },
        ]}
        height={400}
    />
  );
}
