const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     *
     */
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get("target-user").value;
      const reason =
        interaction.options.get("reason")?.value || "No reason provided";
  
      await interaction.deferReply();
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          "You can't ban that user because they're the server owner.",
        );
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; // highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // highest role fo the user running the command
      const botRolePosition = interaction.guild.members.me.roles.highest.position;
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You can't ban that user because they have the same/higher role than you.",
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't ban that user because the same/higher role than me",
        );
        return;
      }
  
      // ban the targetUser
      try {
        await targetUser.ban({ reason });
        await interaction.editReply(
          `User ${targetUser} was banned\nReason: ${reason}`,
        );
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
    name: "ban",
    description: "Bans a member from this server.",
    options: [
      {
        name: "target-user",
        description: "The user you want to ban.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "The reason you want to ban.",
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  };