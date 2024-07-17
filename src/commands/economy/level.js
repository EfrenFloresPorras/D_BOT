const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const calculatedLevelXp = require('../../utils/calculatedLevelXp');
const level = require('../../models/level.js');

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
    */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObject = await interaction.guild.members.fetch(targetUserId);

        const fetchedlevel = await level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply (
                mentionedUserId ? '${targetUserObject.user.tag} has no level yet.' : 'You have no level yet.'
            );
            return;
        }

        let allLevels = await level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLEvels.findIndex((lvl) => lvl.useId ===  targetUserId) + 1;

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObject.user.displayAvatarURL({ dynamic: false, format: 'png', size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculatedLevelXp(fetchedLevel.level))
            .setStatus(targetUserObject.presence.status)
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserObject.user.username)
            .setDiscriminator(targetUserObject.user.discriminator);

        const data = await rank.build();
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({ files: [attachment] });
    },


    name: 'level',
    descrption: 'Check your/someone else\'s level',
    options: [
        {
            name: 'user',
            description: 'The user you want to check the level of',
            type: ApplicationCommandOptionType.Mentionable,
        },
    ]
}