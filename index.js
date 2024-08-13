const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fetch = require('node-fetch');
const fs = require('fs');
const config = require("./config.js");

// Getting Config
if (!config.token) {
    console.error('Error: Bot token is required in config.js');
    process.exit(1);
}
if (!config.channel_name) {
    console.error('Error: Channel name is required in config.js');
    process.exit(1);
}

const role_id = config.role_id || null;
const keywords = config.keywords || null;
const save_data = config.save_data || 'false';



// Creating a Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName('verify')
            .setDescription('Analyze an image for text')
            .addAttachmentOption(option => 
                option.setName('image')
                    .setDescription('The image to analyze')
                    .setRequired(true))
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});



// Check if a user is already verified
const isUserVerified = (userId) => {
    if (!fs.existsSync('subscriber.json')) return false;

    const subscribers = JSON.parse(fs.readFileSync('subscriber.json'));
    return subscribers.some(subscriber => subscriber.id === userId);
};



// Command handling
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'verify') {
        const member = interaction.member;

        await interaction.deferReply({ ephemeral: true });
        if (!member) {
            await interaction.followUp({ content: 'Member not found.', ephemeral: true });
            return;
        }

        // Check if the user is already verified
        if (isUserVerified(member.user.id)) {
            await interaction.followUp({ content: 'You are already verified.', ephemeral: true });
            return;
        }

        const image = interaction.options.getAttachment('image');

        if (!image || !image.url) {
            await interaction.followUp({ content: 'Please provide a valid image.', ephemeral: true });
            return;
        }

        // Check the file extension
        const allowedExtensions = ['jpeg', 'png', 'webp', 'gif'];
        const url = new URL(image.url);
        const fileExtension = url.pathname.split('.').pop().toLowerCase();

        console.log(`File extension: ${fileExtension}`);

        if (!allowedExtensions.includes(fileExtension)) {
            await interaction.followUp({ content: 'Unsupported file format. Please upload a JPEG, PNG, WEBP, or GIF image.', ephemeral: true });
            return;
        }

        // Getting the Image
        try {
            const response = await fetch(image.url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Use sharp to preprocess the image
            const processedImage = await sharp(buffer)
                .resize({ width: 1000 })
                .toBuffer();

            // Use Tesseract to extract text
            const { data: { text } } = await Tesseract.recognize(processedImage);

            // Convert extracted text and channel name to lowercase for case-insensitive comparison
            const extractedTextLower = text.toLowerCase();
            const channelNameLower = config.channel_name.toLowerCase();

            console.log(`Extracted text: ${text}`);

            // Initialize a flag for channel name match
            let containsChannelName = extractedTextLower.includes(channelNameLower);

            // Check if any of the keywords are in the extracted text
            if (config.keywords) {
                const keywordsArray = config.keywords.split(',').map(keyword => keyword.trim().toLowerCase());
                containsChannelName = containsChannelName || keywordsArray.some(keyword => extractedTextLower.includes(keyword));
            }

            // If a match is found
            if (containsChannelName) {
                if (role_id) {
                    await member.roles.add(role_id);
                }
                await interaction.followUp({ content: `Thanks for subscribing to ${config.channel_name}`, ephemeral: true });

                // Save user data if save_data is true
                if (save_data === 'true') {
                    const userData = {
                        username: member.user.username,
                        id: member.user.id,
                        time: new Date().toISOString(),
                        accountCreated: member.user.createdAt.toISOString()
                    };
                    let subscribers = [];
                    if (fs.existsSync('subscriber.json')) {
                        subscribers = JSON.parse(fs.readFileSync('subscriber.json'));
                    }
                    subscribers.push(userData);
                    fs.writeFileSync('subscriber.json', JSON.stringify(subscribers, null, 2));
                }
            } else {
                await interaction.followUp({
                    content: `You haven't subscribed to ${config.channel_name} or if this is an error please send a cropped image like attached below!`,
                    files: ["https://i.ibb.co/rQdzcbT/image.png"],
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error processing the image:', error);
            await interaction.followUp({ content: 'There was an error processing the image. Please try again.', ephemeral: true });
        }
    }
});


client.login(config.token).catch(err => {
    console.error('Failed to login:', err);
});
/*/* ALL CREDITS TO 
/* https://www.youtube.com/@devuuu_xd (YOUTUBE)
/* https://github.com/devuuuxd (GITHUB)
/* MAKE SURE TO GIVE ME CREDITS 😼😼
/*/
