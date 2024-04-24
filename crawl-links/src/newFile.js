const { readFileSync, readdirSync } = require("fs");
const { app } = require("./server");

app.post("/find", async function (req, res) {
  const { target, project_id, tag } = req.body;
  // console.log("tag: ", tag);
  let link_attr;

  if (tag == "a" || tag == "link") {
    link_attr = "href";
  } else {
    link_attr = "src";
  }

  const retrieveFolder = `src/history/${project_id}/href`;
  const target_file_data = readdirSync(`${retrieveFolder}`).map((filename) => {
    return JSON.parse(readFileSync(`${retrieveFolder}/${filename}`, "utf-8"))
      ?.in_this_link.href_links;
  });
  // .filter((inThisLink) => {
  //   return inThisLink ?
  //   inThisLink?.includes(target): false
  // });
  // .filter(
  //   (filename) => {
  //     return JSON.parse(
  //       readFileSync(`${retrieveFolder}/${filename}`, "utf-8")
  //     ).in_this_link?.includes(target);
  //   }
  // );
  const result = {
    ...target_file_data,
    // from: uniqueArray(target_file_data.from).map((id) =>
    //   JSON.parse(
    //     readFileSync(`src/history/${project_id}/href/${id}.json`)
    //   )
    // ),
  };
  console.log(result);

  if (result) {
    res.status(200).send({
      data: result,
    });
  } else {
    res.status(400).send("No Target found");
  }
});
