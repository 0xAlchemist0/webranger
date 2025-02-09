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
      throw Error("Rate limit possibly reached");
    } else {
      console.log("User is valid proceed with action!");

      await this.handlePrompt(prompt);
    }
  }

  async handlePrompt(prompt) {
    const URL_Extrcted = await this.AIClient.provideGeminiPrompt(
      promptHelper.extractURLPrompt(prompt)
    );
    this.webscrapingClient.setURL(URL_Extrcted);
    //before we analyze the markdown we have to find a way to get all elements and get all elements
    const initialHTMLContent = await this.webscrapingClient.getHTMLContent(
      URL_Extrcted
    );
    const websiteRoutes = await this.webscrapingClient.extractHrefs(
      initialHTMLContent,
      URL_Extrcted
    );
    const baseURL = this.webscrapingClient.getbaseURL(URL_Extrcted);
    console.log("base URL: ", baseURL);

    const pageContents = await this.webscrapingClient.navigatePages(
      baseURL,
      websiteRoutes
    );
    //uncomment below when done adding getting other page route contents
    // const markdown = await this.webscrapingClient.convertToMarkdown();
    // await this.analyzeMarkdown(prompt, markdown);
  }

  async analyzeMarkdown(prompt, markdown) {
    console.log(markdown);
    const checkPromptFufilled = await this.AIClient.provideGeminiPrompt(
      promptHelper.validateMarkdownPrompt(prompt, markdown)
    );
    const isPromptFufilled = parsers.parseBoolean(checkPromptFufilled);
    if (isPromptFufilled) {
      const finalizedAnswer = await this.AIClient.provideGeminiPrompt(
        promptHelper.convertToJSONPrompt(prompt, markdown)
      );
      finalizedAnswer.replace("```json", "").replace("```", "").trim();
      console.log(finalizedAnswer);
    } else this.webscrapingClient.navigatePages();
  }
}

module.exports = WebRanger;
