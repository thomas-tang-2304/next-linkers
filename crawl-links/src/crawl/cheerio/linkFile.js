const { writeFileSync } = require("fs");
const { uniqueArray } = require("../func/uniqueArray");
const writeLinkFile = (link, file_id, originUrl, folder) => {
  // console.log(link.from);
  let fileName = `src/history/${file_id}/${folder}/${link.tag}/${link.id}.json`;
  try {
    writeFileSync(
      fileName,
      JSON.stringify({
        origin: originUrl,
        // from: uniqueArray(link.from),
        ...link,
      }),
      "utf-8"
    );
    // console.log("Write operation completed successfully.");
  } catch (error) {
    // console.error("Error writing file:", error);
  }
};

module.exports = { writeLinkFile };
