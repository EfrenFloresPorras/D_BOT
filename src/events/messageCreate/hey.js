const { Client, Message } = require("discord.js");

module.exports = async (client, message) => {
  if (message.content === "hey") {
    message.reply("Heeey!");
  }
};