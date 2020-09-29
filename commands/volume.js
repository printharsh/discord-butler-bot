exports.run = (client, message, args) => {
    volume_to_set = args[0]
    if(args[0] === undefined || args[0] < 0 || args[0] > 100 ){
        message.channel.send('Sir, the proper usage is !volume {0-100}');
    }
    try{
        const serverMusicQueue = client.queue.get(message.guild.id);
        serverMusicQueue.volume = volume_to_set;
        serverMusicQueue.connection.setVolumeLogarithmic(serverMusicQueue.volume / 100);
    }
    catch(err){
        console.log(err)
        message.channel.send('Sir, you are trolling me increasing the volume of nothing is useless.')
    }
}

