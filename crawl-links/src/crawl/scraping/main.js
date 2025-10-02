import { parseFromString } from "dom-parser";
import { scrap } from '../ppt/ppt.js';
// import { color } from ("../func/coloringLogger");
import { uniqueArray } from "../func/uniqueArray.js";
import { writeFileSync, existsSync, readFileSync, readdirSync } from "fs";
import { jsonToHtmlList } from "../func/jsonToHtml.js";
import { getFormattedDate } from "../func/dating.js";
import { writeLinkFile } from "./linkFile.js";
import { measureTime } from "../func/measure.js";
import puppeteer from "puppeteer-core";

import config from "../../../config.json" with {type: 'json'};

import md5 from "md5";
import mime from "mime-types";


import {
  mapParentIndex,
  checkCrawlabledLinks,
  filterOriginStatics,
} from "./utils.js";

// Function to fetch and parse HTML

async function fetchAndParseHTML(browser, url, projectUid, originUrl) {
  // const indexOfCrawledUrl = queue.href_links.findIndex((o) => o.url == url);
  try {
   
    const resJson = await scrap(browser, url);
    const content_type = resJson?.headers?.get("Content-Type") ?? "";
    const response =  resJson; // Replace fetch with axios.get

    return response ? { url, html: parseFromString(response) } : null;
  } catch (error) {
    console.error("Error fetching URL:", url);
    console.error(error.message);

     writeLinkFile(
        { 
          url: url,
          id: md5(`a-${url}`),
          in_this_link: {
            href_links: [],
            src_links: [],
          }, 
          crawl_status: "failed",
          content_type:"unknown",
          tag: "a"
        },
        projectUid,
        originUrl,
        "href"
      );
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
    config.TAG_NAMES.map((str) => {
      const htmlTagAndAttr = str.split("|");
      return processElements($, htmlTagAndAttr[0], htmlTagAndAttr[1], origin);
    })
  ).then((res) => {
    const result = [];
    config.TAG_NAMES.forEach((str, index) => {
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
async function crawlWebsite(startUrl, projectUid, color = "white", status) {
  const pageEachScrapeWave = 10;
  const originUrl = startUrl.includes("http")
    ? startUrl
    : new URL(`https://${startUrl}`).href;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\/Program Files\/Google\/Chrome\/Application\/chrome.exe",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-gpu',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list'
    ]
  });

  console.log("origin: ", originUrl);

  let CRAWLABLE_LINKS = [
    startUrl
  ];


  let lastLength = 0;

  const overview_features = {
    a: 0,
    link: 0,
    img: 0,
    others: 0,
  };
  if (existsSync(`src/history/${projectUid}`)) {
    if( status != "continue"){
      writeFileSync(
        `src/history/${projectUid}/main.json`,
        JSON.stringify({
          all_links: {
            total: 0,
          },
          crawlable_links: {
            new_links: 0,
            total: 0,
            last_length: 0,
          },
          avgSpeed: 1,
          overview_features,
          project_id: projectUid,
          project_name: originUrl,
          is_started: true,
          status: "crawling",
          color,
        }),
        "utf-8"
      );
    } else {
      CRAWLABLE_LINKS =  uniqueArray(Array.from(readdirSync(`src/history/${projectUid}/href/a`)).filter((l) =>
          checkCrawlabledLinks(JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url, originUrl, JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).tag) && JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).crawl_status != "successfully"
      ).slice(0, pageEachScrapeWave).map((l) => JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url));
    }
  }
  
  const UNIQUE_CRAWLABLE_LINKS = uniqueArray(Array.from(readdirSync(`src/history/${projectUid}/href/a`).filter((l) =>
            checkCrawlabledLinks(JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url, originUrl, JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).tag)
            )));
  let temp = [];
  while (CRAWLABLE_LINKS.length > 0) {

    if (existsSync(`src/history/${projectUid}`)) {
      
      const url = CRAWLABLE_LINKS.shift();
      
      temp.push(fetchAndParseHTML(browser, url, projectUid, originUrl));
      let avgSpeed_old = JSON.parse(
          readFileSync(`src/history/${projectUid}/main.json`, "utf-8")
        ).avgSpeed;
      if (temp.length == pageEachScrapeWave ||  CRAWLABLE_LINKS.length  == 0) {
        let dataLength
        const startTime = new Date();
        
        await Promise.all(temp).then(async(fetchData) => {
          dataLength = fetchData.length
          for (let index = 0; index < dataLength; index++) {
            const eachData = fetchData[index];
            if (eachData) {
              try {
                
                const links = await extractLinks(eachData.html, originUrl);
                uniqueArray(links.href_links).map((link, id) => {
                  
                  if (!existsSync(`src/history/${projectUid}/${link?.attr}/${link?.tag}/${md5(`${link.tag}-${link.url}`)}.json`)){
                    
                    if (checkCrawlabledLinks(link?.url, originUrl, link?.tag)) {
                      writeLinkFile(
                        { url: link.url, 
                          crawl_status: null,
                          id: md5(`${link.tag}-${link.url}`),
                          tag: link.tag,
                          },
                        projectUid,
                        originUrl,
                        "href"
                      );
                    } else {
                      writeLinkFile(
                        { 
                          url: link.url, 
                          crawl_status: "successfully",
                          content_type: mime.lookup(link.url) || "unknown",
                          id: md5(`${link.tag}-${link.url}`),
                          tag: link.tag, 
                        },
                        projectUid,
                        originUrl,
                        "href"
                      );
                    }
                  }
                  return link;
                }); 

                uniqueArray(links.src_links).map((link, id) => {
                    if (!existsSync(`src/history/${projectUid}/${link?.attr}/${link?.tag}/${md5(`${link.tag}-${link.url}`)}.json`)){
                    writeLinkFile(
                      {
                        url: link.url,
                        crawl_status: "successfully",
                        content_type: mime.lookup(link.url) || "unknown",
                        id: md5(`${link.tag}-${link.url}`),
                        tag: link.tag,
                      },
                      projectUid,
                      originUrl,
                      "src"
                    );}
                  return link;
                });
                writeLinkFile(
                  { 
                    url: eachData.url,
                    id: md5(`a-${eachData.url}`),
                    in_this_link: {
                      href_links: uniqueArray(
                        links.href_links.map((l) => md5(`${l.tag}-${l.url}`))
                      ),
                      src_links: uniqueArray(
                        links.src_links.map((l) => md5(`${l.tag}-${l.url}`))
                      ),
                    }, 
                    crawl_status: "successfully",
                    content_type: mime.lookup(eachData.url) || "unknown",
                    tag: "a"
                  },
                  projectUid,
                  originUrl,
                  "href"
                );
              } catch(err) {
                writeLinkFile(
                  { 
                    url: eachData.url,
                    id: md5(`a-${eachData.url}`),
                    in_this_link: {
                      href_links: [],
                      src_links: [],
                    }, 
                    crawl_status: "failed",
                    content_type:"unknown",
                    tag: "a"
                  },
                  projectUid,
                  originUrl,
                  "href"
                );

              }

              
            }
          }
        })
        
        temp = [];
        
       
        const endTime = new Date();
        const finished_s = (endTime - startTime) / 1000;
        const avg =  (dataLength)/(finished_s )
                    
                
        console.log(
          "thời gian thực thi",
          avg ,
          "links/s"
        );
        avgSpeed_old = avg;

        const crawled_length = uniqueArray(Array.from(readdirSync(`src/history/${projectUid}/href/a`)).filter((l) =>
              checkCrawlabledLinks(JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url, originUrl, JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).tag) && JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).crawl_status != "successfully"
          )).length

        if (!existsSync(`src/history/${projectUid}/crawl_speed.json`))
        {
          const speed_data = {
            amount: crawled_length,
            speed: avg
          }
          writeFileSync(
            `src/history/${projectUid}/crawl_speed.json`,
            JSON.stringify([speed_data])
          );
        } else {
          const avg_array = JSON.parse(readFileSync(`src/history/${projectUid}/crawl_speed.json`));
          const speed_data = {
            amount: crawled_length,
            speed: avg
          }
          avg_array.push(speed_data)
          writeFileSync(
            `src/history/${projectUid}/crawl_speed.json`,
            JSON.stringify(avg_array)
          );
        }

        if (JSON.parse(readFileSync(`src/history/${projectUid}/main.json`)).status == "stop") {
          CRAWLABLE_LINKS = [];
          break;
        } else {

          CRAWLABLE_LINKS = uniqueArray(Array.from(readdirSync(`src/history/${projectUid}/href/a`)).filter((l) =>
              checkCrawlabledLinks(JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url, originUrl, JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).tag) && JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).crawl_status != "successfully"
          ).slice(0, pageEachScrapeWave).map((l) => JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l}`)).url));
        }
        await delay(0);
      }

      const allLinks = [];
      uniqueArray(
        config.TAG_NAMES.map((str) => {
          const htmlTagAndAttr = str.split("|");
          try {
    
            const readData = readdirSync(
              `src/history/${projectUid}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}`
            ).map((l) => {
              return JSON.parse(
                readFileSync(
                  `src/history/${projectUid}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}/${l}`
                )
              );
            })
            allLinks.push(
              ...readData
            );
          } catch(err) {
            console.log(err);
          }
        })
      );
  
      overview_features["a"] = allLinks.filter((l) => l?.tag == "a").length;
      overview_features["link"] = allLinks.filter((l) => l?.tag == "link").length;
  
      overview_features["img"] = allLinks.filter((l) => l?.tag == "img").length;
      overview_features["others"] = allLinks.filter(
        (l) => l?.tag != "img" && l?.tag != "link" && l?.tag != "a"
      ).length;

      const links_come_in = allLinks.filter((l) =>
              checkCrawlabledLinks(l.url, originUrl, l?.tag)
            ).length - UNIQUE_CRAWLABLE_LINKS.length;
      writeFileSync(
        `src/history/${projectUid}/main.json`,
        JSON.stringify({
          all_links: {
            total: allLinks.length,
          },
          crawlable_links: {
            new_links: allLinks.filter((l) =>
              checkCrawlabledLinks(l.url, originUrl, l?.tag) && JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l?.id}.json`)).crawl_status == "successfully"
            ).length,
            total: allLinks.filter((l) =>
              checkCrawlabledLinks(l.url, originUrl, l?.tag)
            ).length,
            last_length: links_come_in
            
          },
          avgSpeed: avgSpeed_old,
          overview_features,
        
          project_id: projectUid,
          project_name: originUrl,
          status: "crawling",
          color,
        })
      );

      lastLength = 0;
      
      await delay(0);
    }
   
  }
  
  const allLinks = [];
  uniqueArray(
    config.TAG_NAMES.map((str) => {
      const htmlTagAndAttr = str.split("|");
      try {

        const readData = readdirSync(
          `src/history/${projectUid}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}`
        ).map((l) => {
          return JSON.parse(
            readFileSync(
              `src/history/${projectUid}/${htmlTagAndAttr[1]}/${htmlTagAndAttr[0]}/${l}`
            )
          );
        })
        allLinks.push(
          ...readData
        );
      } catch(err) {
        console.log(err);
      }
    })
  );
  overview_features["a"] = allLinks.filter((l) => l?.tag == "a").length;
  overview_features["link"] = allLinks.filter((l) => l?.tag == "link").length;

  overview_features["img"] = allLinks.filter((l) => l?.tag == "img").length;
  overview_features["others"] = allLinks.filter(
    (l) => l?.tag != "img" && l?.tag != "link" && l?.tag != "a"
  ).length;
  const current_status= JSON.parse(readFileSync(`src/history/${projectUid}/main.json`)).status;
  writeFileSync(
    `src/history/${projectUid}/main.json`,
    JSON.stringify({
      all_links: {
        total: allLinks.length,
      },
      crawlable_links: {
        new_links: allLinks.filter((l) =>
          checkCrawlabledLinks(l.url, originUrl, l?.tag) && JSON.parse(readFileSync(`src/history/${projectUid}/href/a/${l?.id}.json`)).crawl_status == "successfully"
        ).length,
        total: allLinks.filter((l) =>
          checkCrawlabledLinks(l.url, originUrl, l?.tag)
        ).length,
      },
      overview_features,
      project_id: projectUid,
      project_name: originUrl,
      // elapsed_time,
      status: current_status == "stop" ? "stop" : "finished",
      color,
    })
  );

  if (current_status){ await browser.close();}
}

export { crawlWebsite };
