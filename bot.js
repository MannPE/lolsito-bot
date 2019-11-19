var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
const top100 = require("./commands/top100/main");
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});
bot.on("ready", function(evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function(user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  logger.info(`Reading a message ${message}- from ${user}`);
  if (message.startsWith("lolsito ") || message.startsWith("@lolsito ")) {
    var args = message.split(" ");
    logger.info(`ARGS FOR THIS MESSAGE: ${args}`);
    var cmd = args[1];
    logger.info(`ARGS FOR THIS MESSAGE: ${args}`);

    logger.info(args);
    switch (cmd) {
      // !ping
      case "hola":
        bot.sendMessage({
          to: channelID,
          message: `Hola. Te amo @${user}`
        });
        break;
      case "registrame":
        bot.sendMessage({
          to: channelID,
          message: `Ok asocie tu cuenta de discord con el usuario: ${args[0]}`
        });
        break;
      case "top100":
        top100.getTop100(bot, channelID, args.slice(2).join(" "));
        break;
      default:
        bot.sendMessage({
          to: channelID,
          message: "ASi no se usa el bot brgas e.e"
        });
      // Just add any case commands if you want to..
    }
  }
});
