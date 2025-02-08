const axios = require("axios");
const AIHandler = require("./APIHandler");
const https = require("https");
const promptHelper = require("./helpers/prompt-helper");

class WebScrapeHandler {
  jina_endpoint = "https://r.jina.ai/";
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
  constructor(api_key) {
    this.api_key = api_key;
    this.AIClient = new AIHandler(this.api_key);
    this.AIClient.verifyModel();
  }

  setURL(URL) {
    this.target_URL = URL;
  }

  async convertToMarkdown() {
    this.options.path = `${this.jina_endpoint}/${this.target_URL}`;
    console.log("target", this.target_URL);
    //promise on resolve returns the data we need bst way to perform this action
    //aios a bit tricky
    try {
      const response = await axios.get(this.options.path, {
        headers: this.options.headers,
      });
      this.markdown_content = response.data; // Store the fetched content
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error fetching markdown:", error);
      throw error; // Ensure errors are properly propagated
    }

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
