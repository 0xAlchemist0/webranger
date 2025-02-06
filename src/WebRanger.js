const AIHandler = require("./APIHandler");
const promptHelper = require("./helpers/prompt-helper");

class WebRanger {
  AIClient;
  constructor(api_key, model) {
    this.api_key = api_key;
    this.model = model;
    this.AIClient = new AIHandler(this.api_key, this.model);
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
      this.handlePrompt(prompt);
    }
  }

  async handlePrompt(prompt) {
    const URL_Extrcted = await this.AIClient.extractPromptURL(
      `${promptHelper.extractURL}: ${prompt}`
    );
  }
}

module.exports = WebRanger;
