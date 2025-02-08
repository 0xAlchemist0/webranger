const WebRanger = require("./src/WebRanger");
const WebScrapeHandler = require("./src/WebScrapeHandler");
//intiializes the class
const client = new WebRanger(
  "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"
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
  "Get me the last 10 influencer transactions from here https://kolscan.io/leaderboard"
);

//test key will get deleted soon: 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
