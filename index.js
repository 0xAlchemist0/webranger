const WebRanger = require("./src/WebRanger");
//intiializes the class
const client = new WebRanger("wdkmdk", "openAI");

//the call to prompt the ai to webscrape a website
client.handleUserPrompt("Hello AI what is your name?");
