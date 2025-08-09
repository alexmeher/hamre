module.exports.config = {
  name: "shorten",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "alexmeher & Copilot",
  description: "Shorten a URL using your website's URL shortener.",
  commandCategory: "utility",
  usages: "[url]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const longUrl = args[0];

  if (!longUrl || !/^https?:\/\//i.test(longUrl)) {
    return api.sendMessage("Please provide a valid URL to shorten.\nExample: .shorten https://example.com", event.threadID, event.messageID);
  }

  try {
    // Send POST request to the shortener form
    const response = await axios.post("https://mahimcraft.ct.ws/connect/", 
      new URLSearchParams({ url: longUrl }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Parse the response HTML to find the shortened URL
    const $ = cheerio.load(response.data);
    // Update selector below based on your form's output
    // For example, if the short link appears in <input id="shortlink" value="...">
    let shortUrl = $("input#shortlink").val();
    // Or if it's in a <div class='result'>: let shortUrl = $("div.result").text().trim();

    if (shortUrl) {
      return api.sendMessage(`🔗 Shortened URL:\n${shortUrl}`, event.threadID, event.messageID);
    } else {
      return api.sendMessage("Could not find the shortened URL in the response. The form structure may have changed.", event.threadID, event.messageID);
    }
  } catch (err) {
    return api.sendMessage("There was an error connecting to the URL shortener service.", event.threadID, event.messageID);
  }
};