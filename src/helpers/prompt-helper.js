function extractURLPrompt(prompt) {
  return `Given the following prompt extract the URl given within this prompt and return the URL only in text form prompt:${prompt}`;
}

function validateMarkdownPrompt(prompt, markdown) {
  return `You are an expert web scraper. Given the following content: ${markdown}, thoroughly analyze it and determine whether it contains all the necessary information to fully satisfy the user's request: ${prompt}. Respond strictly with either 'true' or 'false', and provide no additional text or explanation.`;
}

function convertToJSONPrompt(prompt, data) {
  return `you are a master web scraper given the following data ${data}, find and convert the proper data into json format in a way to fufil this prompt:${prompt} make sure to extract and provide all the proper data provide the json answer only with no other explanation or answer`;
}

module.exports = {
  extractURLPrompt,
  validateMarkdownPrompt,
  convertToJSONPrompt,
};
