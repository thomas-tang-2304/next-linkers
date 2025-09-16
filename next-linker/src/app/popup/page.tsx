"use client";

import * as React from "react";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog, { DialogProps } from "@mui/material/Dialog";

import { toHHMMSS } from "funcs/to_hhmmss";

// Replace this with the URL of your Socket.io server

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps | any) {
  const limitInitialLinks: number[] = [5, 10, 20, 50, Infinity];
  const { onClose, selectedValue, open } = props;

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("md");


  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <div className="border-gray-50 dark:border-gray-700 border">
        <DialogTitle className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
          Send Link
        </DialogTitle>
        <main className=" w-full popup-link flex flex-col items-center justify-between p-5">
          {!props.callingState?.isCalling && (
            <>
              <div className="max-w-5xl w-[80%] py-6">
                <label
                  htmlFor="large-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Website URL
                </label>
                <input
                  ref={props.inputRef.InputLink}
                  onKeyDown={props.POST_handleSendLink}
                  type="text"
                  id="large-input"
                  className="mb-4 block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />

                <label
                  htmlFor="input-group-1"
                  className={`block mb-2 text-sm font-medium ${
                    !props.errorMailState.errorEmail
                      ? "text-gray-900"
                      : "text-red-500"
                  } dark:${
                    !props.errorMailState.errorEmail
                      ? "text-white"
                      : "text-red-500"
                  }`}
                >
                  Your Email
                </label>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 16"
                    >
                      <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    ref={props.inputRef.InputEmail}
                    onKeyDown={props.POST_handleSendLink}
                    className={`bg-gray-50 border border-gay-300 dark:bg-gray-700 ${
                      !props.errorMailState.errorEmail
                        ? "dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        : "dark:border-red-500 dark:placeholder-red-400 dark:text-red-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5`}
                    placeholder="name@flowbite.com"
                  />
                </div>
              </div>
            </>
          )}
          {/* ****************************************************************** */}
          {props.callingState?.isCalling && (
          
            <strong className="font-bold block">
              Est finish time:{" "}
              {toHHMMSS(
                (props.projectLinksState?.project?.crawlable_links?.total -
                  props.projectLinksState?.project?.crawlable_links
                    ?.new_links) /
                  parseFloat(props.projectLinksState?.project?.avgSpeed) +
                  ""
              )}{" "}
            </strong>
          )}
          {props.callingState?.isCalling == null ? (
            ""
          ) : props.callingState?.isCalling == true ? (
            <strong className="text-center">
              <b className="text-yellow-300">
                {props.projectLinksState?.project?.crawlable_links?.new_links ??
                  0}
              </b>{" "}
              links have been crawled of{" "}
              <b className="text-purple-300">
                {props.projectLinksState?.project?.crawlable_links?.total ?? 0}
                (+
                {props.projectLinksState?.project?.crawlable_links?.last_length ?? 0})
              </b>
              , completed{" "}
              <b className="text-cyan-500">
                {(
                  (props.projectLinksState?.project?.crawlable_links
                    ?.new_links /
                    props.projectLinksState?.project?.crawlable_links?.total) *
                  100
                ).toFixed(2) ?? 0}
                %
              </b>{" "}
              percent
            </strong>
          ) : (
            <h1 className="text-5xl">
              {props.hasErrorState.hasError
                ? "An error occured!"
                : "Completed!"}
            </h1>
          )}
          {!props.callingState?.isCalling && (
            <div className="my-8 flex justify-center text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
              <button
                disabled={props.callingState?.isCalling}
                onClick={() => {
                  props.POST_handleSendLink({ key: "Enter" });
                }}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                rel="noopener noreferrer"
              >
                <h2 className={`mb-3 text-2xl font-semibold`}>
                  Go{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                  </span>
                </h2>
                {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p> */}
              </button>
            </div>
          )}
        </main>
      </div>
    </Dialog>
  );
}

export default function DialogToggle(props: any) {
  const [open, setOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="w-full">
        {props.DialogButton}
      </button>
      <SimpleDialog
        {...props}
        // selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
