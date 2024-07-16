
const [] = require('../../../config.json');
const getApplicationsCommands = require('../../utils/getApplicationsCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const ApplicationComands = getApplicationsCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await ApplicationCommandPermissionType.cache.find (
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted){
                    await ApplicationComands.delete(existingCommand.id);
                    break;
                }

                
            }
        }
    } catch (error) {
        console.error(error);
    }
};