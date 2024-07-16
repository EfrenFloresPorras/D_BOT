require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType, embedLength } = require("discord.js");

const commands = [
  {
    name: "hey",
    description: "Hey!",
  },
  {
    name: "ping",
    description: "Pong!",
  },
  {
    name: 'add',
    description: 'Add two numbers',
    options: [
      {
        name: 'num1',
        description: 'The first number',
        type: ApplicationCommandOptionType.Number, // String, number, or choices
        choices: [], // If type is choices, you need to provide an array of choices with name and value
        required: true,
      },
      {
        name: 'num2',
        description: 'The second number',
        type: ApplicationCommandOptionType.Number,
        choices: [],
        required: true,
      },
    ],
  },
  {
    name: 'embed',
    description: 'Send an embed',
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    )

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
