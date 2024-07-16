require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const eventHanlder = require('./handlers/eventHandler.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

let status = [
    {
        name: 'with discord.js',
        type: ActivityType.Playing
    },
    {
        name: 'with discord.js',
        type: ActivityType.Watching
    },
    {
        name: 'with discord.js',
        type: ActivityType.Listening
    },
    {
        name: 'with discord.js',
        type: ActivityType.Streaming,
        url: 'https://twitch.tv/username'
    },
]

eventHanlder(client);

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === 'Hello') {
        message.channel.send('Hey!');
    }

    if (message.content === 'Ping') {
        message.channel.send('Pong!');
    }

    if (message.content.startsWith('!add')) {
        const args = message.content.slice('!add'.length).trim().split(/ +/);
        const num1 = parseInt(args[0]);
        const num2 = parseInt(args[1]);

        if (isNaN(num1) || isNaN(num2)) {
            return message.channel.send('Please provide valid numbers.');
        }

        message.channel.send(`The sum is ${num1 + num2}`);
    }

    if (message.content === '!embed') {
        const embed = new EmbedBuilder()
            .setTitle('This is an embed')
            .setDescription('This is the description of the embed')
            .setColor(0)
            .setTimestamp()
            .addFields([
                { name: 'Field 1', value: 'Value 1', inline: true },
                { name: 'Field 2', value: 'Value 2', inline: true },
                { name: 'Field 3', value: 'Value 3', inline: false },
                { name: 'Field 4', value: 'Value 4', inline: false },
            ]);

        message.channel.send({ embeds: [embed] });
    }


});

client.on('interactionCreate', async (interaction) => {
    try{
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'hey') {
            interaction.reply('Hey!');
        }

        if (interaction.commandName === 'add') {
            const num1 = interaction.options.getNumber('num1');
            const num2 = interaction.options.getNumber('num2');

            interaction.reply(`The sum is ${num1 + num2}`);
        }

        if (interaction.commandName === 'embed') {
            const embed = new EmbedBuilder()
                .setTitle('This is an embed')
                .setDescription('This is the description of the embed')
                .setColor(0)
                .setTimestamp()
                .addFields([
                    { name: 'Field 1', value: 'Value 1', inline: true },
                    { name: 'Field 2', value: 'Value 2', inline: true },
                    { name: 'Field 3', value: 'Value 3', inline: false },
                    { name: 'Field 4', value: 'Value 4', inline: false },
                ]);

            interaction.reply({ embeds: [embed] });
        }

        if (interaction.isButton()) {
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.guild.roles.cache.get(interaction.customId);

            if (!role) return interaction.editReply({
                content: 'Role not found.',
                ephemeral: true,
            });

            const hasRole = interaction.member.roles.cache.has(role.id);

            if (hasRole) {
                await interaction.member.roles.remove(role);
                interaction.editReply({
                    content: `Role ${role.name} removed.`,
                    ephemeral: true,
                });
                return;
            }

            await interaction.member.roles.add(role);
            interaction.editReply({
                content: `Role ${role.name} added.`,
                ephemeral: true,
            });
        }
    } catch (error) {
        console.error(error);
    }

    
});

client.login(process.env.TOKEN); // Here you need to put your bot token