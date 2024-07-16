const { ApplicationComandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member from the server',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target',
            description: 'The member to ban',
            requiered : true,
            type: ApplicationComandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for banning this member',
            type: ApplicationComandOptionType.String,
        
        }
    ],

    permissionsRequiered: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) =>{
        interaction.reply('ban..');
    }
}