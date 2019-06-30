let http = require('http');
let express = require('express');
let app = express();
let fs = require('fs');
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  http.get('http://puzzled-pull.glitch.me/');
  console.log('Pinging for life.')
}, 240000);
app.use(express.static('public'));

//Bot script commences

let Discord = require("discord.js");
let client = new Discord.Client();
let bans = require('./bans.js');
let warningchannel = '';
let exemptedchannels = [];
let exemptedusers = [];
let admin = [];
global.prefix = process.env.PREFIX;
global.unxa = 'Unexpected number of arguments.';
global.toId = function toId(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}
client.on("ready", () => {
  console.log(`Bot has connected to Discord.`); 
  client.user.setActivity("a game");
});
client.on("message", async message => {
  if (message.author.bot) return;
  bans.banwords.forEach(function(element) {
    if (toId(message.content).includes(toId(element)) && !exemptedchannels.includes(message.channel.id) && !exemptedusers.includes(message.author.id)) {
      message.channel.send('Your message was flagged as inappropriate.').then(sentMessage => {
        sentMessage.delete(5000);
      });
      message.delete();
      client.channels.get(warningchannel).send(`${message.author.username} \(ID: ${message.author.id}\) has sent the following message: \`\`\`${message.content}\`\`\`\n It was deleted by automated moderation.`)
    }
  });
  if (!message.content.startsWith()) return; //commence intended commands
  client.on("message", async message => {
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    let messagecontent = message.content.substr((prefix).length);
    let args = messagecontent.split(' ');
    let command = args.shift().toLowerCase();
    if (command === 'help') {
      if (!args[0] || args[0].toLowerCase() === 'help') return message.channel.send('Uhh, what do you need help with?');
      fs.readdir('./commands', (e, files) => {
        if (args[0].toLowerCase() === 'eval') return message.channel.send('Admin stuff. Shh.');
        if (!files.includes(`${args[0].toLowerCase()}.js`)) return message.channel.send('Command not found.');
        let commandFile = require(`./discordcommands/${args[0].toLowerCase()}.js`);
        if (commandFile.help == undefined) return message.channel.send('Help for this command was not found.');
        if (commandFile.permissions === 'admin' && !admin.includes(message.author.id)) return message.channel.send('Admin stuff. Shh.');
        return message.channel.send(commandFile.help);
      });
      return;
    }
    if (command === 'eval') {
      if (!admin.includes(message.author.id)) return message.channel.send('Access denied.');
      try {
        message.channel.send(`<< ${eval(args.join(' '))}`);
      }
      catch (e) {
        message.channel.send(`<< ${e.message}`);
        console.log(e.stack);
      }
      return;
    }
    fs.readdir('./commands', (e, files) => {
      if (!files.includes(`${command}.js`)) return message.channel.send('Command not found.');
      let commandFile = require(`./discordcommands/${command}.js`);
      if (commandFile.permissions === 'admin') {
        if (!admin.includes(message.author.id)) return message.channel.send('Access denied.');
        return commandFile.commandFunction(args, message, client);
      }
      else if (commandFile.permissions === 'none') {
        return commandFile.commandFunction(args, message, client);
      }
      else return message.channel.send('Something went wrong.');
    });
  });
});
client.on('error', err => {
  console.log(err);
});
client.login(process.env.TOKEN)

