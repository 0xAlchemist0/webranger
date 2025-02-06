const OpenAi = require("openai");
const axios = require("axios");
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
    const extractedURL = await this.callAITest(prompt);
    // const isURLValid = validatior.validateURL(extractedURL);
    // console.log("is valid?: ", isURLValid);

    // if (isURLValid) return extractedURL;
    // else throw Error("No url or the URL provided is invalid");
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

  //remove this fucntion and do what u gotta do
  //the solution for rate limits would be to loop through each free model and see which one gives us an output
  //loop reccursively if we dont get an answer else we end and throw an error
  async callAITest(prompt) {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [
            {
              role: "user",
              content: `${prompt}`,
            },
          ],
          provider: {
            sort: "throughput",
          },
        }),
      }
    );
    const answer = await response.json();
    console.log(answer.choices[0].message.content);
  }
}

//The models parameter
//for the models parameter you can pass in a list of models to try if one model does not work
// The models parameter lets you automatically try other models if the primary model’s providers are down, rate-limited, or refuse to reply due to content moderation required by all providers.

// {
//   "models": ["anthropic/claude-3.5-sonnet", "gryphe/mythomax-l2-13b"],
//   ... // Other params
// }

module.exports = AIHandler;
