const { readFileSync } = require("fs-extra");
const { uniqueArray, uniqueObjectsArray } = require("../func/uniqueArray");
const { isDataURI, isValidUrl } = require("../func/validUrl");


const checkCrawlabledLinks = (thisLink, originUrl, tag) =>
  tag == "a" &&
  isValidUrl(thisLink) &&
  (new URL(thisLink).hostname == `www.${new URL(originUrl).hostname}` ||
    new URL(thisLink).hostname == `${new URL(originUrl).hostname}`) &&
  !thisLink.includes("#") &&
  !thisLink.includes("?") &&
  !/\.(png|jpg|webp|avif|jpeg|gif|tiff|svg|pdf|css)$/i.test(thisLink);

const mapParentIndex = (objArray, queue, href_links) => {
  const parentLinkIndex = (objArray2, href_id) =>
    objArray2.findIndex((obj) => obj.id === href_id);

  return objArray.map((queueLink) => ({
    url: queueLink,
    ...queue[queueLink],

    from: queue[queueLink]?.from,
  }));
};

const mapParentLink = (indexArray, project_id, refArray) => {
  return indexArray?.map((id) =>
    id === "root"
      ? JSON.parse(readFileSync(`src/history/${project_id}/main.json`, "utf-8"))
          .project_name
      : refArray[refArray.findIndex((ref) => ref.id === id)]?.url
  );
};

const filterOriginStatics = (jsonArray) => ({
  origin: jsonArray
    .map((link) =>
      link.url.toString().split("/")[2]
        ? isDataURI(link.url)
          ? link.url
          : link.url.toString().split("/")[2]
        : link.url
    )
    .reduce((result, element) => {
      result[element] = jsonArray
        .map((link) =>
          link.url.toString().split("/")[2]
            ? isDataURI(link.url)
              ? link.url
              : link.url.toString().split("/")[2]
            : link.url
        )
        .filter((l) => l == element).length;
      return result;
    }, {}),

  total: jsonArray.length,
});

module.exports = {
  mapParentIndex,
  mapParentLink,
  checkCrawlabledLinks,
  filterOriginStatics,
};
