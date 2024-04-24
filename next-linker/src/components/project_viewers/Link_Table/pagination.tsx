import { GET_links_result_pagination } from "apis/GET_links_result_pagination";
import { GET_project_general } from "apis/GET_project_general";
import React, { useEffect, useState } from "react";

export default function Pagination({
  //   length,
  // project_id,
  active_page_number,
  limit,
  setPage,
  totalLinkState,
  filterTab,
  // setLinksData,
  // searchLinkInput,
  // setSpinning,
}: any) {
  const [calPage, setCalPage] = useState<number[]>([]);

  const handleClickPage = (pageNum: number) => {
    setPage(pageNum);
   
  };
  useEffect(() => {
    const newPages = [];
    for (
      let index = 1;
      index <= Math.ceil(totalLinkState.totalLink / limit);
      index++
    ) {
      newPages.push(index);
    }
    setCalPage(newPages);
    // console.log(Math.ceil(totalLinkState.totalLink / limit));
  }, [totalLinkState.totalLink, active_page_number, filterTab, limit]);

  useEffect(() => {
    setPage(1);
  }, [filterTab]);
  return (
    <div className=" mx-auto mt-3">
      <nav
        className="dark:bg-gray-800 p-3"
        aria-label="Page navigation example"
      >
        <ul className="inline-flex -space-x-px text-base h-10 gap-4">
          <li>
            <a
              onClick={() =>
                handleClickPage(
                  active_page_number - 1 == 0 ? 1 : active_page_number - 1
                )
              }
              href="#"
              className="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-sm pagination-box-shadow"
            >
              Previous
            </a>
          </li>
          {[
            ...calPage.slice(
              active_page_number - 4 < 0 ? 0 : active_page_number - 4,
              active_page_number - 1
            ),
            ...calPage.slice(active_page_number - 1, active_page_number + 3),
          ].length != 0 && [
            ...calPage.slice(
              active_page_number - 4 < 0 ? 0 : active_page_number - 4,
              active_page_number - 1
            ),
            ...calPage.slice(active_page_number - 1, active_page_number + 3),
          ].map((page) =>
            active_page_number != page ? (
              <li>
                <a
                  onClick={() => handleClickPage(page)}
                  href="#"
                  className="flex items-center justify-center w-[50px] px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-sm pagination-box-shadow"
                >
                  {page}
                </a>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center w-[50px] px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-yellow-200 rounded-sm pagination-box-shadow active"
                >
                  {page}
                </a>
              </li>
            )
          )}

          <li>
            <a
              onClick={() =>
                handleClickPage(
                  active_page_number + 1 >
                    Math.ceil(totalLinkState.totalLink / limit)
                    ? Math.ceil(totalLinkState.totalLink / limit)
                    : active_page_number + 1
                )
              }
              href="#"
              className="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-sm pagination-box-shadow"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
