const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localCommands = [];

    const CommandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const CommandCategory of CommandCategories){
        const commandFiles = getAllFiles(CommandCategory);

        for (const commandFile of commandFiles){
            const command = require(commandFile);

            if (exceptions.includes(command.name)){
                continue;
            }

            localCommands.push(command);
        }
    }

    return localCommands
}; 