const axios = require("axios");

module.exports.config = {
  name: "tempmail",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "alexmeher + copilot",
  description: "Generate and check tempmail inbox. No password needed.",
  commandCategory: "utility",
  usages: "tempmail gen | tempmail inbox <email>",
  cooldowns: 3
};

const API_BASE = "https://www.1secmail.com/api/v1/";

// Helper: Generate random username
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

// Get list of domains for 1secmail
const DOMAINS = [
  "1secmail.com", "1secmail.org", "1secmail.net",
  "wwjmp.com", "esiix.com", "xojxe.com", "yoggm.com"
];

module.exports.run = async function({ api, event, args }) {
  const subcmd = (args[0] || "").toLowerCase();

  if (subcmd === "gen") {
    const username = randomString(10);
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const email = `${username}@${domain}`;
    api.sendMessage(
      `🦾 TempMail generated:\nEmail: ${email}\nUse ".tempmail inbox ${email}" to check inbox.`,
      event.threadID, event.messageID
    );
  } else if (subcmd === "inbox") {
    if (!args[1] || !args[1].includes("@")) {
      return api.sendMessage("❌ Please provide the tempmail address after 'inbox'. Example: .tempmail inbox example@1secmail.com", event.threadID, event.messageID);
    }
    const [username, domain] = args[1].split("@");
    try {
      const inboxRes = await axios.get(`${API_BASE}?action=getMessages&login=${username}&domain=${domain}`);
      const mails = inboxRes.data;
      if (!mails.length) {
        return api.sendMessage(`📭 No mails found for ${args[1]}.`, event.threadID, event.messageID);
      }
      let msg = `📬 Inbox for ${args[1]}:\n`;
      mails.forEach((mail, i) => {
        msg += `\n${i+1}. From: ${mail.from}\n   Subject: ${mail.subject}\n   ID: ${mail.id}`;
      });
      msg += `\n\nReply with the mail number (e.g. "1") to view the full message.`;
      global.client.handleReply.push({
        name: this.config.name,
        type: "mailview",
        messageID: event.messageID,
        mails,
        username,
        domain,
        author: event.senderID
      });
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
      api.sendMessage("❌ Failed to check inbox. Try again later.", event.threadID, event.messageID);
    }
  } else {
    api.sendMessage(
      "🔹 TempMail Usage:\n" +
      ".tempmail gen - Generate random tempmail\n" +
      ".tempmail inbox <email> - Show inbox for tempmail\n",
      event.threadID, event.messageID
    );
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.author != event.senderID) return api.sendMessage("Who are you? 🐸", event.threadID, event.messageID);
  const num = parseInt(event.body);
  if (isNaN(num) || num < 1 || num > handleReply.mails.length) {
    return api.sendMessage("❌ Invalid mail number.", event.threadID, event.messageID);
  }
  const mail = handleReply.mails[num - 1];
  try {
    const mailRes = await axios.get(`${API_BASE}?action=readMessage&login=${handleReply.username}&domain=${handleReply.domain}&id=${mail.id}`);
    const mailData = mailRes.data;
    let content = mailData.textBody || mailData.htmlBody || "[No text]";
    api.sendMessage(
      `📧 Mail #${num} details:\nFrom: ${mailData.from}\nSubject: ${mailData.subject}\n\n${content}`,
      event.threadID, event.messageID
    );
  } catch (e) {
    api.sendMessage("❌ Couldn't load mail content.", event.threadID, event.messageID);
  }
};