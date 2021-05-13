const puppeteer = require("puppeteer");
const fs = require("fs");
const args = require("yargs").argv;

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

  let movies;
  if (args.search) {
    await page.type("#suggestion-search", args.search);
    await page.click(".nav-search__search-submit");
    await page.waitForSelector(".article");

    movies = await page.$$eval("td.result_text", (anchors) => {
      return anchors.map((anchor) => anchor.textContent.trim()).slice(0, 10);
    });
  }

  let hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]"), (a) => a.href)
  );
  let startsWithUrl;

  if (args.external_link == "yes") {
    startsWithUrl = hrefs;
  } else {
    startsWithUrl = hrefs.filter((href) => href.startsWith(url));
  }

  let scrappedData;
  console.log(movies);
  if (movies && startsWithUrl) {
    scrappedData = movies.concat(startsWithUrl);
  } else {
    scrappedData = startsWithUrl;
  }

  fs.writeFile(
    "files/link.csv",
    scrappedData.join("\n"),
    "utf8",
    function (err) {
      if (err) {
        console.log(
          "Some error occured - file either not saved or corrupted file saved."
        );
      } else {
        console.log("It's saved!");
      }
    }
  );
  await browser.close();
}

const url = "anyurl";
scrapeWebsite(url);
