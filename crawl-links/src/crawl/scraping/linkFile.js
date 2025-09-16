const { writeFileSync } = require("fs");
const writeLinkFile = (link, file_id, originUrl, folder) => {
  let fileName = `src/history/${file_id}/${folder}/${link.tag}/${link.id}.json`;
  try {
    writeFileSync(
      fileName,
      JSON.stringify({
        origin: originUrl,
        ...link,
      }),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

module.exports = { writeLinkFile };
