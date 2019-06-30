module.exports = {
	permissions: 'admin',
	help: `!code Adds persistent commands. Syntax: ${prefix}addcommand (commandname); (commandpermissions); (command help); (command output)\nThe permissions are to be entered as any ONE of the following: admin, none. Rank permissions carry over to higher ranks.\nDo not include any non-alphanumeric characters in the command name, or any semicolons in the help. Do not use the " or ' characters.`,
	commandFunction: function (args, message, client) {
		const fs = require('fs');
		if (!args[0]) return message.channel.send('Invalid input.');
		let permarr = ['admin', 'none'];
		let remma = args.join(' ');
		let remmargs = remma.split(';');
		let cspeco = remmargs.shift();
		let speco = toId(cspeco);
		fs.readdir('./commands', (e, files) => {
			let carr = [];
			files.forEach(function(element) {
				if (element.endsWith('.js')) {
					carr.push(element.slice(0,-3));
				}
			});
			if (carr.includes(speco)) return message.channel.send('That command already exists.');
			if (!remmargs[2]) return message.channel.send(unxa);
			let comper = remmargs.shift();
			if (!permarr.includes(toId(comper))) return message.channel.send('Invalid permissions type.');
			let comhelp = remmargs.shift();
			let comout = remmargs.join(';');
			let remmes = args.join(' ');
		    let commandcontent = `module.exports ={\n    permissions: "${toId(comper)}",\n    help: \`${comhelp}\`,\n    commandFunction: function (args, message, client) {\n        message.channel.send(\`${comout}\`);\n    }\n}`;
			fs.writeFile(`./discordcommands/${speco}.js`, commandcontent, function(err) {
				if (err) console.log(err);
				message.channel.send('Command added.');
			})
		});
	}
}