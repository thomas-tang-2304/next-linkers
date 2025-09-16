import puppeteer from 'puppeteer-core';
import { setTimeout } from 'node:timers/promises';


// const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
// });
export const scrap = async (browser, url) => {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.setExtraHTTPHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    await page.on("request", (request) => {
        if (request.resourceType() === "image" || request.resourceType() === 'stylesheet' || request.resourceType() === 'font') {
            request.abort();
        } else {
            request.continue();
        }
    });
    await Promise.all([
        page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 }),
        // page.waitForNetworkIdle({ idleTime: 5000 }),
      ]);
    await page.setViewport({
        width: 700,
        height: 400
    });

    await autoScroll(page);

   
    const pageSourceHTML = await page.content();

    await page.close();
    return (pageSourceHTML);
    
};
async function autoScroll(page){

    let prevHeight;
    while (true) {
      prevHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await setTimeout(2000);  // Wait for lazy-loaded content to appear
  
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === prevHeight) {
        break;
      }
    }
}