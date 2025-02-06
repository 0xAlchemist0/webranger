const axios = require("axios");
const AIHandler = require("./APIHandler");
const https = require("https");
const promptHelper = require("./helpers/prompt-helper");

class WebScrapeHandler {
  jina_endpoint = "https://r.jina.ai//";
  proxy = "http://31.220.15.234:80";
  options = {
    hostname: "r.jina.ai",
    path: "",
    headers: {
      Authorization:
        "Bearer jina_d6916363ce474536919ecf37479e4fc6A5iHd-OcVy_KkC2gLAz7wYjO0ozh",
    },
  };
  markdown_content = "";
  AIClient;
  constructor(target_URL, api_key, model) {
    this.target_URL = target_URL;
    this.api_key = api_key;
    this.model = model;
    this.AIClient = new AIHandler(this.api_key, this.model);
    this.AIClient.verifyModel();
  }

  async convertToMarkdown() {
    this.options.path = `/${this.target_URL}`;
    //promise on resolve returns the data we need bst way to perform this action
    //aios a bit tricky
    return new Promise((resolve, reject) => {
      https
        .get(this.options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            this.markdown_content = data;

            resolve(data); // Return data when request is done
          });
        })
        .on("error", (err) => {
          reject(err); // Return error if request fails
        });
    });

    // markdown alows us to process elements easier with less tokens being used
    // the ai can decide whats important and whats notj
  }
  //here we validate if the markdown provided from the page fufills the user promopt
  //if it does not we ove on to another function to try to get the markdown of other paths on the website
  async validateInformation() {
    console.log(this.markdown_content);
    //this should return true or false if markdown has enough data to fufill a users prompt
    const isPromptFufilled = await this.AIClient.callAI(
      promptHelper.validateMarkdown +
        "Get me the top ten traders from https://kolscan.io/ in json format"
    );
  }
}

module.exports = WebScrapeHandler;
