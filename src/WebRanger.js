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

      const answer = await this.handlePrompt(prompt);
      console.log(answer);
      return answer;
    }
  }

  async handlePrompt(prompt) {
    const URL_Extrcted = await this.AIClient.provideGeminiPrompt(
      promptHelper.extractURLPrompt(prompt)
    );
    this.webscrapingClient.setURL(URL_Extrcted);

    //////////////////////////
    //before we analyze the markdown we have to find a way to get all elements and get all elements
    const initialHTMLContent = await this.webscrapingClient.getHTMLContent(
      URL_Extrcted
    );

    const websiteRoutes = await this.webscrapingClient.extractHrefs(
      initialHTMLContent,
      URL_Extrcted
    );
    const baseURL = this.webscrapingClient.getbaseURL(URL_Extrcted);

    //gets markdown version of html content
    const markdown = await this.webscrapingClient.convertToMarkdown(
      initialHTMLContent
    );
    //analyzes if the initial content we got fufills the prompt
    const isPromptFufilled = await this.analyzeMarkdown(prompt, markdown);

    //using ternary operator for less brackets and bulky code
    //this is the final part which determines what to ouptput and how
    const JSONOutput = isPromptFufilled
      ? await this.AIClient.provideGeminiPrompt(
          promptHelper.convertToJSONPrompt(prompt, markdown)
        )
      : await this.evaluateNavigationNeed(prompt, baseURL, websiteRoutes);
    return JSONOutput;
  }

  async evaluateNavigationNeed(prompt, baseURL, websiteRoutes) {
    //false if navigation is not needed
    const pageContents = await this.webscrapingClient.navigatePages(
      baseURL,
      websiteRoutes
    );

    const bulkMarkdowns = await this.webscrapingClient.bulkMarkdownParse(
      pageContents
    );
    const answer = this.bulkMarkdownAnalysis(prompt, bulkMarkdowns);
  }

  async bulkMarkdownAnalysis(prompt, markdownBulk) {
    //anallyze markdown given the users intial prompt
    //when data that fufills prompt ios found we end the for loop and return the JSON
    for (let i = 0; i < markdownBulk.length; i++) {
      const isPromptFufilled = await this.analyzeMarkdown(
        prompt,
        markdownBulk[i]
      );
      console.log(isPromptFufilled);
      if (isPromptFufilled) {
        const JSONAnswer = await this.AIClient.provideGeminiPrompt(
          promptHelper.convertToJSONPrompt(prompt, markdownBulk[i])
        );
        return JSONAnswer;
      }
    }
  }

  async analyzeMarkdown(prompt, markdown) {
    const checkPromptFufilled = await this.AIClient.provideGeminiPrompt(
      promptHelper.validateMarkdownPrompt(prompt, markdown)
    );
    const isPromptFufilled = parsers.parseBoolean(checkPromptFufilled);
    return isPromptFufilled;
  }
}

module.exports = WebRanger;
