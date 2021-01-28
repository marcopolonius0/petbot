# Seting up the petbot framework:
## Installing the bot:
Navigate to the releases tab and download the latest stable release .zip file. NEVER download the bot from the master branch, more information provided below as to the reasoning.

## First time using:
You WILL need node.js installed on your PC before moving on. Included with the standard node.js installation is the npm installer. Make sure both are installed. You can download node.js here (go for the latest LTS version, currently v14): https://nodejs.org/en/download/

To start off with installation, open a command prompt and navigate to this directory using the `cd` command.
Example: `cd C:/Users/Name/Downloads/petbot`.

Once in the correct directory, simply run `npm ci` and the required dependancies will be installed.
From this point, create a folder in the root directory called 'private' with a subfolder called 'data'. You can also just copy the following command and run it: `mkdir -p /private/data`.

In the /private/ directory, create a file called `config.json`.
Copy this into it:
```json
{
    "token":"your-bot-token-here",
    "admins":["your-discord-user-id-here"]
}
```
You can get a bot application + token from the Discord Developer portal found here: https://discord.com/developers/applications
Make sure to use the one found under the "Bot" tab. It should be hidden at first. Make sure to never give this token to anyone.
The admins array is just basically a list of Discord user IDs that are considered "admin" accounts. They can run some specific debugging/database commands. You should be careful with who you trust with this permission.
Fill in the 2 values. To add more admins, just add an element to the array.

Once you're done setting up the config, the last step is to run the bot. All you need to do is use `node app.js` in your command prompt. As long as you're in the correct directory, you will start the bot properly.

## Future start-ups:
All you need to do is navigate to the correct direcotry using the `cd` command and run `node app.js` to start the bot. Much simpler after setting it up.

## Updating the bot:
Please only update if there is a new version tag, there can be uncaught errors in the master branch that can do things such as corrupting user data, crashes, and whatnot. An example could be that the user would receive "null" tokens, essentially meaning they had infinite tokens. This error was fixed, but before then it was in the master branch after the last update tag.

## Report bugs and issues:
Please create an issue or pull request on GitHub if something seems broken while you use the bot. Thanks for supporting the development!