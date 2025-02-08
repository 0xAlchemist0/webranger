const AIHandler = require("./APIHandler");
const promptHelper = require("./helpers/prompt-helper");
const WebScrapeHandler = require("./WebScrapeHandler");
const parsers = require("./helpers/parsers");
class WebRanger {
  AIClient;
  webscrapingClient;
  constructor(api_key) {
    this.api_key = api_key;
    this.AIClient = new AIHandler(this.api_key);
    this.webscrapingClient = new WebScrapeHandler(this.api_key);
  }

  verifyLLMParams() {
    return this.AIClient.verifyModel();
  }

  async providePrompt(prompt) {
    const isVerified = await this.AIClient.verifyModel();
    if (!isVerified) {
      throw Error(
        "The model you have initializd with is invalid please try again!"
      );
    } else {
      console.log("User is valid proceed with action!");
      await this.handlePrompt(prompt);
    }
  }

  async handlePrompt(prompt) {
    const URL_Extrcted = await this.AIClient.callAI(
      promptHelper.extractURLPrompt(prompt)
    );
    this.webscrapingClient.setURL(URL_Extrcted);
    const markdown = await this.webscrapingClient.convertToMarkdown();
    console.log("URL: ", markdown);
    await this.analyzeMarkdown(prompt, markdown);
  }

  async analyzeMarkdown(propmpt, markdown) {
    const isPromptFufilled = await this.AIClient.callAI(
      promptHelper.validateMarkdownPrompt(propmpt, markdown)
    );
    const parsedBoolean = parsers.parseBoolean(isPromptFufilled);
    console.log(parsedBoolean);
  }
}

module.exports = WebRanger;
