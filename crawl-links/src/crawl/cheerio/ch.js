const { parseFromString } = require("dom-parser");
// const { color } = require("../func/coloringLogger");
const { uniqueArray } = require("../func/uniqueArray");
const { writeFileSync, existsSync, readFileSync, readdirSync } = require("fs");
const { jsonToHtmlList } = require("../func/jsonToHtml");
const { getFormattedDate } = require("../func/dating");
const { writeLinkFile } = require("./linkFile");
const { measureTime } = require("../../test");

const { TAG_NAMES } = require("../../../config.json");

const md5 = require("md5");
const mime = require("mime-types");

const {
  mapParentIndex,
  checkCrawlabledLinks,
  filterOriginStatics,
} = require("./utils");

// Function to fetch and parse HTML

async function fetchAndParseHTML(url, queue, proj_id, type, folder) {
  // const indexOfCrawledUrl = queue.href_links.findIndex((o) => o.url == url);
  try {
    const resJson = await fetch(url, {
      timeout: 1000,
    });
    const content_type = resJson.headers.get("Content-Type");
    const response = await resJson?.text(); // Replace fetch with axios.get

    queue[type][url].crawl_status = "successfully";
    queue[type][url].status_code = resJson?.status;
    queue[type][url].content_type = content_type;

    return response ? { url, html: parseFromString(response) } : null;
  } catch (error) {
    console.error("Error fetching URL:", url);
    console.error(error.message);

    if (queue[type].hasOwnProperty(url)) {
      queue[type][url].status_code = error?.cause?.status;
      queue[type][url].crawl_status = "failed";
    }
    return null;
  }
}

function processElements($, tagName, attributeName, origin) {
  const linksArray = [];
  return new Promise((resolve) => {
    const elements = $?.getElementsByTagName(tagName) ?? [];
    // console.log(elements);
    elements?.forEach((element) => {
      const attributeIndex = element?.attributes?.findIndex(
        (d) => d?.name === attributeName
      );
      const attributeValue = element?.attributes[attributeIndex]?.value;

      if (attributeValue) {
        const link =
          !attributeValue.startsWith("https://") &&
          !attributeValue.startsWith("http://")
            ? `${origin}/${attributeValue}`
                .replace(/\/+/g, "/")
                .replace(":/", "://")
            : attributeValue;

        linksArray.push(link);
      }
    });

    resolve(linksArray);
  });
}

