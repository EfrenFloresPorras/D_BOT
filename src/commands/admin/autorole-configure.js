const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagBits } = require('discord,js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            return interaction.reply('This command can only be used in a server!');
        }

        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();

            let autoRole = await AutoRole.findOne({
                guildId: interaction.guild.id,
            });

            if (autoRole) {
                if (autoRole.roleId === targetRoleId) {
                    return interaction.editReply('The auto role is already set to that role! To desable it, use the `/autorole-disable` command.');
                }

                autoRole.roleId = targetRoleId;

            } else {
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                });
            }

            await autoRole.save();
            interaction.editReply('Auto role set to <@&${targetRoleId}>! To disable it, use the \`/autorole-disable\` command.');

        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while trying to configure the auto role!');
        }
    },

    name: 'autorole-configure',
    description: 'Configure the auto role for the server',
    options: [
        {
            name: 'role',
            description: 'The role to be given to new members',
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    permissionsRequired: [PermissionFlagBits.ADMINISTRATOR],
    botPermissions: [PermissionFlagBits.MANAGE_ROLES],
};