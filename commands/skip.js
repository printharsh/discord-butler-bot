exports.run = (client, message, args) => {
    const serverMusicQueue = message.client.queue.get(message.guild.id)

    if (!message.member.voiceChannel){
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
    }
    if (!serverMusicQueue) {
        return message.channel.send("There is no song that I could skip!");
    }
    else{
        try{
            serverMusicQueue.playing = true
            serverMusicQueue.connection.dispatcher.end();
        }
        catch(err){
            console.log(err);
        }
    }
}