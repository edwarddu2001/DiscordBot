const Discord = require("discord.js");
const bot = new Discord.Client();
const ytdl = require("ytdl-core");

var servers = {};

bot.once("ready", () => {
    console.log("FireBops is online!");
});

bot.on("message", message => {
    if(!message.content.startsWith("!") || message.author.bot){
        return;
    }

    let args = message.content.substring(1).split(" ");

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
                        connection.disconnect;
                    }
                })
            }

            if (!args[1]) {
                message.channel.send("Please provide a link after play!");
                return;
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
                play(connection, message)
            })
    }
});

bot.login("NzQwMjkyODYwMTIwOTI0MjI0.Xym5cw.u6hk7Rv6HNIO74HgUyiu9wewPJQ");