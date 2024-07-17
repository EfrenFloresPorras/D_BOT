const { Client, Interaction, ApplicationComandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) =>{
        const targetUserId = interaction.options.get('target').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const target = await interaction.guild.members.fetch(targetUserId);

        if (!target) {
            await interaction.editReply('User not found');
            return;
        }

        if (!target.kickable) {
            await interaction.editReply('I cannot kick this user');
            return;
        }

        if (target.id === interaction.guild.ownerId) {
            await interaction.editReply('You cannot ban the owner of the server');
            return;
        }

        const targetRolePosition = target.roles.highest.position; // The position of the highest role of the target
        const requestUserRolePosition = interaction.member.roles.highest.position; // The position of the highest role of the user who requested the ban
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // The position of the highest role of the bot

        if (requestUserRolePosition <= targetRolePosition) {
            await interaction.editReply('You cannot kick this user because they have a higher role than you');
            return;
        }

        if (botRolePosition <= targetRolePosition) {
            await interaction.editReply('I cannot kick this user because they have a higher role than me');
            return;
        }

        // KICK TARGET
        try {
            await target.kick( reason );
            await interaction.editReply('User ${target} kicked successfully, reason: ${reason}');
        } catch (error) {
            console.error(error);
            await interaction.editReply('There was an error trying to kick this user: ${error}');
        }

    },

    name: 'kick',
    description: 'Kicks a member from the server',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target',
            description: 'The member to kick',
            requiered : true,
            type: ApplicationComandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for kicking this member',
            type: ApplicationComandOptionType.String,
        
        }
    ],

    permissionsRequiered: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],    
}