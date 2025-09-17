const express = require("express");
const {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdir,
  statSync,
  readdirSync,
  mkdirSync,
} = require("fs");
const { removeSync } = require("fs-extra");
const { TAG_NAMES } = require("../../config.json");
const { readFileHistory } = require("../crawl/modules/readFileHistory");
const { uniqueObjectsArray } = require("../crawl/func/uniqueArray");
const { url } = require("inspector");
const { paginate_array } = require("./funcs/pagination");
const { isValidUrl } = require("../crawl/func/validUrl");

const getLinkRouter = express.Router();

getLinkRouter.post("/delete-file", (req, res) => {
  const { project_id } = req.body;

  if (existsSync(`src/history/${project_id}`)) {
    removeSync(`src/history/${project_id}`);
    res.status(200).send(`${project_id} delete successfully`);
  } else {
    res.status(400).send(`${project_id} file id has been delete`);
  }
});

getLinkRouter.post("/create-file", (req, res) => {
  const { color, projectID, project_id, project_name, status, is_started } = req.body;
  // console.log(proj);
  if (existsSync(`src/history/${project_id}`)) {
    removeSync(`src/history/${project_id}`);
  }
  const createDirectory = (attr_name, folder_name) => {
    mkdir(`src/history/${projectID}/${attr_name}/${folder_name}`, (error) => {
      if (error) {
        console.log(error);
      } else {
       
        console.log(`write ${projectID}/${folder_name} main successfully`);
      }
    });
  };
  mkdir(`src/history/${projectID}`, (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({
        create_status: false,
        projectID: projectID,
      });
    } else {
      if (existsSync(`src/history/${project_id}.json`)) {
        unlinkSync(`src/history/${project_id}.json`);
      }
      console.log(TAG_NAMES);
      mkdirSync(`src/history/${projectID}/href`)
      mkdirSync(`src/history/${projectID}/src`);
      TAG_NAMES.forEach((names) => {
        const htmlTagAndAttr = names.split("|");
        createDirectory(htmlTagAndAttr[1], htmlTagAndAttr[0]);
      });

      if (existsSync(`src/history/${project_id}/href`)) {
        writeFileSync(
          `src/history/${projectID}/main.json`,
          JSON.stringify({
            color,
            projectID,
            project_id,
            project_name,
            status: is_started ? status : "failed",
            is_started,
          })
        );
      }
      res.status(200).send({
        create_status: true,
        projectID: projectID,
      });
    }
  });
});

getLinkRouter.get("/send-link", (req, res) => {
  const { project_id, is_started } = req.query;

  try {
    const main = readFileSync(`src/history/${project_id}/main.json`, "utf-8");
    // console.log();
    if (main) {
      res.status(200).send(JSON.parse(main));
    } else {
      res.status(200).send({
        new_links: 0,
        total: 0,
        
        project_id,
        project_name: "No Project",
        status: "failed",
        is_started
      });
    }
  } catch (err) {
    res.status(200).send({
      new_links: 0,
      total: 0,
      project_id,
      project_name: "No Project",
      status: "failed",
      is_started
    });
  }
});

getLinkRouter.get("/get-crawled-link-data", async (req, res) => {
  try {
    const {
      project_id,
      filter_tab,
      page = 1,
      limit = 10,
      search_input = "",
    } = req.query;
    // var fs = require("fs");

    // Recursive function to get files
    function getFiles(dir, files = []) {
      // Get an array of all files and directories in the passed directory using fs.readdirSync
      const fileList = readdirSync(dir);
      // Create the full path of the file/directory by concatenating the passed directory and file/directory name
      for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (statSync(name).isDirectory()) {
          // If it is a directory, recursively call the getFiles function with the directory path and the files array
          getFiles(name, files);
        } else {
          // If it is a file, push the full path to the files array
          files.push(JSON.parse(readFileSync(name)));
        }
      }
      return files;
    }

    const originURL = JSON.parse(
      readFileSync(`src/history/${project_id}/main.json`)
    ).project_name;

    let file_data = [
      ...getFiles(`src/history/${project_id}/href`),
      ...getFiles(`src/history/${project_id}/src`),
    ];
    // console.log(file_data.length);

    if (file_data.length != 0) {
      if (JSON.parse(filter_tab).length != 0) {
        if (JSON.parse(filter_tab).includes("Internal Links")) {
          file_data = file_data?.filter(
            (l) =>
              isValidUrl(l.url) &&
              new URL(l.url).hostname.includes(new URL(originURL).hostname)
          );
        }
        if (JSON.parse(filter_tab).includes("External Links")) {
          file_data = file_data?.filter(
            (l) =>
              !(
                isValidUrl(l.url) &&
                new URL(l.url).hostname.includes(new URL(originURL).hostname)
              )
          );
        }

        if (JSON.parse(filter_tab).includes("HTML")) {
          file_data = file_data?.filter(
            (l) => l.content_type && l.content_type?.includes("text/html")
          );
        }
        if (JSON.parse(filter_tab).includes("CSS")) {
          file_data = file_data?.filter(
            (l) => l.content_type && l.content_type?.includes("text/css")
          );
        }
        if (JSON.parse(filter_tab).includes("JavaScript")) {
          file_data = file_data?.filter(
            (l) =>
              l.content_type &&
              (l.content_type?.includes("javascript") ||
                l.content_type?.includes("js"))
          );
        }
        if (JSON.parse(filter_tab).includes("Image")) {
          file_data = file_data?.filter(
            (l) => l.content_type && l.content_type?.includes("image")
          );
        }

        if (search_input != "") {
          file_data = file_data.filter((l) => l.url?.includes(search_input));
        }
      }
    }
    // console.log(search_input);
    if (file_data.length != 0) {
      res.status(200).send({
        total: file_data.length,
        data: paginate_array(file_data, limit, page),
        status: true,
      });
    } else {
      res.status(400).send({
        err: "ERROR",
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: "ERROR: " + err,
      status: false,
    });
  }
});

getLinkRouter.get("/project", async (req, res) => {
  try {
    // console.log("getting");
    const { file_id } = req.query;
    const { allSrcLinks, allHrefLinks, originURL, crawlStatus } =
      readFileHistory(`${file_id}`);

    if (file_id && allSrcLinks && allHrefLinks) {
      res.status(200).send({
        project_id: file_id,
        project_name: originURL,
        status: crawlStatus,
        color: "white",
        total: allSrcLinks.length,
      });
    }
  } catch (err) {
    res.status(200).send({
      err: "ERROR: " + err,
      status: false,
    });
  }
});

module.exports = { getLinkRouter };
