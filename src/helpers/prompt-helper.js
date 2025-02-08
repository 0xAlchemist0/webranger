function extractURLPrompt(prompt) {
  return `Given the following prompt extract the URl given within this prompt and return the URL only in text form prompt:${prompt}`;
}

function validateMarkdownPrompt(prompt, markdown) {
  return `Given the following content: ${markdown}, does it contain the necessary information to satisfy the user's request: ${prompt}, Respond with only true or false, without any additional text or explanation.`;
}

function convertToJSONPrompt(prompt, data) {
  return `you are a master web scraper given the following data ${data}, find and convert the proper data into json format in a way to fufil this prompt:${prompt} make sure to extract and provide all the proper data `;
}

module.exports = {
  extractURLPrompt,
  validateMarkdownPrompt,
  convertToJSONPrompt,
};
