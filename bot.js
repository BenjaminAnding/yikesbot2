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
        //var cmd = user.toString()+': '+message.substring(1)+'\n Yikesbot: ';
		//var cmd = 'My second grader asked me this: \"'+message.substring(1)+'\". I decided the simplest way to explain was to say: ';
		var cmd = "Yikesbot is an incredibly helpful AI language model trained on the pile. An internet chat is interacting with Yikesbot. User \""+user.toString()+"\" says: \""+message.substring(1)+"\". Yikesbot responds by saying: \""; 
        args = args.splice(1);
	
	    const { spawn } = require('child_process');
		const responses = []; // Store readings
		logger.info(cmd.toString())
		const yikes = spawn('python3', ['yikes.py', cmd.toString()]);
		yikes.stdout.on('data', function(data) {
			logger.info(data.toString())
			jsonObject = JSON.parse(data)
    		// convert Buffer object to Float
    		responses.push(data);
    		bot.sendMessage({
				to: channelID,
				message: jsonObject.choices[0].text.split("\\\\\".")[0]
			})
		})
    }
    else if ((message.includes('yikesbot') || message.includes('yb')) && (user != 'yikesbot')) {
		if (user == 'BroccoliWalkway') {
			bot.sendMessage({
				to: channelID,
				message: cool.faces
			})
		}
		else {
			bot.sendMessage({
				to: channelID,
				message: cool().toString()
			});
		}
	}
	else if (message.substring(0,3) == '```') {
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
