module.exports = (client, message) => {
    // Ignore all bots
    console.log("Message Recieved: " + message)
    if (message.author.bot) return;
    console.log("Message is not a bot")
    console.log("this is the prefix: " + client.settings.prefix)
    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.settings.prefix) !== 0) return;
    console.log("Correct prefix in message")
    // Our standard argument/command name definition.
    const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);
  
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
    console.log("Running command now")
    // Run the command
    cmd.run(client, message, args);
};
