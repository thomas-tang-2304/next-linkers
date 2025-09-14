const { checkCrawlabledLinks } = require("./crawl/cheerio/utils");
const { readFileHistory } = require("./crawl/modules/readFileHistory");
const {
  readdirSync,
  existsSync,
  mkdir,
  rmdir,
  readFileSync,
  writeFile,
  writeFileSync,
  unlinkSync,
} = require("fs");
const createRealtime = (io) => {
  io.on("connection", (socket) => {
    if (socket.recovered) {
      console.log("A user reconnected. ID: ", socket.id);
    } else {
      console.log("A user connected. ID: ", socket.id);
    }

    socket.on("chat message", (msg, uid) => {
      // Broadcast the message to all connected clients.
      io.to(uid).emit("chat message", msg, uid);
    });

    // RUN crawling
    socket.on("crawl", (uid) => {
      // Broadcast the message to all connected clients.
      io.to(uid).emit("run");
    });
    // STOP crawling
    socket?.on("stop crawling", (uid) => {
      io.to(uid).emit("stop");
    });

    socket.on("send links", (uid, proj_id) => {
      // Broadcast the message to all connected clients.
      try {
        const main = readFileSync(`src/history/${proj_id}/main.json`, "utf-8");
        // console.log();
        if (main) {
          io.to(uid).emit("send links", JSON.parse(main));
        } else {
          io.to(uid).emit("send links", {
            new_links: 0,
            total: 0,
            proj_id,
            project_name: "No Project",
            status: "failed",
          });
        }
      } catch (err) {
        io.to(uid).emit("send links", {
          new_links: 0,
          total: 0,
          proj_id,
          project_name: "No Project",
          status: "failed",
        });
      }
    });

    socket?.on("filter links", (label, proj_id) => {
      const file_data = readFileHistory(`${proj_id}`);
      if (file_data != "error") {
        const allLinks = {
          href_links: file_data?.allLinksScrape.href_links,
          src_links: file_data?.allLinksScrape.src_links,
        };
        let newHref = allLinks?.href_links;
        let newSrc = allLinks?.src_links;

        if (label.includes("Internal Links")) {
          newHref = newHref?.filter((l) =>
            l.url?.startsWith(file_data?.originURL)
          );

          newSrc = newSrc?.filter((l) =>
            l.url?.startsWith(file_data?.originURL)
          );
        }
        if (label.includes("External Links")) {
          newHref = newHref?.filter(
            (l) => !l.url?.startsWith(file_data?.originURL)
          );
          newSrc = newSrc?.filter(
            (l) => !l.url?.startsWith(file_data?.originURL)
          );
        }

        if (label.includes("HTML")) {
          newHref = newHref?.filter((l) =>
            l.content_type?.includes("text/html")
          );
          newSrc = newSrc?.filter((l) => l.content_type?.includes("text/html"));
        }
        if (label.includes("CSS")) {
          newHref = newHref?.filter((l) =>
            l.content_type?.includes("text/css")
          );
          newSrc = newSrc?.filter((l) => l.content_type?.includes("text/css"));
        }
        if (label.includes("JavaScript")) {
          newHref = newHref?.filter((l) =>
            l.content_type?.includes("application/x-javascript")
          );
          newSrc = newSrc?.filter((l) =>
            l.content_type?.includes("application/x-javascript")
          );
        }
        socket?.emit("filter links", {
          href_links: newHref,
          src_links: newSrc,
        });
      }
    });
    socket.on("create file", (socket_id, proj) => {
      if (existsSync(`src/history/${proj.projectID}`)) {
        unlinkSync(`src/history/${proj.projectID}`);
      }
      mkdir(`src/history/${proj.projectID}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          io.to(socket_id).emit("create file message", {
            create_status: false,
            projectID: proj.projectID,
          });
        } else {
          mkdir(`src/history/${proj.projectID}/href`, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("write folder href successfully");
              writeFileSync(
                `src/history/${proj.projectID}/main.json`,
                JSON.stringify(proj)
              );
              console.log("write href main successfully");
            }
          });

          mkdir(`src/history/${proj.projectID}/src`, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("write folder src successfully");
            }
          });
          io.to(socket_id).emit("create file message", {
            create_status: true,
            projectID: proj.projectID,
          });
        }
      });
    });

    socket.on("delete file", async (proj_id, uid) => {
      rmdir(`src/history/${proj_id}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          socket.to(uid).emit("delete file successfully", proj_id);
        }
      });
    });

    socket.on("disconnect", async () => {
      console.log("A user disconnected.");
    });
  });
  // console.log(io);
};

module.exports = { createRealtime };
