const Discord = require("discord.js");
const {MessageAttachment } = require('discord.js');
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
var fetchVideoInfo = require("youtube-info");

var servers = {};

bot.once("ready", () => {
    console.log("FireBops is online!");
});

bot.on("message", message => {
    if(!message.content.startsWith("!") || message.author.bot){
        return;
    }

    let args = message.content.substring(1).split(" ");
    const fs = require('fs');


    // Music Player Function
    if(args[0] === 'play' || args[0] === 'skip' || args[0] === 'stop'){
    switch(args[0]) {
        case "play":
            function play(connection, message) {
                if(!server.queue[1])
				{server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}))}
					server.dispatcher.on("finish",function()
					{
						server.queue.shift()
						if(server.queue[0])
						{
							play(connection,message)
						}
						else
						{
							server.queue.push(args[1]);
						}
					})
            }


              /*
                server.queue.shift();

                server.dispatcher.on("finish", function() {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                })
            }*/

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

            /*
            fetchVideoInfo("Uz3zBZQzO5Q").then(function(videoInfo) {
              console.log(videoInfo);
            });

            fetchVideoInfo("Uz3zBZQzO5Q", function(err, videoInfo) {
                if (err) throw new Error(err);
                message.reply(" The song: **" + videoInfo.title + "** has been added to the queue list.");
            });
            */
           
            if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection) {
                message.channel.send("Playing bop... :notes::musical_note:");
                play(connection, message);
            })
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song... :next_track:");
            
            /*if (server.queue[0]) {
                server.queue.shift();
                message.channel.send("Skipping the song... :next_track:");
            } else {
                message.channel.send("No more songs to skip!");
            }*/
            
        break;

        case 'stop':
            message.member.voice.channel.leave();
            message.channel.send("Seeya Later! :kiss:");
        break;
    }
 
//Moderation Bot Function
// If the message content starts with "!kick", retrieved from discord.js docs
} else if (message.content.startsWith('!kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
          .kick('Optional reason that will display in the audit logs')
          .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to kick the member');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
      }
      // Otherwise, if no user was mentioned
    } else {
      message.reply("You didn't mention the user to kick!");
    }

// if the message content starts with "!ban", retrieved from discord.js docs
} else if (message.content.startsWith('!ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
         */
        member
          .ban({
            reason: 'They were bad!',
          })
          .then(() => {
            // We let the message author know we were able to ban the person
            message.reply(`Successfully banned ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to ban the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to ban the member');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
      }
    } else {
      // Otherwise, if no user was mentioned
      message.reply("You didn't mention the user to ban!");
    }
} else{
    /*An Advanced command handler that reads code files from the commands folder 
    when trying to execute certain commands*/
    bot.commands = new Discord.Collection();
    const command = args.shift().toLowerCase();
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
                
    for(const file of commandFiles){
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }
      
    //Commands that the bot will understand and execute, use content.startsWith for commands that have spaces in them
    if(command === 'ping'){
        bot.commands.get('ping').execute(message, args); 
    } else if(command === 'rip'){
         //Used for sending images to discord channel
         const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
         // Send the attachment in the message channel
         message.channel.send(attachment);
    } else if (message.content.startsWith('!what is my avatar')) {
        // Send the user's avatar URL
        message.channel.send(`This is ${message.author}'s avatar.`);
        message.channel.send(message.author.displayAvatarURL());
    } else if(command === 'off'){
        message.channel.send('Turning off..').then(m => {
            bot.destroy();
        });
    }
}
});

bot.login("Bot Token Here");
