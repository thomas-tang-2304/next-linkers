import DialogToggle from "../../app/popup/page";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { create, get } from "../cookies/cookie";
import { io } from "socket.io-client";
import http from "http";
import Progress_bar from "./progress_bar";
// import { GET_project } from "../../apis/GET_project";
import { GET_project_general } from "apis/GET_project_general";
import { POST_create_file, POST_delete_file } from "apis/POST_CRUD_file";
import { validate_email } from "funcs/validate_inpu";
import { toHHMMSS } from "funcs/to_hhmmss";
import schedule from 'node-schedule';


export default function Project({ projectID, setProjects, projects }: any) {

  const [isCalling, setCalling] = useState<boolean | null>(null);

  const [progressMsg, setProgressMsg] = useState<any>({});
  const [errorEmail, setErrorEmail] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState<boolean | null>(null);
  const [checkedLimitLinks, setCheckedLimitLinks] = React.useState<number>(5);
  const [project, setProject] = useState<any>({});

  const InputLink: any = useRef();
  const InputEmail: any = useRef();
 


  useEffect(() => {
    mapProjectByID();
    const fetcher = (schedule.scheduleJob('*/5 * * * * *', function(){
      (async() => {
        setProject((await GET_project_general(projectID)).data);
      })();
  }));
    return () => {
      
      fetcher?.cancel();
    }
  }, [projects]);

  const mapProjectByID = async () => {
    const projectData = (await GET_project_general(projectID)).data;
    if (projectData.status == "crawling") {
      setCalling(true);
     
    }
    if (project.status == "finished" || project.status == "failed") {
      setCalling(false)
    }
    
    setProject(projectData);
    return projectData
  };
  
  const POST_handleSendLink = async (e: any) => {
    if (e.key === "Enter") {
      
      const colors = ["yellow", "white", "green", "indigo", "purple"];

      const random = Math.floor(Math.random() * colors.length);
     

      const initialProject = {
        project_id: projectID,
        project_name: InputLink?.current?.value,
        status: "crawling",
        color: colors[random],
      };
     
      (async () => {
        const initialProjectData = await POST_create_file({
          ...initialProject,
          projectID,
        });
        // res.create_status;
        console.log(initialProjectData);

        await create(
          "projects",
          (
            await get("projects")
          )?.value
            ? (await get("projects")).value + "|" + projectID
            : projectID
        );
      })();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        url: InputLink.current.value,
        email: InputEmail.current.value,
        uid_socket: projectID,
        color: initialProject.color,
      });

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      if (validate_email(InputEmail.current.value.trim())) {
        setCalling(true);
        setErrorEmail(false);
        setProject({ initialProject }); 
<<<<<<< HEAD
        fetch("http://localhost:3001/email/send", requestOptions)
=======
        fetch("http://192.168.1.229:3001/email/send", requestOptions)
>>>>>>> c984030b73b3a7b064b8ac96c56692ae06155fb4
          .then((response) => response.text())
          .then((result) => {
            setHasError(false);
            setProject({
              project_id: projectID,
              project_name: initialProject.project_name,
              finishedTime: JSON.parse(result).elapsedTime / 1000,

              status: "finished",
            });

            setCalling(false);
            console.log(result);
          })
          .catch((error) => {
            setHasError(true);
            setProject({
              // finishedTime: error.elapsedTime / 1000,
              project_id: projectID,
              project_name: initialProject.project_name,
              status: "failed",
            });
            setCalling(false);
            console.log("error", error);
          })
          .finally(() => {
            setCalling(false);
            // console.log(`${projectID} has stop crawling`);
          });
      } else {
        setErrorEmail(true);
      }
    }
  };

  const openProjectOverview = (e: any) => {
    return e.stopPropagation();
  };
  return (
    <DialogToggle
      checkedLimitLinks={checkedLimitLinks}
      setCheckedLimitLinks={setCheckedLimitLinks}
      projectLinksState={{ project, setProject }}
      inputRef={{ InputLink, InputEmail }}
      POST_handleSendLink={POST_handleSendLink}
      progressState={{ progressMsg, setProgressMsg }}
      errorMailState={{ errorEmail, setErrorEmail }}
      callingState={{ isCalling, setCalling }}
      hasErrorState={{ hasError, setHasError }}
      DialogButton={
        <div className="relative group">
          <button
            className="absolute z-10 right-[-11px] top-[-11px] hidden group-hover:block"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setProjects((prev: any) => {
                const newProjectIDs = prev.filter((r: any) => r != projectID);
                create("projects", newProjectIDs.join("|"));
                return newProjectIDs;
              });
              (async () => {
                await POST_delete_file(projectID);
              })();
              mapProjectByID(projectID);
              openProjectOverview(e);
            }}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div className="relative h-full flex flex-col justify-between max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {project?.project_name && project?.project_id && (
              <>
                <div className="absolute top-[4px] left-[7px] flex gap-2">
                  <Link
                    href={`/project-overview/${project.project_id}`}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      openProjectOverview(e);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </Link>
                </div>
              </>
            )}

            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1  w-full">
              {project?.project_name ?? "New project"}
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              {isCalling && project && (
                <Progress_bar projectLinks={project} color={project?.color} />
              )}
              <small className="font-bold block">
                {project?.status != "finished"
                  ? null
                  : `Finished time: ${toHHMMSS((project?.elapsedTime / 1000).toFixed(
                      2
                    ))}s`}
              </small>

              <small className="font-bold block">
                Total: {project?.all_links?.total}
              </small>
              <small className={`font-bold block capitalize`}>
                Status:{" "}
                <mark
                  className={`bg-transparent ${
                    project?.status == "crawling"
                      ? "text-yellow-200"
                      : project?.status == "failed"
                      ? "text-red-400"
                      : "text-emerald-200"
                  }`}
                >
                  {project?.status}
                </mark>
              </small>
            </div>
          </div>
        </div>
      }
    />
  );
}
