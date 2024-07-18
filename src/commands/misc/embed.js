const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Sends an  embed",

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const Embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(" Embed")
      .setAuthor({
        name: "Some name",
      })
      .setDescription("This is an  of a Discord embed created with Discord.js")
      .addFields(
        { name: "Field title", value: "value" },
        { name: "Inline title", value: "value", inline: true },
        { name: "Inline title", value: "value", inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: "Footer",
      });

    interaction.editReply({ embeds: [Embed] });
  },
};