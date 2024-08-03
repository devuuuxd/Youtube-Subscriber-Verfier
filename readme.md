# YouTube Subscriber Verifier 🎥✔️

## Description

The **YouTube Subscriber Verifier** is a Discord bot designed to verify if users have subscribed to a specified YouTube channel. It analyzes images uploaded by users to check for text that matches the channel's name or specific keywords. If a match is found, it grants a role to the user in the Discord server. The bot also supports saving subscriber data for record-keeping. 📜

## Features ✨

- **Image Analysis**: Uses Tesseract.js and sharp to process and analyze uploaded images. 🖼️
- **Keyword Matching**: Checks for specific keywords or the channel name in the image text. 🔍
- **Role Assignment**: Grants a specified role to users who successfully verify their subscription. 🎖️
- **Data Saving**: Optionally saves verified user data in a `subscriber.json` file. 💾
- **Ephemeral Responses**: Sends ephemeral messages to users for privacy. 🔒

## Prerequisites 🛠️

- Node.js (v16 or higher recommended) 🚀
- `npm` or `yarn` for managing packages 📦
- A Discord bot token 🔑
- A YouTube channel name to verify subscriptions 📺

## Installation 🛠️

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devuuuxd/YouTube-Subscriber-Verifier.git
   cd YouTube-Subscriber-Verifier
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. Create a `config.js` file in the root directory with the following content:
    ```js
    module.exports = {
        token: "YOUR_BOT_TOKEN_HERE", // Add your bot's token here
        channel_name: "@devuuuu_xd", // Specify your YouTube channel's name here
        role_id: "YOUR_ROLE_ID_HERE", // ID of the role to be given
        keywords: "SUBSCRIBED", // Specify the keywords for analyzing the image
        save_data: "false" // Set to "true" to save data in subscriber.json, "false" otherwise
    };
    ```
4. Run the bot:
    ```bash
    node index.js

    ```
5. **Setting Up**: Ensure that your bot has the necessary permissions in your Discord server, including managing roles and sending messages. 🛠️

6. **Bot Behavior**: The bot will:
   - Check if the user is already verified.
   - Analyze the uploaded image to detect the specified channel name or keywords.
   - Assign the role if the criteria are met.
   - Optionally save user data based on your configuration.

## Example Usage 📋

1. **Verify Command**:
   - Type `/verify` in a channel where the bot is present.
   - Attach an image that contains text related to the YouTube channel name or specified keywords.
   - The bot will process the image and respond with the verification result.

2. **Response**:
   - If the image contains the correct text, the bot will assign the role and confirm the verification.
   - If the text is not found, the bot will send an ephemeral message with instructions or a sample image.

## Troubleshooting 🛠️

- **Bot Not Responding**: Ensure your bot is online and the token in `config.js` is correct.
- **Permission Issues**: Verify that the bot has appropriate permissions in your Discord server.
- **Image Issues**: Make sure the image format is supported and accessible.

## Contact 📧

For any questions or support, please open an issue on the [GitHub repository](https://github.com/devuuuxd/YouTube-Subscriber-Verifier) or contact me directly on our Team's [Discord Server](https://discord.gg/V9jAnPKTg6) [Kronix Development](https://www.teamkronix.tech).

Happy verifying! 🎉
