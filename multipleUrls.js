const { promisify } = require("util");
const Apify = require("apify");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const readFile = promisify(fs.readFile);
const rimraf = require("rimraf");

Apify.main(async () => {
  const directory = "apify_storage";
  await fsPromises.rmdir(directory, {
    recursive: true,
  });
  // Create a RequestQueue
  const requestQueue = await Apify.openRequestQueue();
  // Define the starting URL
  // wants to add more request then uncomment link 8 and put you link
  // comment pseudoUrls if you want to add more request
  // await requestQueue.addRequest({ url: "https://angular.io/" });
  await requestQueue.addRequest({ url: "https://www.imdb.com" });

  // Function called for each URL
  const handlePageFunction = async ({ request, page }) => {
    // get all the titles
    const title = await page.title();
    // get the body content
    // const response = await Apify.utils.requestAsBrowser({ url: request.url });

    // const html = response.body;
    // const status = response.statusCode;
    // const contentType = response.headers["content-type"];

    // Save data to default dataset

    await Apify.pushData({
      url: request.url,
      title: title,
    });

    // Add all links from page to RequestQueue
    await Apify.utils.enqueueLinks({
      page,
      requestQueue,
      pseudoUrls: ["https://www.imdb.com/[.*]"],
    });
  };
  // Create a PuppeteerCrawler
  const crawler = new Apify.PuppeteerCrawler({
    requestQueue,
    launchContext: {
      launchOptions: {
        headless: true,
        // Other Puppeteer options
      },
    },
    handlePageFunction,
    maxRequestsPerCrawl: 2,
    // if you want to scrap all links then remove this options
  });
  // Run the crawler
  await crawler.run();
  // getting all the files from apify_storage/datasets/default

  const response = await listDir();
  const fileNames = [];
  response.forEach(async (row) => {
    fileNames.push(`./apify_storage/datasets/default/${row}`);
  });

  //calling function to read the file
  let loadedData = await readFiles(fileNames);

  const jsonData = loadedData.toString("utf8");
  let write = await writeCSV(jsonData);

  await fsPromises.rmdir(directory, {
    recursive: true,
  });
  console.log("finish", write);
});

async function readFiles(fileNames) {
  try {
    const arrayWithFilesContent = await Promise.all(
      fileNames.map((name) => readFile(name))
    );
    return arrayWithFilesContent;
  } catch (err) {
    console.log(err);
  }
}

async function listDir() {
  try {
    return fsPromises.readdir("./apify_storage/datasets/default");
  } catch (err) {
    console.error("Error occured while reading directory!", err);
  }
}

async function writeCSV(data) {
  try {
    await fsPromises.writeFile("movies.csv", data);
  } catch (err) {
    console.error(err);
  }
}
