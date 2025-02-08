const OpenAi = require("openai");
const axios = require("axios");
const validatior = require("./validators/validator");
const freeModels = require("./free-models");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
class AIHandler {
  baseURL = "https://openrouter.ai/api/v1";
  client;
  constructor(api_key) {
    this.api_key = api_key;
    this.client = new OpenAi({
      baseURL: this.baseURL,
      apiKey: this.api_key,
      defaultHeaders: {},
    });
  }

  //here we validate if the model the user initialized webrange rwith is valid
  async verifyModel() {
    //change to call ai back fucntion when doen using gemini for now
    const result = await this.provideGroqPrompt("say hello if you are working");

    if (result !== null) return true;

    return false;
  }
  //gemini api: AIzaSyC11O6Irb85-0B-6rd6LZoeo4JFltzpYDs
  //adding a few llm providers for easier access and usuability
  //groq: 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
  async provideGroqPrompt(prompt) {
    const groq = new Groq({
      apiKey: "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",
    });
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const answer = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            model: "llama-3.3-70b-versatile",
          });
          resolve(answer);
        } catch (error) {
          console.log(error);
        }
      }, "5 seconds");
    });
  }

  async provideGeminiPrompt(prompt) {
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC11O6Irb85-0B-6rd6LZoeo4JFltzpYDs"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const answer = await model.generateContent(prompt);

      return answer.response.text() || null;
    } catch (error) {
      return null;
    }
  }

  //here we extract the url from the prompt so that we can move over to the webscraper handler

  //we use a set timeot to avoid rate limits properly
  //remove this fucntion and do what u gotta do
  //the solution for rate limits would be to loop through each free model and see which one gives us an output
  //loop reccursively if we dont get an answer else we end and throw an error
  async callAI(prompt) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.api_key}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                models: freeModels,
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
          return resolve(answer.choices[0].message.content || null);
        } catch (error) {
          console.log("Error");
          return resolve(null);
        }
      }, "5 seconds");
    });
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
