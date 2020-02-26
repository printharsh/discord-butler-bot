const { Client, Collection} = require('discord.js');
const logger = require('./logger.js');
const auth = require('./secrets.json');
const fs = require('fs')
const Enmap = require("enmap");


/**
 * Creates a Client object with commands and listeners attached.
 * @return {Client} A client object with parameters attached.
 */
function createClient(){
    var client = new Client();
    client.commands = new Enmap();
    client.events = [];
    client.vars = {}
    client.settings = require('./settings.json')
    return client
}


/**
 * Attaches event and commands handlers to client.
 * @param {Client} client The discord client to attach handlers to.
 * 
 * @return void
 */
function attachHandlers(client){
    // Attach all events to client
    fs.readdir("./events/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          const event = require(`./events/${file}`);
          let eventName = file.split(".")[0];
          console.log(`Attempting to load event ${eventName}`);
          client.on(eventName, event.bind(null, client));
          client.events.push(eventName)
        });
    });

    // Attach all commands to client
    fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          // Load the command file itself
          let props = require(`./commands/${file}`);
          // Get just the command name from the file name
          let commandName = file.split(".")[0];
          console.log(`Attempting to load command ${commandName}`);
          // Here we simply store the whole thing in the command Enmap. We're not running it right now.
          client.commands.set(commandName, props);
        });
    });
}

bot = createClient();
attachHandlers(bot);
bot.login(auth.token);