module.exports.config = {
  name: "autograph",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "alexmeher & Copilot",
  description: "Send user's profile picture with a random cute comment.",
  commandCategory: "fun",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const userId = event.senderID;
  const name = await Users.getNameUser(userId);

  const cuteComments = [
    "Stay pawsitive, cutie! 😸",
    "You light up every chat! ✨",
    "Keep being your awesome self, {name}!",
    "Sending you virtual hugs! 🤗",
    "You make this place brighter! 🌟",
    "Smile! Today is your day! 😊",
    "You're sweeter than cookies! 🍪",
    "Adorable and unstoppable, that's you!",
    "This selfie needs to be in a museum!",
    "Cuteness overload detected! 🚨",
    "Shining brighter than the stars, {name}! ✨",
    "Legends say your smile brings spring! 🌸",
    "Too glam to give a damn! 💅",
    "Warning: Extreme charm detected! 🥰",
    "You just broke the cute-o-meter! 💖",
    "On a scale of 1–10, you’re an 11! 🔥",
    "Mirror: 'Wow!'",
    "You’re the reason emojis exist! 😍",
    "More stylish than a runway model! 👑",
    "Like sunshine on a rainy day! ☀️",
    "Certified awesome by the Bot Squad! 🏆",
    "Spreading happiness everywhere you go! 🎈",
    "If awesome had a face, it’d be this one!",
    "100% original, 0% copy! 🦄",
    "You redefine the word ‘cool’! 🕶️",
    "Keep sparkling, superstar! 🌟",
    "Every pixel screams perfection. 🖼️",
    "Slaying the game since day one! 💥",
    "Your vibe is off the charts! 📈",
    "You are art. 🎨",
    "Just when I thought you couldn’t get cuter…"
  ];

  // Pick a random comment and replace {name} if present
  let comment = cuteComments[Math.floor(Math.random() * cuteComments.length)];
  comment = comment.replace("{name}", name);

  // Download profile picture
  const avatarUrl = `https://graph.facebook.com/${userId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const imgPath = __dirname + "/cache/autograph_avatar.jpg";

  request(encodeURI(avatarUrl)).pipe(fs.createWriteStream(imgPath)).on("close", () => {
    api.sendMessage({
      body: `${comment}`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
  });
};