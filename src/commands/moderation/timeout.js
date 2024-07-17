const { Client, Interaction, ApplicationCommandOptionType, permissionsRequiered, botPermissions } = require('disccord.js');
const ms = require('ms');

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target').value;
        const duration = interaction.options.get('duration').value; // 1d, 1w, 1m, 1y
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const target = await interaction.guild.members.fetch(mentionable);
        if (!target) {
            await interaction.editReply('User not found');
            return;
        }

        if (target.user.bot) {
            await interaction.editReply('You cannot timeout a bot');
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msduration)) {
            await interaction.editReply('Invalid duration');
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9){
            await interaction.editReply('The duration must be between 5 seconds and 28 days');
            return;
        }

        const targetRolePosition = target.roles.highest.position; // The position of the highest role of the target
        const requestUserRolePosition = interaction.member.roles.highest.position; // The position of the highest role of the user who requested the ban
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // The position of the highest role of the bot

        if (requestUserRolePosition <= targetRolePosition) {
            await interaction.editReply('You cannot timeout this user because they have a higher role than you');
            return;
        }

        if (botRolePosition <= targetRolePosition) {
            await interaction.editReply('I cannot timeout this user because they have a higher role than me');
            return;
        }

        // TIMEOUT TARGET
        try {
            const { default: prettyMs } = await import('pretty-ms')

            if (target.isCommunicationDisabled()) {
                await target.timeout(msDuration, reason);
                await interaction.editReply('User ${target} timeout has been updated to ${prettyMs(msDuration), {verbose: true}}\nReason: ${reason}');
                return;
            }

            await target.timeout(msDuration, reason);
            await interaction.editReply('User ${target} was timedout for ${prettyMs(msDuration), {verbose: true}}. \nReason: ${reason}');
        } catch (error) {
            console.error(error);
            await interaction.editReply('There was an error trying to timeout this user: ${error}');
        }

    }, 

    name: 'timeout',
    description: 'Timeout a user',
    options: [
        {
            name: 'target',
            description: 'The user to timeout',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'duration',
            description: 'The duration of the timeout',
            type: ApplicationCommandOptionType.STRING,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the timeout',
            type: ApplicationCommandOptionType.STRING,
        }
    ],

    permissionsRquiered: [permissionsRequiered.MuteMembers],
    botPermissions: [botPermissions.MuteMembers],
}