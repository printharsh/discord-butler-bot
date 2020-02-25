var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./secrets.json');
var settings = require('./settings.json');
var fs = require('fs')

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', function (evt) {
    logger.info('Connected');
});

rollingUser = 123
rolling = false

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel

    // User has joined voice channel and we're looking to potentially roll!
    if(!rolling && oldUserChannel === undefined && newUserChannel !== undefined) {
        let random = Math.random();
        if (random <= settings.chance){
            // Time to Roll!
            rolling = true

            // Will disconnect if user disconnects from channel
            rollingUser = newMember.id

            newUserChannel.join().then(connection => {
                // Yay, it worked!
                logger.info("About to roll, connected to channel.");
                const dispatcher = connection.playFile(require("path").join(__dirname, './roll.mp3')).on("end", end => {
                    console.log("HERE")
                    rolling = false
                    newUserChannel.leave();
                });
                
                // Nest the listener for checking if user leaves
                bot.on('voiceStateUpdate', (oldMemberLeaver, newMemberLeaver) => {
                    let newUserChannelLeave = newMemberLeaver.voiceChannel
                    if(newUserChannelLeave === undefined){
                        // User leaves a voice channel
                        if(newMember.id == rollingUser){
                            // Means we're rolling so disconnect and set rolling to false
                            rolling = false
                            newUserChannel.leave();
                        }
                    }
                });

            }).catch(e => {
                // Oh no, it errored! Let's log it to console :)
                console.log(e);
            });

            }

        }
    }
);

bot.login(auth.token);