const { devs, testServer } = require("../../../config.json");
const { permissionsRequiered } = require("../../commands/moderation/ban");
const setLocalCommands = require("../../utils/setLocalCommands");

module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.user.id)) {
        return interaction.reply({
          content: "You do not have permission to use this command",
          ephimeral: true,
        });
      }
    }
    
    if (commandObject.testOnly) {
      if (interaction.guild.id !== testServer) {
        return interaction.reply({
          content: "This command can only be used in the test server",
          ephimeral: true,
        });
      }
    }

    if (commandObject.permissionsRequiered?.length) {
      for (const permission of commandObject.permissionsRequiered) {
        if (!interaction.member.permissions.has(permission)) {
          return interaction.reply({
            content: "You do not have permission to use this command",
            ephimeral: true,
          });
        }
      }
    }

    if (commnadObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          return interaction.reply({
            content: "I do not have permission to use this command",
            ephimeral: true,
          });
          break;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.error(error);
  }
};
