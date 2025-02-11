const WebRanger = require("./src/WebRanger");
const WebScrapeHandler = require("./src/WebScrapeHandler");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

//test key will get deleted soon: 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
client.providePrompt(
  "get the top ten traders on https://kolscan.io/account/73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B provide solana wallet address profits in solana and usd as well"
);
// test_run();
// function test_run()
//   console.log("Welcome to webranger");
//   readline.question("Enter Prompt: ", (prompt) => {
//     client.providePrompt(prompt);

//     readline.close();
//   });
// }
//"Get me the top 10 traders from the leaderboard also get there solana wallet address from https://kolscan.io/leaderboard"
