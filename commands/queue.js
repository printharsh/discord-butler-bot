const {RichEmbed} = require('discord.js');

exports.run = (client, message, args) => {

    try{
        const serverMusicQueue = client.queue.get(message.guild.id);

        let fields = [];
        i = 0;
        const embed = new RichEmbed()
        for(const song of serverMusicQueue.songs){
            embed.addField(`${i}) ${song.title}`, song.url, true)
        }
        embed.setTitle('Current Music Queue').setColor(0xff0000).setDescription('Hello sir, this is the current music queue you requested.').setTimestamp();
        console.log('past that.');

        message.channel.send(embed);
    }
    catch(err){
        console.log(err)
        message.channel.send('Sir, you are tripping there is nothing in queue.')
    }
}
