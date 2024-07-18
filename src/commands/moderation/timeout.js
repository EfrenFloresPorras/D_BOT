const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

const ms = require("ms");

const { permissionsRequired } = require("./ban");

module.exports = {
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   *
   */
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value; // 1d, 1 day, 1s 5s, 5m
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't timout a bot.");
      return;
    }

    const msDuration = ms(duration);

    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timout duration.");
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or more than 28 days.",
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // highest role fo the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't timeout that user because they have the same/higher role than you.",
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't timeout that user because the same/higher role than me",
      );
      return;
    }

    // timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s' timout has been updated to ${prettyMs(msDuration, { verbose: true })}.\nReason ${reason}`,
        );
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `${targetUser}' was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason ${reason}`,
      );
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },
  name: "timeout",
  description: "Timeout a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1day)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};