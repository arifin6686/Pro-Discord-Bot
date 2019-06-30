module.exports ={
    permissions: "none",
    help: "Ping!",
    commandFunction: function (args, message, client) {
    	if (args[0]) return message.channel.send(unxa);
    	let pongc = Math.floor(Math.random()*1000);
    	if (pongc < 50) return message.channel.send('You win!');
    	if (pongc > 900) return message.channel.send('You lose.');
        message.channel.send("Pong!");
    }
}