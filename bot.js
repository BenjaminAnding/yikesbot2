require('dotenv').config();
var spawn = require("child_process").spawn;
var console = require('console');
var { Client, Intents } = require('discord.js');
var auth = require('./auth.json');
var cool = require('cool-ascii-faces');
var channels = {};
const deck = '🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞';
function randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
};
var chatlog = [];
// Initialize Discord Bot
var bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('messageCreate', function (message) {
//function (message.author.username, message.author.usernameID, message.channel.id, message, evt) 
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	var channelid = bot.channels.cache.get(message.channel.id)
	console.log(channelid)
	console.log()
	console.log()
	console.log()
	console.log(message)
	if (!(channels.hasOwnProperty(channelid))) {
		channels.channelid = [];
	}
	chatlog = channels.channelid
	chatlog.push(message.content)
	for (const channel in channels) {
		chatlog = channels.channelid
		if (chatlog.length >= 25) {
			chatlog.pop()
		}
	}
	if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
				// !ping
				case 'ping':
					channelid.send('pong')
					break;
				case 'nickcage':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					console.log(height+' '+width);
					channelid.send('https://www.placecage.com/'+width+'/'+height)
					break;
				case 'billmurray':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					console.log(height+' '+width);
					channelid.send('https://www.fillmurray.com/'+width+'/'+height)
					break;
				case 'stevensegal':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					console.log(height+' '+width);
					channelid.send('https://www.stevensegallery.com/'+width+'/'+height)
					break;
				case 'pong':
					console.log(chatlog)
					console.log(chatlog.length)
					message.react('🧮')
					break;
				case 'F':
					console.log(chatlog)
					chatlog = []
					break;
	    }
	}
    else if ((message.content.includes('yikesbot') || message.content.includes('yb')) && (message.author.username != 'yikesbot')) {
		console.log(message.content.toString())
        var args = message.content.split(' ');
		if (chatlog.length <= 5) {
			message.react('🐌')
		}
		cmd = ""
		chatlog.forEach( function(item, index) {
			cmd += item.toString()
			cmd += '\n'
		})
		cmd += message.author.username+':'+message.content.substring(1)+'\nyikesbot:'
		console.log(cmd.toString())
		var yikes = spawn('python3', ['yikes.py', cmd.toString(), 100, '\n\n', 'davinci']);
		yikes.stdout.on('data', function(data) {
			console.log(data.toString())
			jsonObject = JSON.parse(data)
			var lines = jsonObject.choices[0].text.split("yikesbot:")
			if (lines.length > 1) {
				for (var i = 0; i < lines.length; i++) {
					channelid.send(lines[i])
				}
			}
			else {
    			channelid.send(lines[0])
			}
		})
	}
	else if ((message.content.substring(0,3) == '```') || (message.content.substring(0,3) == '"""')) {
		if (!(message.author.username == 'yikesbot')) {
			cmd = message.author.username+':'+message.content+'\nyikesbot:';
		}
		else {
			cmd = "I'm a pretty butterfly!"
	    }
		if (!(cmd == "I'm a pretty butterfly!")) {
			console.log(cmd.toString())
			var yikes = spawn('python3', ['yikes.py', cmd.toString(), 400, '\n\n', 'davinci-codex']);
			yikes.stdout.on('data', function(data) {
				console.log(data.toString())
				jsonObject = JSON.parse(data)
				channelid.send(jsonObject.choices[0].text)
			})
			message.react('🤔')
		}		
	}
    else if ((message.content.includes('yikesbot') || message.content.includes('yb')) && (message.author.username != 'yikesbot')) {
				channelid.send(cool().toString())
	}	
});

bot.login(process.env.BOT_TOKEN);
