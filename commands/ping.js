const logger = require('../logger.js');

exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
}