// Function to extract links from a page
async function extractLinks($, origin) {
  const links = {
    href_links: [],
    src_links: [],
  };

  await Promise.all(
    TAG_NAMES.map((str) => {
      const htmlTagAndAttr = str.split("|");
      return processElements($, htmlTagAndAttr[0], htmlTagAndAttr[1], origin);
    })
  ).then((res) => {
    const result = [];
    TAG_NAMES.forEach((str, index) => {
      const htmlTagAndAttr = str.split("|");
      result.push(
        ...res[index].map((e) => ({
          url: e,
          tag: htmlTagAndAttr[0],
          attr: htmlTagAndAttr[1],
        }))
      );
    });
    // console.log(result);

    links.src_links.push(...result.filter((htaa) => htaa.attr == "src"));
    links.href_links.push(...result.filter((htaa) => htaa.attr == "href"));
  });
  // console.log(links);
  return links;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to crawl a website
async function crawlWebsite(startUrl, uid_socket, color = "white") {
  const originUrl = startUrl.includes("http")
    ? startUrl
    : new URL(`https://${startUrl}`).href;

  console.log("origin: ", originUrl);

  const visitedUrls = new Set();
  const queue = {
    href_links: {},
    src_links: {},
  };

  queue.href_links[startUrl] = { depth: 0, tag: "a", id: "root" };
  let CRAWLABLE_LINKS = [
    ...Object.keys(queue.href_links),
    ...Object.keys(queue.src_links),
  ];

  let i = 0;
  let lastLength = 0;

  const overview_features = {
    a: 0,
    link: 0,
    img: 0,
    others: 0,
  };
  let temp = [];
  if (existsSync(`src/history/${uid_socket}`)) {
    writeFileSync(
      `src/history/${uid_socket}/main.json`,
      JSON.stringify({
        all_links: {
          total: 0,
        },
        crawlable_links: {
          new_links: 0,
          total: 0,
        },
        avgSpeed: 1,
        overview_features,
        project_id: uid_socket,
        project_name: originUrl,
        status: "crawling",
        color,
      }),
      "utf-8"
    );
  }

  while (CRAWLABLE_LINKS.length > 0) {
    if (!existsSync(`src/history/${uid_socket}`)) {
      break;
    }
    const url = CRAWLABLE_LINKS.shift();

    let UNIQUE_CRAWLABLE_LINKS = uniqueArray([
      ...Object.keys(queue.href_links),
      ...Object.keys(queue.src_links),
    ]).filter((l) =>
      checkCrawlabledLinks(l, originUrl, queue.href_links[l]?.tag)
    );

    temp.push(fetchAndParseHTML(url, queue, uid_socket, "href_links", "href"));

    let avgSpeed_old = JSON.parse(
      readFileSync(`src/history/${uid_socket}/main.json`, "utf-8")
    ).avgSpeed;

    if (temp.length == 50 || i == 0 || i == UNIQUE_CRAWLABLE_LINKS.length - 1) {
      const avgSpeed = [];
      await Promise.all(temp).then((fetchData) => {
        fetchData.forEach(async (eachData, href_id) => {
          if (eachData) {
            const links = await extractLinks(eachData.html, originUrl);
            let quantity_of_crawled_link = 0;

            const finished_s = parseInt(
              measureTime(() => {
                uniqueArray(links.href_links).map((link, id) => {
                  if (!queue.href_links.hasOwnProperty(link.url)) {
                    if (checkCrawlabledLinks(link.url, originUrl, link.tag)) {
                      CRAWLABLE_LINKS.push(link.url);
                      queue.href_links[link.url] = {
                        id: md5(`${link.tag}-${link.url}`),
                        depth: (queue.href_links[eachData.url]?.depth ?? 0) + 1,
                        tag: link.tag,
                      };
                      // quantity_of_crawled_link++;
                    } else {
                      queue.href_links[link.url] = {
                        crawl_status: "successfully",
                        content_type: mime.lookup(link.url) || "unknown",
                        id: md5(`${link.tag}-${link.url}`),
                        depth: (queue.href_links[eachData.url]?.depth ?? 0) + 1,
                        tag: link.tag,
                      };
                    }
                    writeLinkFile(
                      { url: link.url, ...queue.href_links[link.url] },
                      uid_socket,
                      originUrl,
                      "href"
                    );
                  }

                  return link;
                });

                uniqueArray(links.src_links).map((link, id) => {
                  if (!queue.src_links.hasOwnProperty(link.url)) {
                    queue.src_links[link.url] = {
                      crawl_status: "successfully",
                      content_type: mime.lookup(link.url) || "unknown",
                      id: md5(`${link.tag}-${link.url}`),
                      depth: (queue.href_links[eachData.url]?.depth ?? 0) + 1,
                      tag: link.tag,
                    };

                    writeLinkFile(
                      {
                        url: link.url,
                        ...queue.src_links[link.url],
                      },
                      uid_socket,
                      originUrl,
                      "src"
                    );
                    // quantity_of_crawled_link++;
                  }

                  return link;
                });
                queue.href_links[eachData.url] = {
                  id: md5(`${eachData.tag}-${eachData.url}`),
                  in_this_link: {
                    href_links: uniqueArray(
                      links.href_links.map((l) => md5(`${l.tag}-${l.url}`))
                    ),
                    src_links: uniqueArray(
                      links.src_links.map((l) => md5(`${l.tag}-${l.url}`))
                    ),
                  },
                  ...queue.href_links[eachData.url],
                };

                writeLinkFile(
                  { url: eachData.url, ...queue.href_links[eachData.url] },
                  uid_socket,
                  originUrl,
                  "href"
                );
                quantity_of_crawled_link++;
                console.log(
                  "quantity_of_crawled_link",
                  quantity_of_crawled_link
                );
              })
            );
            avgSpeed.push(finished_s);
            console.log(
              "thời gian thực thi trung bình:",
              (avgSpeed.reduce((total, item) => total + item) +
                avgSpeed_old * UNIQUE_CRAWLABLE_LINKS.length) /
                (avgSpeed.length + UNIQUE_CRAWLABLE_LINKS.length),
              "links/s"
            );

            avgSpeed_old =
              (avgSpeed.reduce((total, item) => total + item) +
                avgSpeed_old * UNIQUE_CRAWLABLE_LINKS.length) /
              (avgSpeed.length + UNIQUE_CRAWLABLE_LINKS.length);
            console.log(avgSpeed);
          }
        });
      });

      lastLength = 0;
      temp = [];
      await delay(1000);
    }
    const allLinks = [];
    uniqueArray(
      TAG_NAMES.map((str, index) => {
        const htmlTagAndAttr = str.split("|");
        allLinks.push(
          ...readdirSync(
            `src/history/${uid_socket}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}`
          ).map((l) => {
            return JSON.parse(
              readFileSync(
                `src/history/${uid_socket}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}/${l}`
              )
            );
          })
        );
      })
    );

    overview_features["a"] = allLinks.filter((l) => l?.tag == "a").length;
    overview_features["link"] = allLinks.filter((l) => l?.tag == "link").length;

    overview_features["img"] = allLinks.filter((l) => l?.tag == "img").length;
    overview_features["others"] = allLinks.filter(
      (l) => l?.tag != "img" && l?.tag != "link" && l?.tag != "a"
    ).length;
    writeFileSync(
      `src/history/${uid_socket}/main.json`,
      JSON.stringify({
        all_links: {
          total: allLinks.length,
        },
        crawlable_links: {
          new_links: i + 1,
          total: allLinks.filter((l) =>
            checkCrawlabledLinks(l.url, originUrl, l?.tag)
          ).length,
        },
        avgSpeed: avgSpeed_old,
        overview_features,
        project_id: uid_socket,
        project_name: originUrl,
        status: "crawling",
        color,
      })
    );
    // if (i == 0 || i == UNIQUE_CRAWLABLE_LINKS.length - 1)
    await delay(0);
    i++;
  }
  const allLinks = [];
  uniqueArray(
    TAG_NAMES.map((str, index) => {
      const htmlTagAndAttr = str.split("|");
      allLinks.push(
        ...readdirSync(
          `src/history/${uid_socket}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}`
        ).map((l) => {
          return JSON.parse(
            readFileSync(
              `src/history/${uid_socket}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}/${l}`
            )
          );
        })
      );
    })
  );
  overview_features["a"] = allLinks.filter((l) => l?.tag == "a").length;
  overview_features["link"] = allLinks.filter((l) => l?.tag == "link").length;

  overview_features["img"] = allLinks.filter((l) => l?.tag == "img").length;
  overview_features["others"] = allLinks.filter(
    (l) => l?.tag != "img" && l?.tag != "link" && l?.tag != "a"
  ).length;

  writeFileSync(
    `src/history/${uid_socket}/main.json`,
    JSON.stringify({
      all_links: {
        total: allLinks.length,
      },
      crawlable_links: {
        new_links: allLinks.filter((l) =>
          checkCrawlabledLinks(l.url, originUrl, l?.tag)
        ).length,
        total: allLinks.filter((l) =>
          checkCrawlabledLinks(l.url, originUrl, l?.tag)
        ).length,
      },
      overview_features,
      project_id: uid_socket,
      project_name: originUrl,
      // elapsed_time,
      status: "finished",
      color,
    })
  );

  // console.log("finisheddddddddddddddd");

  const finishedHref = mapParentIndex(
    Object.keys(queue.href_links),
    queue?.href_links,
    queue?.href_links
  );

  const finishedSrc = mapParentIndex(
    Object.keys(queue.src_links),
    queue?.src_links,
    queue?.href_links
  );

  return jsonToHtmlList({
    completed_date: getFormattedDate(),
    // token,
    href: filterOriginStatics(finishedHref),
    src: filterOriginStatics(finishedSrc),
  });
}

module.exports = { crawlWebsite };
