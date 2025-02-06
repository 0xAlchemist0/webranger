const OpenAi = require("openai");
const validatior = require("./validators/validator");
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
      return true;
    } catch (error) {
      return false;
    }
  }

  //here we extract the url from the prompt so that we can move over to the webscraper handler
  async extractPromptURL(prompt) {
    const extractedURL = await this.callAI(prompt);
    const isURLValid = validatior.validateURL(extractedURL);
    console.log("is valid?: ", isURLValid);

    if (isURLValid) return extractedURL;
    else throw Error("No url or the URL provided is invalid");
  }

  async callAI(prompt) {
    console.log(prompt);
    try {
      const request = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });
      console.log(request);
      return request;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = AIHandler;
