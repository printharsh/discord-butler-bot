const ytdl = require("ytdl-core");
const yts = require("yt-search");

function play(guild, song) {
    const serverMusicQueue = client.queue.get(guild.id)
    if (!song) {
      serverMusicQueue.voiceChannel.leave();
      client.queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverMusicQueue.connection
      .playStream(ytdl(song.url))
      .on("finish", () => {
        serverMusicQueue.songs.shift();
        play(guild, serverMusicQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverMusicQueue.volume / 5);
    serverMusicQueue.textChannel.send(`Currently playing: **${song.title}**`);
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

    let songTitleSearch = message.content.slice(client.settings.cmdPrefix.length).trim().split(/ (.+)/)[1]
    
    let song;
    if (ytdl.validateURL(songTitleSearch)) {
      const songInfo = await ytdl.getInfo(songTitleSearch);
      song = {
        title: songInfo.title,
        url: songInfo.video_url
      };
    } else {
      const {videos} = await yts(songTitleSearch);
      if (!videos.length) return message.channel.send("No songs were found!");
      song = {
        title: videos[0].title,
        url: videos[0].url
      };
    }

    if(serverMusicQueue) {
        // Already a queue so just push it.
        serverMusicQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
    
    try {
        var thisServerQueue = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        client.queue.set(message.guild.id, thisServerQueue);
        thisServerQueue.songs.push(song)

        let connection = await voiceChannel.join();
        console.log(thisServerQueue)
        thisServerQueue.connection = connection;
        play(message.guild, thisServerQueue.songs[0])
    }
    catch (err) {
        client.queue.delete(message.guild.id);
        return message.channel.send(`There was an error ${err}. Removing queue.`)
    }


}