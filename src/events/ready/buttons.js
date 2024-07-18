const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client, message) => {
  const roles = [
    {
      id: "1262841269877739652",
      label: "Red",
    },
    {
      id: "1262841080651579432",
      label: "Green",
    },
    {
      id: "1262841397988429904",
      label: "Blue",
    },
  ];

  try {
    const channel = await client.channels.cache.get("1262515730021093511");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary),
      );
    });

    await channel.send({
      content: "Claim or remove a role below.",
      components: [row],
    });
  } catch (error) {
    console.log(error);
  }
};