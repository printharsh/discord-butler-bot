const ytdl = require("ytdl-core");

function play(guild, song, serverMusicQueue) {
    if (!song) {
      serverMusicQueue.voiceChannel.leave();
      client.queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverMusicQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Currently playing: **${song.title}**`);
}


exports.run = async (client, message, args, serverMusicQueue) => {

    if(args[0] == undefined){
        return message.channel.send("Invalid usage. Proper usage: !play {some song name}")
    }
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel){
        return message.channel.send("You need to be in a voice channel to perform this command.");
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        console.log('You do not have permissions.')
        return message.channel.send("I do not have permission to connect and speak in your voice channel.");
    }

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    if (!serverQueue) {
        const thisServerQueue = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };
        client.queue.set(message.guild.id, thisServerQueue);
        thisServerQueue.songs.push(song)
        
        try {
            let connection = await voiceChannel.join();
            thisServerQueue.connection = connection;
            play(message.guild, thisServerQueue.songs[0], serverMusicQueue)
        }
        catch (err) {
            client.queue.delete(message.guild.id);
            return message.channel.send(`There was an error ${err}. Removing queue.`)
        }
    }
    else {
        // Already a queue so just push it.
        serverMusicQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }


}