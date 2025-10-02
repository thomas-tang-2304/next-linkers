import React, { useEffect, useState } from "react";
import LinksPieChart from "./Boards/Links_pie_chart";
// import ApexCharts from "react-apexcharts";
// import { PieChart } from "@mui/x-charts/PieChart";
import { usePathname } from "next/navigation";
import { GET_project_general } from "apis/GET_project_general";
import BasicLineChart from "./Boards/Crawl_Speed_line_chart";
import { GET_project_crawl_speed } from "apis/GET_crawl_speed";

// interface SelectedDevices {
//   desktop: boolean;
//   tablet: boolean;
//   mobile: boolean;
// }

const Overview: React.FC = () => {

  const pathname = usePathname();

  const [linksPieChartFeatures, setLinksPieChartFeatures] = useState<any>({});
  const [crawlSpeed, setCrawlSpeed] = useState<any>([{amount: 0, speed: 0}]);
  
    useEffect(() => {
      (async () => {
        setLinksPieChartFeatures(
          (await GET_project_general(pathname.replace("/project-overview", ""), null))
            .data.overview_features
        );
      })();

      (async () => {
        setCrawlSpeed(
          (await GET_project_crawl_speed(pathname.replace("/project-overview", "")))
            .data
        );
      })();
    }, []);
    
    const links_series1 = linksPieChartFeatures?.a;
    const links_series2 = linksPieChartFeatures?.link;
    const links_series3 = linksPieChartFeatures?.img;
    const links_series4 = linksPieChartFeatures?.others;
    
    const links_pie_chart: {links_series: any, links_labels: any} = {
      links_series: [links_series1, links_series2,  links_series3, links_series4],
      links_labels: [
        `a: ${links_series1}`,
        `link: ${links_series2}`,
        `img: ${links_series3}`,
        `Others: ${links_series4}`,
      ]
    }
    
    const { links_series, links_labels } = links_pie_chart;
    return (
    <div className="flex gap-5">
      <div className="w-1/2">
          
          <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <h1 className="text-xl text-center uppercase">
              Chart Showing Tag Name Percentages
            </h1>

            <div className="py-6" id="donut-chart">
              <LinksPieChart series={links_series} labels={links_labels}/>
            
            </div>
          </div>
     
      </div>

      <div className="w-1/2">
          
          <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-1 md:px-2 md:pt-6">
            <h1 className="text-xl text-center uppercase">
              Crawling Speed (links/s)
            </h1>

            <div className="py-6" id="donut-chart">
              <BasicLineChart crawlSpeed={crawlSpeed}/>
            
            </div>
          </div>
     
      </div>
    </div>
  );
};

export default Overview;
