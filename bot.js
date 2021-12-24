require('dotenv').config();
var { Client, Intents } = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var cool = require('cool-ascii-faces');
function randomNumber(min, max) {  
    return Math.floor(Math.random() * (max - min) + min); 
}  
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var chatlog = [];
// Initialize Discord Bot
var bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] })


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('messageCreate', function (message) {
//function (message.author.username, message.author.usernameID, message.channel.id, message, evt) 
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	var channel = bot.channels.cache.get(message.channel.id);
	chatlog.push(message.author.username+':'+message.content)
	logger.info(message)
	if (chatlog.length >= 25) {
		chatlog.pop()
	}
	if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
				// !ping
				case 'ping':
					channel.send('pong')
					break;
				case 'nickcage':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					channel.send('https://www.placecage.com/'+width+'/'+height)
					break;
				case 'billmurray':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					channel.send('https://www.fillmurray.com/'+width+'/'+height)
					break;
				case 'stevensegal':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					channel.send('https://www.stevensegallery.com/'+width+'/'+height)
					break;
				case 'pong':
					logger.debug(chatlog)
					message.react('🧮')
					break;
		}
	}
	// Let's also listen for ? messages:
    else if (message.content.substring(0, 1) == '?') {
		logger.info(message.content.toString())
        var args = message.content.substring(1).split(' ');
        args = args.splice(1);
		if (chatlog.length <= 17) {
			message.react('🐌')
		}
		cmd = ""
		chatlog.forEach( function(item, index) {
			cmd += item.toString()
			cmd += '\n'
		})
		cmd += message.author.username+':'+message.content.substring(1)+'\nyikesbot:'
	    const { spawn } = require('child_process');
		logger.info(cmd.toString())
		const yikes = spawn('python3', ['yikes.py', cmd.toString(), 100, '\n\n', 'davinci']);
		yikes.stdout.on('data', function(data) {
			logger.info(data.toString())
			jsonObject = JSON.parse(data)
			var lines = jsonObject.choices[0].text.split("yikesbot:")
			if (lines.length > 1) {
				for (var i = 0; i < lines.length; i++) {
					channel.send(lines[i])
				}
			}
			else {
    			channel.send(lines[0])
			}
		})
	}
    else if ((message.content.includes('yikesbot') || message.content.includes('yb')) && (message.author.username != 'yikesbot')) {
				channel.send(cool().toString())
	}	
	else if ((message.content.substring(0,3) == '```') || (message.content.substring(0,3) == '"""')) {
		if (!(message.author.username == 'yikesbot')) {
			cmd = message;
		}
		else {
			cmd = "I'm a pretty butterfly!"
	    }
		if (!(cmd == "I'm a pretty butterfly!")) {
			const { spawn } = require('child_process');
			logger.info(cmd.toString())
			const yikes = spawn('python3', ['yikes.py', cmd.toString(), 400, '\n\n', 'davinci-codex']);
			yikes.stdout.on('data', function(data) {
				logger.info(data.toString())
				jsonObject = JSON.parse(data)
				channel.send(jsonObject.choices[0].text)
			})
			message.react('🤔')
		}		
	}
});

bot.login(process.env.BOT_TOKEN);
