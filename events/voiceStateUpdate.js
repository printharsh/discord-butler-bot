const logger = require('../logger.js');

function roll(random, client, joinedChannel, leftChannel, newMember){
    let chance = client.settings.chances.roll

    if (chance[0] <=random <= chance[1]){
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

function death(random, client, newMember){
    let chance = client.settings.chances.death
    if(chance[0] <=random <= chance[1]){
        //Remove all roles
        let all_roles = newMember.roles;
        newMember.removeRoles(all_roles);
    
        let deathRole = client.settings.deathRole;
        let roleName = deathRole.name;

        let role = newMember.guild.roles.find(x => x.name == roleName);
        if(role){
            newMember.addRole(role)
        }
        else{
            // Create role for this guild and add the member to it.
            newMember.guild.createRole(deathRole).then(newRole => {
                role = newRole
                newMember.addRole(newRole); 
                console.log(`Created new role with name ${role.name} and color ${role.color}`)
            })
            .catch(console.error)
        }

        let deathChannelName = client.settings.deathChannel.name;
        let graveyardChannelName = client.settings.graveyardChannel.name;
        let deathChannel = null;
        let graveyardChannel = null;
        // Create death channel if not exist
        if(!newMember.guild.channels.exists('name', deathChannelName)){
            newMember.guild.createChannel(deathChannelName, 'text');
        }
        deathChannel = newMember.guild.channels.find(channel => channel.name === deathChannelName)

        // Create graveyard channel if not exist
        if(!newMember.guild.channels.exists('name',graveyardChannelName)){
            newMember.guild.createChannel(graveyardChannelName, 'text');
        }
        graveyardChannel = newMember.guild.channels.find(channel => channel.name === graveyardChannelName)
        
        const everyoneRole = newMember.guild.roles.find('name', '@everyone');
        graveyardChannel.overwritePermissions(everyoneRole, { VIEW_CHANNEL: false });
        graveyardChannel.overwritePermissions(role, { VIEW_CHANNEL: true });

        // Now get random death message
        let randomIndex = Math.floor(Math.random() * client.settings.deathStrings.length); 
        let randomDeathString = client.settings.deathStrings[randomIndex];

        // Send death string after replacing [name] and [random_name]
        let random_user = newMember.guild.members.random();
        randomDeathString = randomDeathString.replace('[name]', '<@' + newMember.id + '>');
        randomDeathString = randomDeathString.replace('[random_name]', '<@' + random_user.id + '>');
        deathChannel.send(randomDeathString)
    }
}

module.exports = (client, oldMember, newMember) => {
    // A user has muted, deafened, joined or left a channel.

    // Get channels joined and left.
    let joinedChannel = newMember.voiceChannel
    let leftChannel = oldMember.voiceChannel

    // User has joined a voice channel and the bot is not already in a voice channel.
    if(leftChannel === undefined && joinedChannel !== undefined && newMember.guild.voiceConnection === null){
        let random = Math.random();
        roll(random, client, joinedChannel, leftChannel, newMember);
        death(random, client, newMember);
    }
    else if(leftChannel !== undefined && joinedChannel !== undefined && newMember.guild.voiceConnection !== null && client.vars['follwowing'] !== null && client.vars['following'] === newMember.id && joinedChannel !== client.vars['currentChannel']){
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