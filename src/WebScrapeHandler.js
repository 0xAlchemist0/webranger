const axios = require("axios");
class WebScrapeHandler {
  jina_endpoint = "https://r.jina.ai/";
  constructor(target_URL) {
    this.target_URL = target_URL;
  }

  async convertToMarkDown() {
    console.log(this.jina_endpoint + this.target_URL);
    const response = await axios.get(this.jina_endpoint + this.URL);
    const markdown_content = response.data;
    //markdown alows us to process elements easier with less tokens being used
    //the ai can decide whats important and whats not
    console.log(markdown_content);
    return null;
  }
}
