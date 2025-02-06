const OpenAi = require("openai");

class AIHandler {
  baseURL = "https://openrouter.ai/api/v1";
  client;
  constructor(api_key, model) {
    this.api_key = api_key;
    this.model = model;
    this.client = new OpenAi({
      baseURL: this.baseURL,
      apiKey: this.api_key,
      defaultHeaders: {},
    });
  }

  //here we validate if the model the user initialized webrange rwith is valid
  async verifyModel() {
    console.log("Here ", this.api_key);
    try {
      const test_prompt = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Hello what is your name?",
              },
            ],
          },
        ],
      });
      console.log(test_prompt.choices[0].message);
      return true;
    } catch (error) {
      return false;
    }
  }

  //here we extract the url from the prompt so that we can move over to the webscraper handler
  async extractPromptURL() {
    return null;
  }

  async processPrompt(prompt) {}
}

module.exports = AIHandler;
