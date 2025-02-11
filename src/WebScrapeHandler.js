const AIHandler = require("./APIHandler");
const puppeteer = require("puppeteer");
const TurnDownService = require("turndown");
const cheerio = require("cheerio");
class WebScrapeHandler {
  markdown_content = "";
  AIClient;
  markdownService;
  constructor(api_key) {
    this.api_key = api_key;
    this.AIClient = new AIHandler(this.api_key);
    this.AIClient.verifyModel();
    this.markdownService = new TurnDownService({ option: "setwxt" });
  }

  setURL(URL) {
    this.target_URL = URL;
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

  async convertToMarkdown(HTML) {
    return new Promise(async (resolve, reject) => {
      const markdown = this.markdownService.turndown(HTML);

      resolve(markdown);
    });

    // markdown alows us to process elements easier with less tokens being used
    // the ai can decide whats important and whats notj
  }

  async bulkMarkdownParse(contents) {
    const count = 2;
    let markdowns = [];
    for (let i = 0; i < contents.length; i++) {
      const currentMarkdown = this.convertToMarkdown(contents[i]);
      markdowns.push(currentMarkdown);
    }

    return markdowns;
  }

  //navigation of websites and extracting contents works properly next step is to convert to markdown and analyzing content
  //slow down the function call to make it faster wait 5 seconds to call again
  async navigatePages(baseURL, websiteRoutes) {
    let extractedPages = [];
    for (let i = 0; i < websiteRoutes.length; i++) {
      const HTMLContent = await this.getHTMLContent(baseURL + websiteRoutes[i]);
      extractedPages.push(HTMLContent);
    }
    return extractedPages;
  }

  compareURL(URL, href) {
    if (href.includes(URL) || !href.includes("https:")) {
      return true;
    }
    return false;
  }

  getbaseURL(targetURL) {
    const parseURL = new URL(targetURL);
    const { protocol, hostname } = parseURL;
    return protocol + "//" + hostname;
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

//work on destructring elmeents cleaning code up a bit making it more readable

module.exports = WebScrapeHandler;
