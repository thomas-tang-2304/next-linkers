"use client";

import type { Metadata } from "next";
import {
  useState,
  type ReactElement,
  useEffect,
  useRef,
  createContext,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import Layout from "../app/layout";

import type { NextPageWithLayout } from "./_app";

import Project from "../components/project_node/project";
import { get } from "..//components/cookies/cookie";

export const CrawllinksContext = createContext<any>(0);

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

const Page: NextPageWithLayout = () => {
  const [isCalling, setCalling] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    handleGetCookies();
   
  }, []);

  const handleGetCookies = async () => {
    const cookieProjects = (await get("projects"))?.value;
    // console.log(cookieProjects);

    if (cookieProjects) {
      setProjects(
        cookieProjects?.includes("|")
          ? Array.from(new Set(cookieProjects.split("|").map((proj: any) => proj)))
          : [cookieProjects]
      );
    }
  };
  return (
    <div className="flex gap-3">
      <div className="work-space flex flex-col flex-[1] w-[25%] gap-3 pt-5">
        {projects
          ?.filter((proj: string, key: number) => key % 4 == 0)
          ?.map((proj: string, key: number) => (
            <>
              <div key={key} className="rounded-lg w-full">
                <CrawllinksContext.Provider
                key={key}
                  value={{
                    isCalling,
                    setCalling,
                  }}
                >
                  <Project
                  key={key}
                    projectID={proj}
                    setProjects={setProjects}
                    projects={projects}
                  />
                </CrawllinksContext.Provider>
              </div>
            </>
          ))}
        {projects.length % 4 == 0 && (
          <button
            onClick={() => {
              setProjects((prev: any) => {
                return [...prev, guidGenerator()];
              });
            }}
            className="flex w-full h-full justify-center items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-8xl font-bold tracking-tight ">+</h5>
          </button>
        )}
      </div>

      <div className="work-space flex flex-col flex-[1] w-[25%] gap-3 pt-5">
        {projects
          ?.filter((proj: string, key: number) => key % 4 == 1)
          ?.map((proj: string, key: number) => (
            <>
              <div key={key} className="rounded-lg w-full">
                <CrawllinksContext.Provider
                key={key}
                  value={{
                    isCalling,
                    setCalling,
                  }}
                >
                  <Project
                  key={key}
                    projectID={proj}
                    setProjects={setProjects}
                    projects={projects}
                  />
                </CrawllinksContext.Provider>
              </div>
            </>
          ))}
        {projects.length % 4 == 1 && (
          <button
            onClick={() => {
              setProjects((prev: any) => {
                return [...prev, guidGenerator()];
              });
            }}
            className="flex w-full h-full justify-center items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-8xl font-bold tracking-tight ">+</h5>
          </button>
        )}
      </div>
      <div className="work-space flex flex-col flex-[1] w-[25%] gap-3 pt-5">
        {projects
          ?.filter((proj: string, key: number) => key % 4 == 2)
          ?.map((proj: string, key: number) => (
            <>
              <div key={key} className="rounded-lg w-full">
                <CrawllinksContext.Provider
                key={key}
                  value={{
                    isCalling,
                    setCalling,
                  }}
                >
                  <Project
                  key={key}
                    projectID={proj}
                    setProjects={setProjects}
                    projects={projects}
                  />
                </CrawllinksContext.Provider>
              </div>
            </>
          ))}
        {projects.length % 4 == 2 && (
          <button
            onClick={() => {
              setProjects((prev: any) => {
                return [...prev, guidGenerator()];
              });
            }}
            className="flex w-full h-full justify-center items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-8xl font-bold tracking-tight ">+</h5>
          </button>
        )}
      </div>
      <div className="work-space flex flex-col flex-[1] w-[25%] gap-3 pt-5">
        {projects
          ?.filter((proj: string, key: number) => key % 4 == 3)
          ?.map((proj: string, key: number) => (
            <>
              <div key={key} className="rounded-lg w-full">
                <CrawllinksContext.Provider
                key={key}
                  value={{
                    
                    isCalling,
                    setCalling,
                  }}
                >
                  <Project
                  key={key}
                    projectID={proj}
                    setProjects={setProjects}
                    projects={projects}
                  />
                </CrawllinksContext.Provider>
              </div>
            </>
          ))}
        {projects.length % 4 == 3 && (
          <button
            onClick={() => {
              setProjects((prev: any) => {
                return [...prev, guidGenerator()];
              });
            }}
            className="flex w-full h-full justify-center items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-8xl font-bold tracking-tight ">+</h5>
          </button>
        )}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
