module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "MAHIM ISLAM",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["100088769563815"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("[ ERR ] 📛 You don't have permission to use this command! 💔🙂", event.threadID, event.messageID);
  api.sendMessage(`[ OK ] ${global.config.BOTNAME} Bot are now turned off...! 🙂🍒`,event.threadID, () =>process.exit(0))
}