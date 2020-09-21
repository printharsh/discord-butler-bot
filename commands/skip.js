exports.run = (client, message, args, serverMusicQueue) => {
    if (!message.member.voiceChannel){
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
    }
    if (!serverMusicQueue) {
        return message.channel.send("There is no song that I could skip!");
    }
    
    serverMusicQueue.connection.dispatcher.end();
}