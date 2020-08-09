const Discord = require("discord.js");
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
const { brotliCompress, brotliCompressSync } = require("zlib");
const prefix = '!';

var servers = {};

bot.once("ready", () => {
    console.log("Torchlight is online!");
});

bot.on("message", message => {
    if(!message.content.startsWith("!") || message.author.bot){
        return;
    }

    let args = message.content.slice(prefix.length).split(/ +/);
    
    const command = args.shift().toLowerCase();
    const fs = require('fs');
        
    switch(args[0]) {         
        case "play":
            function play(connection, message) {
                var server = servers[message.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("end", function() {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                })
            }
                
            if (!message.member.voice.channel) {
                message.channel.send("Please join a voice channel to play!");
                return;
            }
                
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];
            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                play(connection, message);
            })

            break;

            //Fix skip
            case 'skip':
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
                message.channel.send("Skipping the song");
                break;

                case 'stop':
                    var server = servers[message.guild.id];
                    if(server.dispatcher) server.dispatcher.end();
                    message.channel.send('Ending the queue.');
                    console.log('stopped the queue');
                    break;
                
                   
    }
    bot.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
                
    for(const file of commandFiles){
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }
            
    if(command === 'ping'){
        bot.commands.get('ping').execute(message, args);
    } else if(command === 'off'){
        message.channel.send('Turning off bot');
        bot.destroy();
    } 
});


// Turns bot on, keep at end of file
bot.login("NzQwMzEwNzk2OTQwMzQ1NDgy.XynKKA.9FdXtGpr9cNjaKtCVYteppfrHk4");