exports.run = (client, message, args, serverMusicQueue) => {
    if (!message.member.voiceChannel)
      return message.channel.send("You have to be in a voice channel to stop the music!");
      serverMusicQueue.songs.pop();
    serverMusicQueue.connection.dispatcher.end();
}