const { Client, Message } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot || cooldaowns.has(message.author.id)) return;

    const xpToGive = getRandomXp(5, 15);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };
    
    try {
        const level = await level.findOne(query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXp(level.level)) {
                level.level += 1;
                level.xp = 0;

                message.channel.send(`Congrats ${message.member}, you've leveled up to **level ${level.level}**.`);
            }

            await level.save().catch((e) => {
                console.log('Error saving level data:', e);
                return;
            });

            cooldowns.add(message.author.id);
            setTimeoout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }

        // if (!level)
        else {
            // create new level
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });

            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeoout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }
    } catch (error) {
        console.error(error);
    }
}