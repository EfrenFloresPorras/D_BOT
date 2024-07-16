require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const roles = [
    {
        name: 'Admin',
        label: 'Admin',
        permissions: ['ADMINISTRATOR'],
    },
    {
        name: 'Moderator',
        label: 'Moderator',
        permissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
    },
    {
        name: 'Hacker',
        label: 'Hacker',
        permissions: ['MANAGE_MESSAGES'],
    }, 
    {
        name: 'Member',
        label: 'Member',
        permissions: [],
    },
]

client.on('ready', async (c) => {
    try {
        const channel = await client.channels.fetch('1262515866751209495');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach(role => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.name).setLabel(role.label).setStyle(ButtonStyle.PRIMARY)
            )
        });

        await channel.send({ content: 'Select your role:', components: [row] });

        process.exit();
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.TOKEN); // Here you need to put your bot token