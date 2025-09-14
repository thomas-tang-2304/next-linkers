const express = require("express");

const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require("socket.io");

const { configEnv } = require("./configEnv");
const { TAG_NAMES } = require("../config.json");

configEnv();

// Routers
const emailRouter = require("./routes/gmail/send_mail_router");
const { getLinkRouter } = require("./routes/getLinkData");
const { readFileHistory } = require("./crawl/modules/readFileHistory");
const { readFileSync, readdirSync } = require("fs");
const { uniqueArray } = require("./crawl/func/uniqueArray");
const { paginate_array } = require("./routes/funcs/pagination");

const app = express();

app.use(cors());

// createRealtime(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/email", emailRouter);
app.use("/links", getLinkRouter);

app.post("/find", async function (req, res) {
  const { target, project_id, tag, page = 1,
    limit = 10, } = req.body;
  // console.log("tag: ", tag);
  let link_attr = TAG_NAMES.filter((names) => names.split("|")[0] == tag)[0].split("|")[1];
 

  const retrieveFolder = `src/history/${project_id}/href/a`;
  const target_file_data = readdirSync(`${retrieveFolder}`).filter(
    (filename) => {
      const newData = JSON.parse(
        readFileSync(`${retrieveFolder}/${filename}`, "utf-8")
      );
      if (link_attr == "href") {
        return newData?.in_this_link?.href_links.includes(target);
      }
      if (link_attr == "src") {
        return newData?.in_this_link?.src_links.includes(target);
      }
    }
  );

  const result = {
    // ...target_file_data,
    target: JSON.parse(
      readFileSync(
        `src/history/${project_id}/${link_attr}/${tag}/${target}.json`
      )
    ).url,
    links_length: Object.values(target_file_data).map((filename) => {
      return JSON.parse(readFileSync(`${retrieveFolder}/${filename}`));
    }).length,
    from: paginate_array(Object.values(target_file_data).map((filename) => {
      return JSON.parse(readFileSync(`${retrieveFolder}/${filename}`));
    }), limit, page),
  };
  console.log(result.links_length);
  console.log(result.from.length);

  if (result) {
    res.status(200).send({
      data: result,
    });
  } else {
    res.status(400).send("No Target found");
  }
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Tạo worker cho mỗi nhân CPU
  for (let i = 0; i < 8; i++) {
    cluster.fork();
  }

  // Lắng nghe sự kiện exit của worker
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Tạo máy chủ HTTP cho mỗi worker

  app.listen(process.env.PORT + cluster.worker.id, () => {
    console.log(
      `Server listening on Port ${process.env.PORT + cluster.worker.id}`
    );
  });

  console.log(`Worker ${process.pid} started`);
}
