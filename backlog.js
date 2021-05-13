const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4469.0 Safari/537.36"
  );

  await page
    .browser()
    .version()
    .then(function (version) {
      console.log(`chrome version :  ${version}`);
    });
  try {
    await page.goto(url);
  } catch (error) {
    console.log(error);
  }

  const userAgent = await page.evaluate(() => navigator.userAgent);
  console.log(`user agent:  ${userAgent}`);

  const title = await page.title();
  console.log(`link title ${title}`);

  await browser.close();

  // console.log(await browser.userAgent());

  // const version = await page.browser().version();

  // console.log(`Browser launched in headless mode!`);
  // console.log(`Browser ${version}`);

  // const title = await page.title();
  // console.log(title);
  // await browser.close();

  // console.log(title);

  // const [e1] = await page.$x('//*[@id="what-is-angular"]');
  // const text = await e1.getProperty("textContent");
  // const result = await text.jsonValue();
  // console.log(result);

  // const [e2] = await page.$x(
  //   '//*[@id="guide-what-is-angular"]/aio-doc-viewer/div/div[2]/p[1]'
  // );
  // const para = await e2.getProperty("textContent");
  // const result1 = await para.jsonValue();
  // console.log(result1);

  // const [e3] = await page.$x(
  //   "/html/body/aio-shell/mat-sidenav-container/mat-sidenav/div/aio-nav-menu/aio-nav-item[2]/div/div/aio-nav-item[1]/div/a"
  // );
  // const sideButton = await e3.getProperty("href");
  // const resultsideButton = await sideButton.jsonValue();
  // console.log(resultsideButton);

  // let hrefs = await page.evaluate(() =>
  //   Array.from(document.querySelectorAll("a[href]"), (a) => a.href)
  // );

  // hrefs.unshift(title);
  // const fileName = `${title}.csv`;

  // fs.writeFile("files/link.csv", hrefs.join("\n"), "utf8", function (err) {
  //   if (err) {
  //     console.log(
  //       "Some error occured - file either not saved or corrupted file saved."
  //     );
  //   } else {
  //     console.log("It's saved!");
  //   }
  // });

  // browser.close();
}

function test(param) {
  setInterval(() => {
    try {
      scrapeWebsite(url);
    } catch (err) {
      console.log("err");
      console.log(err);
    }
  }, 2000);
}
const url = "your url";
// test(url);
scrapeWebsite(url);

// module.exports = { scrapeWebsite };
