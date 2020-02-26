function roll(random, client, joinedChannel, leftChannel, newMember){
    let chance = client.settings.chances.roll

    let random = Math.random();
    if (random <= chance){
        joinedChannel.join().then(connection => {
            // Yay, it worked!
            logger.info("About to roll, connected to channel.");
            const dispatcher = connection.playFile(require("path").join(__dirname, '../audio/roll.mp3')).on("end", end => {
                if(client.vars['currentChannel'] !== null){
                    // if we haven't already left then leave.
                    client.vars['currentChannel'].leave();
                    client.vars['following'] = null
                    client.vars['currentChannel'] = null
                }
            });
            client.vars['following'] = newMember.id;
            client.vars['currentChannel'] = joinedChannel
        }).catch(e => {
            // Oh no, it errored! Let's log it to console :)
            console.log(e);
        });

    }
}

module.exports = (client, oldMember, newMember) => {
    // A user has muted, deafened, joined or left a channel.

    // Get channels joined and left.
    let joinedChannel = newMember.voiceChannel
    let leftChannel = oldMember.voiceChannel

    // User has joined a voice channel and the bot is not already in a voice channel.
    if(leftChannel === undefined && joinedChannel !== undefined && newMember.guild.voiceConnection !== null){
        let random = Math.random();
        roll(random, client, joinedChannel, leftChannel, newMember);
    }
    else if(leftChannel === undefined && joinedChannel !== undefined && newMember.guild.voiceConnection === null && client.vars['follwowing'] !== null && client.vars['following'] === newMember.id && joinedChannel !== client.vars['currentChannel']){
        // Follow the user!
        joinedChannel.join();
        client.vars['currentChannel'] = joinedChannel;
    }
    else if(joinedChannel === undefined && newMember.id === client.vars['following'] && client.vars['following'] !== null){
        // Following user left voiceChannel, so also leave!
        client.vars['currentChannel'].leave();
        client.vars['following'] = null
        client.vars['currentChannel'] = null
    }
    else if(joinedChannel === undefined){
        // Somebody, not the person we are following left channel.
    }

    
};