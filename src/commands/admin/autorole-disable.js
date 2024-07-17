const { Client, Interaction, PermissionFlagBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            if (!await AutoRole.exists({ guildId: interaction.guild.id })) {
                return interaction.editReply('The auto role has not been configured yet!Use the `/autorole-configure` command to configure it.');
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            interaction.editReply('Auto role disabled! Use the `/autorole-configure` command to configure it again.');
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while trying to disable the auto role!');
        }
    },

    name: 'autorole-disable',
    description: 'Disable the auto role for the server',
    permissionsRequired: [PermissionFlagBits.ADMINISTRATOR],
};