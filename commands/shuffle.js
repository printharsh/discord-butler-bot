exports.run = (client, message, args) => {
    try{
        const serverMusicQueue = client.queue.get(message.guild.id);

        if(serverMusicQueue.shuffle){
          message.channel.send('Sir, I am extremely sad that you do not enjoy my SHUFFLE.');
          serverMusicQueue.shuffle = false;
        }
        else{
          message.channel.send('Seems like you\'re feeling frisky today sir, time to SHUFFLE.');
          serverMusicQueue.shuffle = true;
        }
    }
    catch(err){
        console.log(err)
        message.channel.send('Sir, you are tripping there is nothing for to shuffle.')
    }
}
