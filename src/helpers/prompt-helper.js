function extractURLPrompt(prompt) {
  return `Given the following prompt extract the URl given within this prompt and return the URL only in text form prompt:${prompt}`;
}

function validateMarkdownPrompt(prompt, markdown) {
  return `You are an expert web scraper.  Given the following html element text: ${markdown}, thoroughly analyze it to determine if it contains all the information necessary to completely fulfill the user's request: ${prompt}. Respond with only "true" or "false", and provide no further explanation.`;
}

function convertToJSONPrompt(prompt, data) {
  return `you are a master web scraper given the following data ${data}, find and convert the proper data into json format in a way to fufil this prompt:${prompt} make sure to extract and provide all the proper data provide the json answer only with no other explanation or answer`;
}

module.exports = {
  extractURLPrompt,
  validateMarkdownPrompt,
  convertToJSONPrompt,
};
