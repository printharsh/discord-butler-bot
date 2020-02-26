module.exports = (client) => {
    logger.info(`Successfully connected to ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    client.user.setStatus('invisible')
}