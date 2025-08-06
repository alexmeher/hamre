module.exports.config = {
        name: "joinNoti",
        eventType: ["log:subscribe"],
        version: "1.0.1",
        credits: "MAHIM",
        description: "Bot and user welcome message system",
        dependencies: {
                "fs-extra": ""
        }
};

module.exports.run = async function({ api, event, Threads }) {
        const { threadID } = event;
        const data = (await Threads.getData(threadID)).data || {};
        const checkban = data.banOut;
        const axios = require("axios");

        if (Array.isArray(checkban) && checkban.length > 0) return;

        // ➤ Bot Join Welcome
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
                const botName = global.config.BOTNAME || "IMRAN";
                const prefix = global.config.PREFIX;
                const BOT_GIF_URL = 'https://raw.githubusercontent.com/MR-IMRAN-60/JSON-STORE/refs/heads/main/imbot.gif';

                await api.changeNickname(`${botName} ai`, threadID, api.getCurrentUserID());

                const botMessage = `🤖 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 ✔️`;

                try {
                        const gif = await axios.get(BOT_GIF_URL, { responseType: 'stream' });
                        await api.sendMessage({ body: botMessage, attachment: gif.data }, threadID);
                } catch (err) {
                        console.log("❌ Error sending bot welcome:", err);
                }
        }

        // ➤ User Join Welcome
        else {
                try {
                        let { threadName, participantIDs } = await api.getThreadInfo(threadID);
                        const threadData = global.data.threadData.get(parseInt(threadID)) || {};
                        const mentions = [];
                        const nameArray = [];

                        for (const user of event.logMessageData.addedParticipants) {
                                const userName = user.fullName;
                                const userID = user.userFbId;
                                nameArray.push(userName);
                                mentions.push({ tag: userName, id: userID });
                        }

                        let msg = threadData.customJoin || 
`‎🦋🪶🍒 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 {threadName} 🎀💗💪🏼 🍒🪶🦋 \n\n

𝖣𝖾𝖺𝗋 {name},  
𝐆𝐥𝐚𝐝 𝐭𝐨 𝐡𝐚𝐯𝐞 𝐲𝐨𝐮 𝐡𝐞𝐫𝐞! 𝐋𝐞𝐭'𝐬 𝐜𝐨𝐧𝐧𝐞𝐜𝐭 & 𝐬𝐡𝐚𝐫𝐞. 😊👋  \n\n

🖤🍒 𝐄𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐝𝐚𝐲! 🍒🖤`;

                        msg = msg
                                .replace(/\{name}/g, nameArray.join(', '))
                                .replace(/\{type}/g, nameArray.length > 1 ? 'friends' : 'you')
                                .replace(/\{soThanhVien}/g, participantIDs.length)
                                .replace(/\{threadName}/g, threadName);

                        const USER_GIF_URL = 'https://raw.githubusercontent.com/MR-IMRAN-60/JSON-STORE/refs/heads/main/Joinim.gif';
                        const gifResponse = await axios.get(USER_GIF_URL, { responseType: 'stream' });

                        await api.sendMessage({
                                body: msg,
                                mentions,
                                attachment: gifResponse.data
                        }, threadID);
                } catch (e) {
                        console.log("❌ Error in user welcome:", e);
                }
        }
};

  