exports.run = (client, message, args) => {

    try{
        const serverMusicQueue = client.queue.get(message.guild.id);

        if(serverMusicQueue.loop){
          message.channel.send('Anything for you sir, I will now STOP looping the queue.');
          serverMusicQueue.loop = false;
        }
        else{
          message.channel.send('Anything for you sir, I will now START looping the queue.');
          serverMusicQueue.loop = true;
        }
    }
    catch(err){
        console.log(err)
        message.channel.send('Sir, you are tripping there is nothing in queue to loop.')
    }
}
