import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Filter_tabs({
  filterTab,
  setFilterTab,
  paginationState,
  sectionState,
  setSearchLinkInput,
}: any) {


  const [tab1, setTab1] = useState<string | null>(null);
  const [tab2, setTab2] = useState<string | null>(null);

  const filter_labels_1: string[] = ["Internal Links", "External Links"];
  const filter_labels_2: string[] = ["HTML", "CSS", "JavaScript", "Image"];

  const limits: number[] = [10, 20, 30, 50, 100];

  const handleSetFilterType = (
    index: number,
    setTab: Dispatch<SetStateAction<string>>,
    filter: string[]
  ) => {
    sectionState.setSection("table");
    setTab((prev: string | null) =>
      prev === filter[index] ? undefined : filter[index]
    );
  };

  useEffect(() => {
    setFilterTab([tab1, tab2]);
  }, [tab1, tab2]);

  return (
    <>
      <div className="flex justify-between gap-3 mb-3 w-full">
        <div className="flex gap-3 mb-3">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {filter_labels_1.map((label: string, i: number) => {
              if (i == 0) {
                return (
                  <button
                    onClick={() => {
                      handleSetFilterType(i, setTab1, filter_labels_1);
                    }}
                    key={i}
                    type="button"
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 ${
                      filterTab.includes(label) &&
                      "z-10 ring-2 ring-blue-700 text-blue-700"
                    } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                      filterTab.includes(label) &&
                      "dark:ring-blue-500 dark:text-white "
                    }`}
                  >
                    {label}
                  </button>
                );
              } else {
                if (i == filter_labels_1.length - 1) {
                  return (
                    <button
                      onClick={() => {
                        handleSetFilterType(i, setTab1, filter_labels_1);
                      }}
                      key={i}
                      type="button"
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 ${
                        filterTab.includes(label) &&
                        "z-10 ring-2 ring-blue-700 text-blue-700"
                      } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                        filterTab.includes(label) &&
                        "dark:ring-blue-500 dark:text-white "
                      }`}
                    >
                      {label}
                    </button>
                  );
                } else {
                  return (
                    <button
                      onClick={() => {
                        handleSetFilterType(i, setTab1, filter_labels_1);
                      }}
                      key={i}
                      type="button"
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 ${
                        filterTab.includes(label) &&
                        "z-10 ring-2 ring-blue-700 text-blue-700"
                      } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                        filterTab.includes(label) &&
                        "dark:ring-blue-500 dark:text-white "
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
              }
            })}
          </div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {filter_labels_2.map((label: string, i: number) => {
              if (i == 0) {
                return (
                  <button
                    onClick={() => {
                      handleSetFilterType(i, setTab2, filter_labels_2);
                    }}
                    key={i}
                    type="button"
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 ${
                      filterTab.includes(label) &&
                      "z-10 ring-2 ring-blue-700 text-blue-700"
                    } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                      filterTab.includes(label) &&
                      "dark:ring-blue-500 dark:text-white "
                    }`}
                  >
                    {label}
                  </button>
                );
              } else {
                if (i == filter_labels_2.length - 1) {
                  return (
                    <button
                      onClick={() => {
                        handleSetFilterType(i, setTab2, filter_labels_2);
                      }}
                      key={i}
                      type="button"
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 ${
                        filterTab.includes(label) &&
                        "z-10 ring-2 ring-blue-700 text-blue-700"
                      } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                        filterTab.includes(label) &&
                        "dark:ring-blue-500 dark:text-white "
                      }`}
                    >
                      {label}
                    </button>
                  );
                } else {
                  return (
                    <button
                      onClick={() => {
                        handleSetFilterType(i, setTab2, filter_labels_2);
                      }}
                      key={i}
                      type="button"
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 ${
                        filterTab.includes(label) &&
                        "z-10 ring-2 ring-blue-700 text-blue-700"
                      } dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 ${
                        filterTab.includes(label) &&
                        "dark:ring-blue-500 dark:text-white "
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
              }
            })}
          </div>
        </div>

        <form className="max-w-[25rem] flex-grow">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => {
                setSearchLinkInput(e.target.value);
              }}
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Links..."
              required
            />
           
          </div>
        </form>
      </div>
      <div className=" w-full flex justify-end mb-3">
        <form className="max-w-sm flex items-center justify-end gap-2">
          <label
            htmlFor="pageRow"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Page rows
          </label>
          <select
            onChange={(e) => {
              console.log("set limit");

              paginationState.limitState.setLimit(e.target.value);
            }}
            id="pageRow"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70px] p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {limits.map((l: number) => (
              <option
                key={l}
                selected={l === paginationState?.limitState?.limit}
                value={l}
              >
                {l}
              </option>
            ))}
          </select>
        </form>
      </div>
    </>
  );
}
