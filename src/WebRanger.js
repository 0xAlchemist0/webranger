const AIHandler = require("./APIHandler");

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
      this.handlePrompt(prompt);
    }
  }

  async handlePrompt(prompt) {
    console.log(prompt);
  }
}

module.exports = WebRanger;
