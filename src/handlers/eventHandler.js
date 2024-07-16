const path = requiere('path');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);
        

        const eventName = eventfolder.replace(/\\/g, '/').split('/').pop();
        
        client.on(eventName, async (...arg) => {
            for (const file of eventFiles) {
                const eventFunction = require(file);
                await eventFunction(client, ...args);
            }
        });
    }
};

