exports.run = (client, message, args) => {
    const serverMusicQueue = message.client.queue.get(message.guild.id)
    let numberToRemove = args[0] - 1
    if(numberToRemove < 0 || numberToRemove > len(serverMusicQueue.songs)){
      return message.channel.send(
            "Sir, I humbly request you to stop with these absurd requests. It's !remove {index of song to remove}."
          );
    }
    if (!serverMusicQueue) {
        return message.channel.send("There is nothing in queue to remove.");
    }
    else{
        try{
            let deletedSong = serverMusicQueue.songs.splice(numberToRemove, 1)
            return message.channel.send(`As per your request, I have removed ${deletedSong[0].song.title}`);
        }
        catch(err){
            console.log(err);
        }
    }
}