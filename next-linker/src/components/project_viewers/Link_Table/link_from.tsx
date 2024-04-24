import { POST_find_link_from } from "apis/POST_find_link_from";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Filter_tabs from "./filter_tabs";
import Link from "next/link";
import Pagination from "./pagination";

export default function Link_from({
  totalLinkState,
  spinningState,
  sectionState,
  setFilterTab,
  filterTab,
  project_id,
  paginationState,
}: any) {
  const skeletonArray = [1, 2, 3, 4, 5];
  const router = useRouter();
  const queryParams = useSearchParams();
  const linkID = queryParams.get("id");
  const tag = queryParams.get("tag");

  const [linkFromResult, setLinkFromResult] = useState<any | null>(null);

  const getLinkFrom = async (project_id: string, link_id: string) => {
    if (linkID) {
      const data = JSON.parse(await POST_find_link_from(project_id, link_id, tag, paginationState.pageState.page, paginationState.limitState.limit)).data
      setLinkFromResult(
        data
      );

      totalLinkState.setTotalLink(data.links_length)
      if (data) {
        spinningState.setSpinning(false);
      }
    }
  };

  const handleClickLinkDetails = (id: string, tag: string) => {
    // Change the URL pathname to '/new-pathname'
    paginationState.pageState.setPage(1);
    if (id != linkID) {
      spinningState.setSpinning(true);
      sectionState.setSection("table with link id query");
      router.push(`/project-overview/${project_id}?id=${id}&tag=${tag}`);
    }
  };

  useEffect(() => {
   
    spinningState.setSpinning(true);
    getLinkFrom(project_id, linkID);
  }, [queryParams, paginationState.pageState.page, paginationState.limitState.limit]);



  return (
    <div className="flex mb-2 flex-col items-start justify-start h-full">
      <Filter_tabs
        sectionState={sectionState}
        spinningState={spinningState}
        filterTab={filterTab}
        setFilterTab={setFilterTab}
        paginationState={paginationState}
        // projID={projID}
      />
      <small className="block mb-3 text-xl">
        Result for:{" "}
        <Link
          className="hover:text-yellow-300"
          target="_blank"
          href={`${linkFromResult?.target}`}
        >
          {linkFromResult?.target}
        </Link>
      </small>
      <small className="block mb-3">
        This link has been crawled from all the links below:
      </small>
      <small className="block mb-3">
        {totalLinkState.totalLink}
      </small>
      <div className="relative overflow-x-auto grow-1 w-full">
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
              ? linkFromResult?.from.map((link: any, i: number) => (
                  <tr
                    className="w-64 bg-white border-b group dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-200"
                    key={link?.id}
                    onClick={() => handleClickLinkDetails(link?.id, link?.tag)}
                  >
                    <th
                      scope="row"
                      className="text-balance url-row px-6 group-hover:dark:text-gray-700 group-hover:text-gray-500  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {link.url}
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
}
