"use client";

import Sidebar from "../../../components/sidebar";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import ChartComponent from "../../../components/project_viewers/overview";
import UrlTable from "../../../components/project_viewers/Link_Table/url_table";
import { Socket, io } from "socket.io-client";
import Link_from from "components/project_viewers/Link_Table/link_from";
import { GET_project_general } from "apis/GET_project_general";
import { GET_links_result_pagination } from "apis/GET_links_result_pagination";

const serverURL = "localhost:3001";

// export const ProjectViewContext = createContext<Socket>(io(serverURL));

export default function LinkOverview() {
  // const socket = useMemo(() => io(serverURL), []);
  const pathname = usePathname();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // console.log(pathname);
  const [linksData, setLinksData] = useState<any>([]);
  const [totalLink, setTotalLink] = useState<number>(0);
  const [section, setSection] = useState<string>("table");
  const [filterTab, setFilterTab] = useState<string[]>([]);
  const [searchLinkInput, setSearchLinkInput] = useState<string>("");
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const [overviewFeatures, setOverviewFeatures] = useState<any>({});

  useEffect(() => {
    (async () => {
      setOverviewFeatures(
        (await GET_project_general(pathname.replace("/project-overview", "")))
          .data.overview_features
      );
    })();
  }, []);

  const series1 = overviewFeatures?.a;
  const series2 = overviewFeatures?.link;
  const series3 = overviewFeatures?.img;
  const series4 = overviewFeatures?.others;
  const labels = [
    `a: ${series1}`,
    `link: ${series2}`,
    `img: ${series3}`,
    `Others: ${series4}`,
  ];

  const series: any = [series1, series2, series3, series4];

  useLayoutEffect(() => {
    setPage(1);
    GET_links_result_pagination(
      pathname.replace("/project-overview", ""),
      filterTab,
      { limit, page: 1 },
      searchLinkInput,
      setSpinning,
      setTotalLink,
      setLinksData
    );
  }, [limit]);

  useLayoutEffect(() => {
    GET_links_result_pagination(
      pathname.replace("/project-overview", ""),
      filterTab,
      { limit, page },
      searchLinkInput,
      setSpinning,
      setTotalLink,
      setLinksData
    );
  }, [filterTab]);

  useLayoutEffect(() => {
    if (searchLinkInput != "") {
      const searchInputTO = setTimeout(() => {
        // console.log(searchLinkInput);
        setPage(1);
        GET_links_result_pagination(
          pathname.replace("/project-overview", ""),
          filterTab,
          { limit, page: 1 },
          searchLinkInput,
          setSpinning,
          setTotalLink,
          setLinksData
        );
      }, 1000);
      return () => {
        clearTimeout(searchInputTO);
      };
    }
  }, [searchLinkInput]);

  return (
    <>
      <Sidebar
        sectionState={{ setSection, section }}
        linksData={linksData}
        projectID={pathname.replace("/project-overview/", "")}
      />

      <div className="p-4 sm:ml-64 h-[100vh]">
        {section == "table" ? (
          <UrlTable
            paginationState={{
              pageState: { page, setPage },
              limitState: { limit, setLimit },
            }}
            searchLinkInput={searchLinkInput}
            setSearchLinkInput={setSearchLinkInput}
            totalLinkState={{ totalLink, setTotalLink }}
            spinningState={{ isSpinning, setSpinning }}
            sectionState={{ setSection, section }}
            projID={pathname.replace("/project-overview/", "")}
            linksData={linksData}
            setLinksData={setLinksData}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
          />
        ) : section == "table with link id query" ? (
          <Link_from
          paginationState={{
            pageState: { page, setPage },
            limitState: { limit, setLimit },
          }}
          totalLinkState={{ totalLink, setTotalLink }}
            setFilterTab={setFilterTab}
            spinningState={{ isSpinning, setSpinning }}
            filterTab={filterTab}
            sectionState={{ setSection, section }}
            project_id={pathname.replace("/project-overview/", "")}
            linksData={linksData}
            setLinksData={setLinksData}
          />
        ) : (
          <ChartComponent
            series={series}
            labels={labels}
            options={{
              texts: {
                foreColor: "$fff",
              },
              theme: {
                mode: "dark",
                palette: "palette1",
                monochrome: {
                  enabled: false,
                  color: "#255aee",
                  shadeTo: "dark",
                  shadeIntensity: 0.65,
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
}
