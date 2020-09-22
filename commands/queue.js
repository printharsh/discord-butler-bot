const {MessageEmbed} = require('discord.js');

exports.run = (client, message, args) => {

    try{
        const serverMusicQueue = message.client.queue.get(message.guild.id);

        console.log(serverMusicQueue);

        let fields = [];
        i = 0;
        for(song of serverMusicQueue){
            fields.append({name: `${i}) ${song.title}`, value: song.url})
        }

        console.log(fields);

        const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle('Current Music Queue')
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Hello sir, this is the current music queue you requested.')
        .addFields(fields
        )
        .setTimestamp();

        message.channel.send(embed);
    }
    catch(err){
        message.channel.send('Sir, you are tripping there is nothing in queue.')
    }
}