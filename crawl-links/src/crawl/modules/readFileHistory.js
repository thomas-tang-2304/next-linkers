const { readFileSync } = require("fs");

const readFileHistory = (jsonFileUrl) => {
  try {
    const allLinks = readFileSync(`src/history/${jsonFileUrl}`, "utf-8");

    const allHrefLinks = JSON.parse(allLinks)?.allLinks.href_links;
    const allSrcLinks = JSON.parse(allLinks)?.allLinks.src_links;
    const allLinksScrape = JSON.parse(allLinks)?.allLinks;
    const originURL = JSON.parse(allLinks)?.originUrl;
    const crawlStatus = JSON.parse(allLinks)?.originCrawlStatus;
    // const allSrcCrawled = JSON.parse(allLinks).src_links;
    return {
      allHrefLinks,
      allSrcLinks,
      allLinksScrape,
      originURL,
      crawlStatus,
    };
  } catch (error) {
    return "error";
  }
};

module.exports = { readFileHistory };
