const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "add",
  description: "Adds two numbers together",
  options: [
    {
      name: "first",
      description: "The first number",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "second",
      description: "The second number",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const first = interaction.options.get("first").value;
    const second = interaction.options.get("second").value;

    const result = first + second;

    interaction.editReply(`${first} + ${second} = ${result}.`);
  },
};