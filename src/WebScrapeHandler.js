const axios = require("axios");
const AIHandler = require("./APIHandler");
const promptHelper = require("./helpers/prompt-helper");
const { HttpsProxyAgent } = require("https-proxy-agent");
const availableProxies = require("./helpers/proxies-available");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
class WebScrapeHandler {
  proxyUsed;
  proxyAgent;
  proxy = "http://31.220.15.234:80";
  options = {
    hostname: "https://r.jina.ai/",
    path: "",
    headers: {
      Authorization:
        "Bearer jina_d6916363ce474536919ecf37479e4fc6A5iHd-OcVy_KkC2gLAz7wYjO0ozh",
    },
  };
  markdown_content = "";
  AIClient;
  constructor(api_key) {
    this.api_key = api_key;
    this.AIClient = new AIHandler(this.api_key);
    this.AIClient.verifyModel();
    this.setSessionProxy();
  }

  setSessionProxy() {
    const randomIndex = Math.random() * (3 - 0) + 0;
    this.proxyUsed = availableProxies[randomIndex.toFixed()];
    console.log(this.proxyUsed);
  }

  setURL(URL) {
    this.target_URL = URL;
  }

  async convertToMarkdown() {
    console.log("random: ", Number(Math.random() * (3 - 0) + 0).toFixed());
    console.log("proxy:", this.proxyUsed);
    console.log(
      "URL FOUND: ",
      this.target_URL,
      " JINA API: ",
      this.options.hostname
    );
    this.options.path = `${this.options.hostname}${this.target_URL}`;
    //promise on resolve returns the data we need bst way to perform this action
    //aios a bit tricky
    try {
      const response = await axios.get(this.options.path, {
        headers: this.options.headers,
      });
      console.trace(response.data);
      this.markdown_content = response.data; // Store the fetched content
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error fetching markdown:", error);
      // Ensure errors are properly propagated
    }

    // markdown alows us to process elements easier with less tokens being used
    // the ai can decide whats important and whats notj
  }
  //here we validate if the markdown provided from the page fufills the user promopt
  //if it does not we ove on to another function to try to get the markdown of other paths on the website
  async getPageContent(foundHrefs) {
    console.log(foundHrefs);
  }

  //extract all possible connected links in order to navigate and find more info
  //only extract the right routes not ones in other pages that dont belong to the domain
  async extractHrefs(HTMLContent, URL) {
    const linksFound = [];
    const $ = cheerio.load(HTMLContent);
    $("a").each((index, element) => {
      const currentHref = $(element).attr("href");
      const fufillsPurpose = this.compareURL(URL, currentHref);
      if (fufillsPurpose) linksFound.push(currentHref);
    });
    return linksFound;
  }

  compareURL(URL, href) {
    if (href.includes(URL) || !href.includes("https:")) {
      return true;
    }
    return false;
  }

  //navigation of websites and extracting contents works properly next step is to convert to markdown and analyzing content
  async navigatePages(baseURL, websiteRoutes) {
    const extractedPages = [];
    console.log(websiteRoutes);
    for (let i = 0; i < websiteRoutes.length; i++) {
      const HTMLContent = await this.getHTMLContent(baseURL + websiteRoutes[i]);
      extractedPages.push(extractedPages);
    }
  }

  getbaseURL(targetURL) {
    const parseURL = new URL(targetURL);
    console.log(parseURL.protocol + "//" + parseURL.hostname);
    return parseURL.protocol + "//" + parseURL.hostname;
  }

  async getHTMLContent(URL) {
    console.log(URL);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(URL);

    // Wait for content to load

    // Extract page content
    const content = await page.content();
    return content;
  }
}

module.exports = WebScrapeHandler;
