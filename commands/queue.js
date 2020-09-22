const {MessageEmbed} = require('discord.js');

exports.run = (client, message, args) => {

    try{
        const serverMusicQueue = message.client.queue.get(message.guild.id);

        let fields = [];
        i = 0;
        for(song of serverMusicQueue.songs){
            fields.push({name: `${i}) ${song.title}`, value: song.url})
        }

        console.log(fields);

        const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle('Current Music Queue')
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Hello sir, this is the current music queue you requested.')
        .setTimestamp();
        console.log('past that.');

        message.channel.send(embed);
    }
    catch(err){
        console.log(err)
        message.channel.send('Sir, you are tripping there is nothing in queue.')
    }
}