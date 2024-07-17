
const { Application } = require('discord.js');
const [] = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationsCommands = require('../../utils/getApplicationsCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const ApplicationComands = await getApplicationsCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await ApplicationCommandPermissionType.cache.find (
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted){
                    await ApplicationComands.delete(existingCommand.id);
                    console.log(`Command ${name} deleted`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await ApplicationComands.edit(existingCommand.id, {
                        name,
                        description,
                        options,
                    });

                    console.log(`Command ${name} updated`);
                } else {
                    if (localCommand.deleted) {
                        console.log('Skipping registering coomand ${name} as its set to delete.');
                        continue;
                    }

                    await ApplicationComands.create({
                        name,
                        description,
                        options,
                    });

                    console.log(`Command ${name} registered`);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};