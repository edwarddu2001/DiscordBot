module.exports = {
    name: 'disconnect',
    description: 'This is will disconnect the bot',
    execute(message, args){
        const connection = message.guild.voiceConnection;
        if(connection){
            message.guild.voiceConnection.disconnect();
        }
    }
}