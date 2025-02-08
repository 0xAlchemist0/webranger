function extractURLPrompt(prompt) {
  return `Given the following prompt extract the URl given within this prompt and return the URL only in text form prompt:${prompt}`;
}

function validateMarkdownPrompt(prompt, markdown) {
  return `Given the following content: ${markdown}, does it contain the necessary information to satisfy the user's request: ${prompt}, Respond with only true or false, without any additional text or explanation.`;
}

module.exports = { extractURLPrompt, validateMarkdownPrompt };
