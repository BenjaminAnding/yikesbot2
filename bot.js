var Discord = require('discord.io');
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
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
				// !ping
				case 'ping':
					bot.sendMessage({
						to: channelID,
						message: 'Pong!'
					});
					break;
				case 'nickcage':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					bot.sendMessage({
						to: channelID,
						message: 'https://www.placecage.com/'+width+'/'+height
					});
					break;
				case 'billmurray':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					bot.sendMessage({
						to: channelID,
						message: 'https://www.fillmurray.com/'+width+'/'+height
					});
					break;
				case 'stevensegal':
					height = randomNumber(100,300);
					width = randomNumber(100,300);
					logger.info(height+' '+width);
					bot.sendMessage({
						to: channelID,
						message: 'https://www.stevensegallery.com/'+width+'/'+height
					});
					break;
			}
	}
	// Let's also listen for ? messages:
    else if (message.substring(0, 1) == '?') {
		logger.info(message.toString())
        var args = message.substring(1).split(' ');
        args = args.splice(1);
		var cmd = user+'and I always have such insightful conversations.\n'+user+': Hello\nMe: Hi '+user+'\n\n\n'+user+': Nice to see you again, mind answering a quick question for me while I have \'ya?\nMe: Not at all!\nMe: I\'m all ears!\n\n\n'+user+': '+message.substring(1)+'\nMe:'
	    const { spawn } = require('child_process');
		const responses = []; // Store readings
		logger.info(cmd.toString())
		const yikes = spawn('python3', ['yikes.py', cmd.toString()]);
		yikes.stdout.on('data', function(data) {
			logger.info(data.toString())
			jsonObject = JSON.parse(data)
    		// convert Buffer object to Float
    		responses.push(data);
			var lines = jsonObject.choices[0].text.split("Me:")
			if (lines.length > 1) {
				for (var i = 0; i < lines.length; i++) {
					bot.sendMessage({
						to: channelID,
						message: lines[i]
					})
				}
			}
			else {
    			bot.sendMessage({
					to: channelID,
					message: jsonObject.choices[0].text.split("\n\n")[0]
				})
			}
		})
    }
    else if ((message.includes('yikesbot') || message.includes('yb')) && (user != 'yikesbot')) {
		if (user == 'BroccoliWalkway') {
			bot.sendMessage({
				to: channelID,
				message: cool.faces[randomNumber(0,9)]
			})
		}
		else {
			bot.sendMessage({
				to: channelID,
				message: cool().toString()
			});
		}
	}
	else if ((message.substring(0,3) == '```') || (message.substring(0,3) == '"""')) {
		if (!(user == 'yikesbot')) {
			cmd = message;
		}
		else {
			cmd = "I'm a pretty butterfly!"
	    }
		if (!(cmd == "I'm a pretty butterfly!")) {
			const { spawn } = require('child_process');
			const responses = []; // Store readings
			logger.info(cmd.toString())
			const yikes = spawn('python3', ['yikes.py', cmd.toString()]);
			yikes.stdout.on('data', function(data) {
				logger.info(data.toString())
				jsonObject = JSON.parse(data)
    			responses.push(data);
    			bot.sendMessage({
					to: channelID,
					message: '\`\`\`'+jsonObject.choices[0].text+'\`\`\`'
				})
			})
			bot.sendMessage({
				to: channelID,
				message: '@'+user
			})
		}		
	}
});
