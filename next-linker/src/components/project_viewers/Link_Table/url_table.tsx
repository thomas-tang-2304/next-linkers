import React, { memo, useEffect, useState } from "react";
import Filter_tabs from "./filter_tabs";
import { useRouter } from "next/navigation";
import Pagination from "./pagination";
import { GET_links_result_pagination } from "apis/GET_links_result_pagination";

export default memo(function UrlTable({
  totalLinkState,
  spinningState,
  sectionState,
  linksData,
  setFilterTab,
  filterTab,
  projID,
  setLinksData,
  searchLinkInput,
  setSearchLinkInput,
  paginationState,
}: any) {
  const router = useRouter();
  const fullLinksFound = linksData;
  const skeletonArray = [1, 2, 3, 4, 5];

  const replaceSearchWordPosition = (url: string, search_input: string) => {
    const start_pos = url.indexOf(search_input);
    const end_pos = start_pos + search_input.length;

    return (
      <>
        {url.slice(0, start_pos)}
        <mark>{url.slice(start_pos, end_pos)}</mark>
        {url.slice(end_pos, url.length)}
      </>
    );
  };

  const handleClickLinkDetails = (id: string, tag: string) => {
    // Change the URL pathname to '/new-pathname'
    sectionState.setSection("table with link id query");
    router.push(`/project-overview/${projID}?id=${id}&tag=${tag}`);
  };

  useEffect(() => {
    GET_links_result_pagination(
      projID,
        filterTab,
        { limit: parseInt(paginationState.limitState.limit), page: paginationState.pageState.page },
        searchLinkInput,
        spinningState.setSpinning,
        totalLinkState.setTotalLink,
        setLinksData
      );
  }, [totalLinkState.totalLink, paginationState.pageState.page, filterTab, paginationState.limitState.limit]);

  return (
    <div className="flex mb-2 flex-col items-start justify-between h-full">
      <Filter_tabs
        paginationState={paginationState}
        setSearchLinkInput={setSearchLinkInput}
        sectionState={sectionState}
        spinningState={spinningState}
        filterTab={filterTab}
        setFilterTab={setFilterTab}
        // projID={projID}
      />
      <small className="mb-4">
        {totalLinkState.totalLink > 0
          ? `${totalLinkState.totalLink} links found`
          : "No links found"}
      </small>
      <div className="relative overflow-x-auto grow-1 h-full w-full">
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="url-row px-6 py-3">
                URL
              </th>
              <th scope="col" className="px-6 py-3">
                Status code
              </th>
              <th scope="col" className="px-6 py-3">
                Content Type
              </th>
              <th scope="col" className="px-6 py-3">
                Tag type
              </th>
              <th scope="col" className="px-6 py-3">
                Depth
              </th>
            </tr>
          </thead>
          <tbody>
            {!spinningState.isSpinning
              ? fullLinksFound?.map((link: any, i: number) => (
                  <tr
                    className="w-64 bg-white border-b group dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-200"
                    key={link?.id}
                    onClick={() => handleClickLinkDetails(link?.id, link?.tag)}
                  >
                    <th
                      scope="row"
                      className="text-balance url-row px-6 group-hover:dark:text-gray-700 group-hover:text-gray-500  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {searchLinkInput == ""
                        ? link.url
                        : replaceSearchWordPosition(link.url, searchLinkInput)}
                      {}
                    </th>
                    <td className="px-6 py-4">{link?.status_code}</td>
                    <td className="px-6 py-4">{link?.content_type}</td>
                    <td className="px-6 py-4">{link?.tag}</td>
                    <td className="px-6 py-4">{link?.depth}</td>
                  </tr>
                ))
              : skeletonArray?.map((link: any) => (
                  <tr
                    className="w-64 bg-white border-b group dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-200"
                    key={link}
                  >
                    <th
                      scope="row"
                      className="text-balance url-row px-6 group-hover:dark:text-gray-700 group-hover:text-gray-500  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>

                        <span className="sr-only">Loading...</span>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      {" "}
                      <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>

                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>

                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>

                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      <div role="status" className="animate-pulse">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Pagination
       
        totalLinkState={totalLinkState}
        active_page_number={paginationState.pageState.page}
        limit={paginationState.limitState.limit}
        setPage={paginationState.pageState.setPage}
        filterTab={filterTab}
      />
    </div>
  );
});
