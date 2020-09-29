const ytdl = require("ytdl-core");
const yts = require("yt-search");

function play(message, song) {
    const serverMusicQueue = message.client.queue.get(message.guild.id)
    console.log(serverMusicQueue)
    console.log(song)
    if (!song) {
      serverMusicQueue.voiceChannel.leave();
      message.client.queue.delete(message.guild.id);
      return;
    }

    const dispatcher = serverMusicQueue.connection
      .playStream(ytdl(song.url))
      .on("end", () => {
        console.log('in here!')
        
        let justPlayedSong = serverMusicQueue.songs.shift();
        if(serverMusicQueue.loop){
            // Add to end.
            serverMusicQueue.songs.push(justPlayedSong);
        }
        play(message, serverMusicQueue.songs[0]);
      })
      .on("error", error => {
        console.error(error)
        let justPlayedSong = serverMusicQueue.songs.shift();
        if(serverMusicQueue.loop){
            // Add to end.
            serverMusicQueue.songs.push(justPlayedSong);
        }
        play(message, serverMusicQueue.songs[0]);
      });
    dispatcher.setVolumeLogarithmic(serverMusicQueue.volume / 5);
    serverMusicQueue.textChannel.send(`Currently playing: **${song.title}**`);
}


exports.run = async (client, message, args) => {
    const serverMusicQueue = message.client.queue.get(message.guild.id)
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
            loop: false,
            volume: 5,
            playing: true
        };
        client.queue.set(message.guild.id, thisServerQueue);
        thisServerQueue.songs.push(song)

        let connection = await voiceChannel.join();
        thisServerQueue.connection = connection;
        play(message, thisServerQueue.songs[0])
    }
    catch (err) {
        client.queue.delete(message.guild.id);
        return message.channel.send(`There was an error ${err}. Removing queue.`)
    }


}
