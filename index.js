const WebRanger = require("./src/WebRanger");
const WebScrapeHandler = require("./src/WebScrapeHandler");
//intiializes the class
const client = new WebRanger(
  "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",
  "google/gemini-2.0-flash-thinking-exp:free"
);

const webscraper_client = new WebScrapeHandler(
  "https://kolscan.io/",
  "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",
  "google/gemini-2.0-flash-thinking-exp:free"
);
// test();
async function test() {
  console.log();
  await webscraper_client.convertToMarkdown();
  webscraper_client.validateInformation();
}

//the call to prompt the ai to webscrape a website
client.providePrompt(
  "Get me the last 10 influencer transactions from here https://kolscan.io/"
);

//test key will get deleted soon: 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
