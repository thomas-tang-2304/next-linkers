import React from "react";

export default function Progress_bar({ projectLinks, color }: any) {
  const class1 =
    color == "blue"
      ? "text-blue-700 dark:text-blue-500"
      : color == "red"
      ? "text-red-700 dark:text-red-500"
      : color == "green"
      ? "text-green-700 dark:text-green-500"
      : color == "yellow"
      ? "text-yellow-700 dark:text-yellow-500"
      : color == "indigo"
      ? "text-indigo-700 dark:text-indigo-500"
      : color == "purple"
      ? "text-purple-700 dark:text-purple-500"
      : "dark:text-white";
  const class2 =
    color == "blue"
      ? "bg-blue-600"
      : color == "red"
      ? "bg-red-600 dark:bg-red-500"
      : color == "green"
      ? "bg-green-600 dark:bg-green-500"
      : color == "yellow"
      ? "bg-yellow-400"
      : color == "indigo"
      ? "bg-indigo-600 dark:bg-indigo-500"
      : color == "purple"
      ? "bg-purple-600 dark:bg-purple-500"
      : "bg-gray-600 dark:bg-gray-300";

  return (
    <>
      <div className={`mb-1 text-base font-medium ${class1}`}>
        {(
          (projectLinks?.crawlable_links?.new_links /
            projectLinks?.crawlable_links?.total) *
          100
        ).toFixed(2) ?? 0}
        %{" "}
        {!isNaN(projectLinks?.avgSpeed) &&
          `(${parseFloat(projectLinks?.avgSpeed).toFixed(1)} url/s)`}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div
          className={`${class2} h-2.5 rounded-full`}
          style={{
            width: `${
              (
                (projectLinks?.crawlable_links?.new_links /
                  projectLinks?.crawlable_links?.total) *
                100
              ).toFixed(2) ?? 0
            }%`,
          }}
        ></div>
      </div>
    </>
  );
}
